package com.snapcollectibles.app.ui.screens

import android.widget.Toast
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.snapcollectibles.app.data.ExportHelper
import com.snapcollectibles.app.ui.components.CollectibleCard
import com.snapcollectibles.app.viewmodel.CollectibleViewModel
import com.snapcollectibles.app.viewmodel.SortOption
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: CollectibleViewModel,
    onAddClick: () -> Unit,
    onItemClick: (Long) -> Unit,
    onSettingsClick: () -> Unit,
    onScanClick: () -> Unit,
    onStatsClick: () -> Unit,
    onSeriesClick: () -> Unit = {},
    onBulkScanClick: () -> Unit = {}
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    val collectibles by viewModel.collectibles.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val currentStatus by viewModel.currentStatus.collectAsState()
    val selectedIds by viewModel.selectedIds.collectAsState()
    val isSelectionMode by viewModel.isSelectionMode.collectAsState()
    val filterCategory by viewModel.filterCategory.collectAsState()
    val filterCondition by viewModel.filterCondition.collectAsState()

    val totalValue = collectibles.sumOf { it.preferredValue * it.quantity.coerceAtLeast(1) }

    // Keep home-screen widget in sync
    LaunchedEffect(collectibles) {
        val prefs = com.snapcollectibles.app.data.PreferencesManager(context)
        prefs.lastPortfolioValue = totalValue.toFloat()
        prefs.lastPortfolioCount = collectibles.size
        com.snapcollectibles.app.PortfolioWidgetProvider.refreshAll(context)
    }

    var showSortMenu by remember { mutableStateOf(false) }
    var showMoveMenu by remember { mutableStateOf(false) }
    var showFilterSheet by remember { mutableStateOf(false) }

    val snackbarHostState = remember { SnackbarHostState() }
    var isBatchRevaluing by remember { mutableStateOf(false) }
    var batchProgress by remember { mutableStateOf("") }

    val categories = listOf(
        "Funko", "Sports Cards", "Trading Cards", "Comics", "Coins",
        "Toys", "Action Figures", "Statues", "Pins", "Hot Wheels",
        "LEGO", "Video Games", "Other"
    )
    val conditions = listOf("Mint", "Near Mint", "Excellent", "Good", "Fair", "Poor")

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            if (isSelectionMode) {
                TopAppBar(
                    title = { Text("${selectedIds.size} selected") },
                    navigationIcon = {
                        IconButton(onClick = { viewModel.clearSelection() }) {
                            Icon(Icons.Default.Close, contentDescription = "Cancel")
                        }
                    },
                    actions = {
                        IconButton(onClick = {
                            viewModel.selectAll(collectibles.map { it.id })
                        }) {
                            Icon(Icons.Default.SelectAll, contentDescription = "Select All")
                        }
                        IconButton(
                            onClick = {
                                if (isBatchRevaluing) return@IconButton
                                val prefs = com.snapcollectibles.app.data.PreferencesManager(context)
                                if (prefs.soldCompsApiKey.isBlank() && prefs.rainforestApiKey.isBlank()) {
                                    Toast.makeText(context, "Set API keys in Settings first", Toast.LENGTH_LONG).show()
                                    return@IconButton
                                }
                                isBatchRevaluing = true
                                batchProgress = "Starting…"
                                scope.launch {
                                    val count = viewModel.batchRevalue(
                                        ids = selectedIds,
                                        soldCompsKey = prefs.soldCompsApiKey,
                                        rainforestKey = prefs.rainforestApiKey,
                                        force = false,
                                        cacheHours = 24
                                    ) { done, total, name ->
                                        batchProgress = "$done/$total $name"
                                    }
                                    isBatchRevaluing = false
                                    batchProgress = ""
                                    viewModel.clearSelection()
                                    Toast.makeText(context, "Re-valued $count items", Toast.LENGTH_LONG).show()
                                }
                            },
                            enabled = !isBatchRevaluing
                        ) {
                            if (isBatchRevaluing) {
                                CircularProgressIndicator(modifier = Modifier.size(20.dp))
                            } else {
                                Icon(Icons.Default.Refresh, contentDescription = "Re-value selected")
                            }
                        }
                        IconButton(onClick = { showMoveMenu = true }) {
                            Icon(Icons.Default.DriveFileMove, contentDescription = "Move")
                        }
                        IconButton(onClick = {
                            viewModel.deleteSelected()
                            Toast.makeText(context, "Deleted", Toast.LENGTH_SHORT).show()
                        }) {
                            Icon(Icons.Default.Delete, contentDescription = "Delete")
                        }
                        DropdownMenu(
                            expanded = showMoveMenu,
                            onDismissRequest = { showMoveMenu = false }
                        ) {
                            DropdownMenuItem(text = { Text("Move to Collection") }, onClick = {
                                viewModel.moveSelected("Owned"); showMoveMenu = false
                            })
                            DropdownMenuItem(text = { Text("Move to Selling") }, onClick = {
                                viewModel.moveSelected("Selling"); showMoveMenu = false
                            })
                            DropdownMenuItem(text = { Text("Move to Wishlist") }, onClick = {
                                viewModel.moveSelected("Wishlist"); showMoveMenu = false
                            })
                        }
                    }
                )
            } else {
                TopAppBar(
                    title = { Text("Snap Collectibles") },
                    actions = {
                        IconButton(onClick = onStatsClick) {
                            Icon(Icons.Default.BarChart, contentDescription = "Stats")
                        }
                        IconButton(onClick = onSeriesClick) {
                            Icon(Icons.Default.Category, contentDescription = "Series")
                        }
                        IconButton(onClick = onBulkScanClick) {
                            Icon(Icons.Default.Dashboard, contentDescription = "Bulk Scan")
                        }
                        IconButton(onClick = { showSortMenu = true }) {
                            Icon(Icons.Default.Sort, contentDescription = "Sort")
                        }
                        DropdownMenu(
                            expanded = showSortMenu,
                            onDismissRequest = { showSortMenu = false }
                        ) {
                            DropdownMenuItem(text = { Text("Newest First") }, onClick = {
                                viewModel.setSortOption(SortOption.DATE_NEWEST); showSortMenu = false
                            })
                            DropdownMenuItem(text = { Text("Oldest First") }, onClick = {
                                viewModel.setSortOption(SortOption.DATE_OLDEST); showSortMenu = false
                            })
                            DropdownMenuItem(text = { Text("Name A-Z") }, onClick = {
                                viewModel.setSortOption(SortOption.NAME_AZ); showSortMenu = false
                            })
                            DropdownMenuItem(text = { Text("Name Z-A") }, onClick = {
                                viewModel.setSortOption(SortOption.NAME_ZA); showSortMenu = false
                            })
                            DropdownMenuItem(text = { Text("Value High → Low") }, onClick = {
                                viewModel.setSortOption(SortOption.VALUE_HIGH); showSortMenu = false
                            })
                            DropdownMenuItem(text = { Text("Value Low → High") }, onClick = {
                                viewModel.setSortOption(SortOption.VALUE_LOW); showSortMenu = false
                            })
                        }
                        IconButton(onClick = {
                            val uri = ExportHelper.exportCollectionToCsv(context, collectibles)
                            if (uri != null) ExportHelper.shareCsv(context, uri)
                            else Toast.makeText(context, "Export failed", Toast.LENGTH_SHORT).show()
                        }) {
                            Icon(Icons.Default.Share, contentDescription = "Export")
                        }
                        IconButton(onClick = onSettingsClick) {
                            Icon(Icons.Default.Settings, contentDescription = "Settings")
                        }
                    }
                )
            }
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = false,
                    onClick = onScanClick,
                    icon = { Icon(Icons.Default.CameraAlt, contentDescription = null) },
                    label = { Text("Scan") }
                )
                NavigationBarItem(
                    selected = currentStatus == "Owned",
                    onClick = { viewModel.setStatus("Owned") },
                    icon = { Icon(Icons.Default.Home, contentDescription = null) },
                    label = { Text("Collection") }
                )
                NavigationBarItem(
                    selected = currentStatus == "Selling",
                    onClick = { viewModel.setStatus("Selling") },
                    icon = { Icon(Icons.Default.Sell, contentDescription = null) },
                    label = { Text("Selling") }
                )
                NavigationBarItem(
                    selected = currentStatus == "Wishlist",
                    onClick = { viewModel.setStatus("Wishlist") },
                    icon = { Icon(Icons.Default.Favorite, contentDescription = null) },
                    label = { Text("Wishlist") }
                )
            }
        },
        floatingActionButton = {
            if (!isSelectionMode) {
                FloatingActionButton(onClick = onAddClick) {
                    Icon(Icons.Default.Add, contentDescription = "Add")
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            if (collectibles.isNotEmpty() && !isSelectionMode) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer
                    )
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = when (currentStatus) {
                                "Selling" -> "Selling Value"
                                "Wishlist" -> "Wishlist Value"
                                else -> "Collection Value"
                            },
                            style = MaterialTheme.typography.labelMedium
                        )
                        Text(
                            text = "$${"%.2f".format(totalValue)}",
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold
                        )
                        Text("${collectibles.size} items", style = MaterialTheme.typography.bodySmall)
                    }
                }
            }

            OutlinedTextField(
                value = searchQuery,
                onValueChange = viewModel::setSearchQuery,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                placeholder = { Text("Search name, brand, barcode...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                singleLine = true
            )

            // Filter chip
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(
                    selected = filterCategory.isNotBlank() || filterCondition.isNotBlank(),
                    onClick = { showFilterSheet = true },
                    label = { Text("Filters") },
                    leadingIcon = {
                        Icon(Icons.Default.FilterList, contentDescription = null, modifier = Modifier.size(16.dp))
                    }
                )
                if (filterCategory.isNotBlank()) {
                    AssistChip(
                        onClick = { viewModel.setFilterCategory("") },
                        label = { Text(filterCategory) }
                    )
                }
                if (filterCondition.isNotBlank()) {
                    AssistChip(
                        onClick = { viewModel.setFilterCondition("") },
                        label = { Text(filterCondition) }
                    )
                }
            }

            if (collectibles.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = when (currentStatus) {
                                "Selling" -> "Nothing listed for sale"
                                "Wishlist" -> "Wishlist is empty"
                                else -> "No collectibles yet"
                            },
                            style = MaterialTheme.typography.titleMedium
                        )
                        Spacer(Modifier.height(8.dp))
                        Text("Tap + or use the Scan tab", style = MaterialTheme.typography.bodyMedium)
                    }
                }
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(collectibles, key = { it.id }) { item ->
                        val dismissState = rememberSwipeToDismissBoxState(
                            confirmValueChange = { value ->
                                when (value) {
                                    SwipeToDismissBoxValue.EndToStart -> {
                                        val deletedItem = item
                                        viewModel.delete(item)
                                        scope.launch {
                                            val result = snackbarHostState.showSnackbar(
                                                message = "Deleted \"${deletedItem.name}\"",
                                                actionLabel = "Undo",
                                                duration = SnackbarDuration.Short
                                            )
                                            if (result == SnackbarResult.ActionPerformed) {
                                                viewModel.insert(deletedItem.copy(id = 0))
                                            }
                                        }
                                        true
                                    }
                                    SwipeToDismissBoxValue.StartToEnd -> false
                                    else -> false
                                }
                            }
                        )

                        SwipeToDismissBox(
                            state = dismissState,
                            backgroundContent = {
                                val direction = dismissState.dismissDirection
                                val color by animateColorAsState(
                                    when (direction) {
                                        SwipeToDismissBoxValue.EndToStart -> Color(0xFFB00020)
                                        SwipeToDismissBoxValue.StartToEnd -> Color(0xFF2E7D32)
                                        else -> Color.Transparent
                                    },
                                    label = "swipeColor"
                                )
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .background(color)
                                        .padding(horizontal = 20.dp),
                                    contentAlignment = when (direction) {
                                        SwipeToDismissBoxValue.EndToStart -> Alignment.CenterEnd
                                        SwipeToDismissBoxValue.StartToEnd -> Alignment.CenterStart
                                        else -> Alignment.Center
                                    }
                                ) {
                                    when (direction) {
                                        SwipeToDismissBoxValue.EndToStart -> {
                                            Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color.White)
                                        }
                                        SwipeToDismissBoxValue.StartToEnd -> {
                                            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                                                IconButton(onClick = {
                                                    viewModel.update(item.copy(status = "Selling"))
                                                    scope.launch { dismissState.reset() }
                                                    Toast.makeText(context, "Moved to Selling", Toast.LENGTH_SHORT).show()
                                                }) {
                                                    Icon(Icons.Default.Sell, contentDescription = "Selling", tint = Color.White)
                                                }
                                                IconButton(onClick = {
                                                    viewModel.update(item.copy(status = "Wishlist"))
                                                    scope.launch { dismissState.reset() }
                                                    Toast.makeText(context, "Moved to Wishlist", Toast.LENGTH_SHORT).show()
                                                }) {
                                                    Icon(Icons.Default.Favorite, contentDescription = "Wishlist", tint = Color.White)
                                                }
                                            }
                                        }
                                        else -> {}
                                    }
                                }
                            },
                            enableDismissFromStartToEnd = true,
                            enableDismissFromEndToStart = true
                        ) {
                            val isSelected = selectedIds.contains(item.id)
                            CollectibleCard(
                                collectible = item,
                                isSelected = isSelected,
                                onClick = {
                                    if (isSelectionMode) viewModel.toggleSelection(item.id)
                                    else onItemClick(item.id)
                                },
                                onLongClick = { viewModel.toggleSelection(item.id) }
                            )
                        }
                    }
                }
            }
        }
    }

    // Filter bottom sheet
    if (showFilterSheet) {
        ModalBottomSheet(onDismissRequest = { showFilterSheet = false }) {
            Column(
                modifier = Modifier
                    .padding(16.dp)
                    .fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("Filter by Category", style = MaterialTheme.typography.titleSmall)
                categories.chunked(3).forEach { row ->
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        row.forEach { cat ->
                            FilterChip(
                                selected = filterCategory == cat,
                                onClick = {
                                    viewModel.setFilterCategory(if (filterCategory == cat) "" else cat)
                                },
                                label = { Text(cat) }
                            )
                        }
                    }
                }

                Text("Filter by Condition", style = MaterialTheme.typography.titleSmall)
                conditions.chunked(3).forEach { row ->
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        row.forEach { cond ->
                            FilterChip(
                                selected = filterCondition == cond,
                                onClick = {
                                    viewModel.setFilterCondition(if (filterCondition == cond) "" else cond)
                                },
                                label = { Text(cond) }
                            )
                        }
                    }
                }

                TextButton(onClick = {
                    viewModel.clearFilters()
                    showFilterSheet = false
                }) {
                    Text("Clear All Filters")
                }
                Spacer(Modifier.height(24.dp))
            }
        }
    }
}