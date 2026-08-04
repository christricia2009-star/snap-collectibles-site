package com.snapcollectibles.app.viewmodel

import android.app.Application
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Intent
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.snapcollectibles.app.data.AppDatabase
import com.snapcollectibles.app.data.Collectible
import com.snapcollectibles.app.data.CollectibleRepository
import com.snapcollectibles.app.data.PreferencesManager
import com.snapcollectibles.app.data.ValuationService
import com.snapcollectibles.app.data.portfolioValue
import com.snapcollectibles.app.data.preferredValue
import com.snapcollectibles.app.widget.PortfolioWidgetProvider
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
    private val prefs = PreferencesManager(application)
    private val valuationService = ValuationService()

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

    private val _batchRevalueProgress = MutableStateFlow<Pair<Int, Int>?>(null)
    /** null when idle; (done, total) while batch re-valuing. */
    val batchRevalueProgress = _batchRevalueProgress.asStateFlow()

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
                SortOption.VALUE_HIGH -> filtered.sortedByDescending { it.preferredValue }
                SortOption.VALUE_LOW -> filtered.sortedBy { it.preferredValue }
            }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allCollectibles: StateFlow<List<Collectible>> = repository.getAll()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        // Keep widget snapshot in sync with owned + selling market value.
        viewModelScope.launch {
            allCollectibles.collect { list ->
                val portfolio = list.filter { it.status == "Owned" || it.status == "Selling" }
                val value = portfolio.sumOf { it.portfolioValue }
                val count = portfolio.sumOf { it.quantity.coerceAtLeast(1) }
                prefs.updatePortfolioSnapshot(value, count)
                refreshWidget()
            }
        }
    }

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

    fun isDuplicate(name: String, barcode: String = ""): Boolean {
        val list = allCollectibles.value
        return list.any {
            (barcode.isNotBlank() && it.barcode.equals(barcode, ignoreCase = true)) ||
                (name.isNotBlank() && it.name.equals(name.trim(), ignoreCase = true))
        }
    }

    /**
     * Batch re-value selected items (or entire collection if [ids] is null/empty with [all] true).
     * Requires API keys in SharedPreferences. Skips items valued within 24h unless [force].
     */
    fun batchRevalue(
        ids: Set<Long>? = null,
        all: Boolean = false,
        force: Boolean = false,
        onFinished: (successCount: Int, total: Int) -> Unit = { _, _ -> }
    ) {
        viewModelScope.launch {
            val rainforest = prefs.rainforestApiKey
            val soldComps = prefs.soldCompsApiKey
            if (rainforest.isBlank() && soldComps.isBlank()) {
                onFinished(0, 0)
                return@launch
            }

            val source = when {
                all -> allCollectibles.value
                ids != null && ids.isNotEmpty() -> allCollectibles.value.filter { it.id in ids }
                else -> allCollectibles.value.filter { it.id in _selectedIds.value }
            }
            if (source.isEmpty()) {
                onFinished(0, 0)
                return@launch
            }

            _batchRevalueProgress.value = 0 to source.size
            val success = valuationService.batchRevalue(
                items = source,
                rainforestKey = rainforest,
                soldCompsKey = soldComps,
                force = force,
                onProgress = { done, total, _ ->
                    _batchRevalueProgress.value = done to total
                },
                onItemUpdated = { updated ->
                    repository.update(updated)
                }
            )
            _batchRevalueProgress.value = null
            if (!all) clearSelection()
            onFinished(success, source.size)
        }
    }

    fun revalueOne(
        item: Collectible,
        force: Boolean = true,
        onDone: (Collectible) -> Unit = {}
    ) {
        viewModelScope.launch {
            val updated = valuationService.revalueItem(
                item = item,
                rainforestKey = prefs.rainforestApiKey,
                soldCompsKey = prefs.soldCompsApiKey,
                force = force
            )
            repository.update(updated)
            onDone(updated)
        }
    }

    private fun refreshWidget() {
        val app = getApplication<Application>()
        val intent = Intent(app, PortfolioWidgetProvider::class.java).apply {
            action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            val ids = AppWidgetManager.getInstance(app)
                .getAppWidgetIds(ComponentName(app, PortfolioWidgetProvider::class.java))
            putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
        }
        app.sendBroadcast(intent)
    }
}
