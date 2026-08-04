package com.snapcollectibles.app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.snapcollectibles.app.data.AppDatabase
import com.snapcollectibles.app.data.Collectible
import com.snapcollectibles.app.data.CollectibleRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

enum class SortOption {
    DATE_NEWEST,
    DATE_OLDEST,
    NAME_AZ,
    NAME_ZA,
    VALUE_HIGH,
    VALUE_LOW
}

class CollectibleViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = CollectibleRepository(
        AppDatabase.getInstance(application).collectibleDao()
    )

    private val _searchQuery = MutableStateFlow("")
    val searchQuery = _searchQuery.asStateFlow()

    private val _currentStatus = MutableStateFlow("Owned")
    val currentStatus = _currentStatus.asStateFlow()

    private val _sortOption = MutableStateFlow(SortOption.DATE_NEWEST)
    val sortOption = _sortOption.asStateFlow()

    private val _filterCategory = MutableStateFlow("")
    val filterCategory = _filterCategory.asStateFlow()

    private val _filterCondition = MutableStateFlow("")
    val filterCondition = _filterCondition.asStateFlow()

    private val _selectedIds = MutableStateFlow<Set<Long>>(emptySet())
    val selectedIds = _selectedIds.asStateFlow()

    val isSelectionMode = _selectedIds
        .map { it.isNotEmpty() }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), false)

    val collectibles: StateFlow<List<Collectible>> = combine(
        _searchQuery,
        _currentStatus,
        _sortOption,
        _filterCategory,
        _filterCondition
    ) { query, status, sort, cat, cond ->
        listOf(query, status, sort, cat, cond)
    }.flatMapLatest { params ->
        val query = params[0] as String
        val status = params[1] as String
        val sort = params[2] as SortOption
        val cat = params[3] as String
        val cond = params[4] as String

        val flow = if (query.isBlank()) {
            repository.getByStatus(status)
        } else {
            repository.search(query, status)
        }

        flow.map { list ->
            var filtered = list
            if (cat.isNotBlank()) filtered = filtered.filter { it.category == cat }
            if (cond.isNotBlank()) filtered = filtered.filter { it.condition == cond }

            when (sort) {
                SortOption.DATE_NEWEST -> filtered.sortedByDescending { it.dateAdded }
                SortOption.DATE_OLDEST -> filtered.sortedBy { it.dateAdded }
                SortOption.NAME_AZ -> filtered.sortedBy { it.name.lowercase() }
                SortOption.NAME_ZA -> filtered.sortedByDescending { it.name.lowercase() }
                SortOption.VALUE_HIGH -> filtered.sortedByDescending { it.estimatedValue }
                SortOption.VALUE_LOW -> filtered.sortedBy { it.estimatedValue }
            }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allCollectibles: StateFlow<List<Collectible>> = repository.getAll()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setStatus(status: String) {
        _currentStatus.value = status
        clearSelection()
    }

    fun setSortOption(option: SortOption) {
        _sortOption.value = option
    }

    fun setFilterCategory(category: String) {
        _filterCategory.value = category
    }

    fun setFilterCondition(condition: String) {
        _filterCondition.value = condition
    }

    fun clearFilters() {
        _filterCategory.value = ""
        _filterCondition.value = ""
    }

    fun toggleSelection(id: Long) {
        val current = _selectedIds.value.toMutableSet()
        if (current.contains(id)) current.remove(id) else current.add(id)
        _selectedIds.value = current
    }

    fun selectAll(ids: List<Long>) {
        _selectedIds.value = ids.toSet()
    }

    fun clearSelection() {
        _selectedIds.value = emptySet()
    }

    fun insert(collectible: Collectible) = viewModelScope.launch {
        repository.insert(collectible)
    }

    fun update(collectible: Collectible) = viewModelScope.launch {
        repository.update(collectible)
    }

    fun delete(collectible: Collectible) = viewModelScope.launch {
        repository.delete(collectible)
    }

    fun deleteSelected() = viewModelScope.launch {
        _selectedIds.value.forEach { id ->
            repository.deleteById(id)
        }
        clearSelection()
    }

    fun moveSelected(newStatus: String) = viewModelScope.launch {
        val selected = _selectedIds.value
        allCollectibles.value
            .filter { it.id in selected }
            .forEach { item ->
                repository.update(item.copy(status = newStatus))
            }
        clearSelection()
    }

    suspend fun getById(id: Long): Collectible? {
        return repository.getById(id)
    }

    fun insertAll(items: List<Collectible>) = viewModelScope.launch {
        items.forEach { repository.insert(it) }
    }

    fun isDuplicate(name: String, barcode: String): Boolean {
        val list = allCollectibles.value
        return list.any {
            (barcode.isNotBlank() && it.barcode.isNotBlank() && it.barcode.equals(barcode, ignoreCase = true)) ||
                    (name.isNotBlank() && it.name.equals(name.trim(), ignoreCase = true))
        }
    }

    /** Quick portfolio totals for dashboards */
    fun portfolioSummary(): Map<String, Double> {
        val items = allCollectibles.value
        val market = items.sumOf { it.preferredValue * it.quantity.coerceAtLeast(1) }
        val cost = items.filter { it.purchasePrice > 0 }
            .sumOf { it.purchasePrice * it.quantity.coerceAtLeast(1) }
        val gain = items.filter { it.hasRoiData }
            .sumOf { it.unrealizedGain * it.quantity.coerceAtLeast(1) }
        return mapOf(
            "market" to market,
            "cost" to cost,
            "gain" to gain
        )
    }

    /**
     * Batch re-value items. Skips items valued within [cacheHours] unless [force] is true.
     * Returns count of successfully updated items.
     */
    suspend fun batchRevalue(
        ids: Set<Long>,
        soldCompsKey: String,
        rainforestKey: String,
        force: Boolean = false,
        cacheHours: Int = 24,
        onProgress: (done: Int, total: Int, name: String) -> Unit = { _, _, _ -> }
    ): Int {
        val valuationService = com.snapcollectibles.app.data.ValuationService()
        val cacheMs = cacheHours * 60L * 60 * 1000
        val targets = allCollectibles.value.filter { it.id in ids }
        var updated = 0
        targets.forEachIndexed { index, item ->
            onProgress(index, targets.size, item.name)
            if (!force && item.isFreshlyValued(cacheMs)) {
                return@forEachIndexed
            }
            try {
                // Prefer eBay sold comps by name
                var ebayAvg = item.ebayAvgSold
                var ebayLow = item.ebayLow
                var ebayHigh = item.ebayHigh
                var ebayCount = item.ebaySampleCount
                if (soldCompsKey.isNotBlank() && item.name.isNotBlank()) {
                    val result = valuationService.getEbaySoldComps(soldCompsKey, item.name)
                    if (result != null) {
                        ebayAvg = result.avgPrice
                        ebayLow = result.minPrice
                        ebayHigh = result.maxPrice
                        ebayCount = result.count
                    }
                }
                var amazon = item.amazonPrice
                if (rainforestKey.isNotBlank() && item.barcode.isNotBlank()) {
                    val price = valuationService.getAmazonPrice(rainforestKey, item.barcode, isUpc = true)
                    if (price != null) amazon = price
                }
                val newEstimate = when {
                    ebayAvg > 0 -> ebayAvg
                    amazon > 0 -> amazon
                    else -> item.estimatedValue
                }
                repository.update(
                    item.copy(
                        ebayAvgSold = ebayAvg,
                        ebayLow = ebayLow,
                        ebayHigh = ebayHigh,
                        ebaySampleCount = ebayCount,
                        amazonPrice = amazon,
                        estimatedValue = if (item.estimatedValue == 0.0) newEstimate else item.estimatedValue,
                        lastValuedAt = System.currentTimeMillis()
                    )
                )
                updated++
                // Gentle rate limit
                kotlinx.coroutines.delay(400)
            } catch (_: Exception) {
                // continue
            }
        }
        onProgress(targets.size, targets.size, "Done")
        return updated
    }

}
