package com.snapcollectibles.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.snapcollectibles.app.viewmodel.CollectibleViewModel

data class SeriesProgress(
    val series: String,
    val category: String,
    val ownedCount: Int,
    val target: Int,
    val totalValue: Double
) {
    val percent: Float
        get() = if (target > 0) (ownedCount.toFloat() / target).coerceIn(0f, 1f) else 0f
    val hasTarget: Boolean get() = target > 0
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SeriesScreen(
    viewModel: CollectibleViewModel,
    onBack: () -> Unit
) {
    val allItems by viewModel.allCollectibles.collectAsState()
    val owned = allItems.filter { it.status == "Owned" || it.status == "Selling" }

    val seriesList = remember(owned) {
        owned
            .filter { it.series.isNotBlank() }
            .groupBy { it.series.trim() to it.category }
            .map { (key, items) ->
                val (series, category) = key
                val target = items.map { it.seriesTarget }.firstOrNull { it > 0 }
                    ?: items.maxOfOrNull { it.seriesTarget } ?: 0
                SeriesProgress(
                    series = series,
                    category = category,
                    ownedCount = items.sumOf { it.quantity.coerceAtLeast(1) },
                    target = target,
                    totalValue = items.sumOf { it.preferredValue * it.quantity.coerceAtLeast(1) }
                )
            }
            .sortedWith(
                compareByDescending<SeriesProgress> { it.hasTarget }
                    .thenByDescending { it.ownedCount }
            )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Series Completion") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        if (seriesList.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize().padding(padding),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("No series data yet", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "Set the Series field on your items.\nOptionally set Series Target on any item in that series for completion %.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(padding),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                item {
                    Text(
                        "Completion is based on items you own (and are selling). Set “Series Target” on an item to define how many are in the full set.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(Modifier.height(8.dp))
                }
                items(seriesList) { sp ->
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(sp.series, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                            Text(sp.category, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Spacer(Modifier.height(8.dp))
                            if (sp.hasTarget) {
                                LinearProgressIndicator(
                                    progress = { sp.percent },
                                    modifier = Modifier.fillMaxWidth().height(8.dp)
                                )
                                Spacer(Modifier.height(6.dp))
                                Text(
                                    "${sp.ownedCount} / ${sp.target}  (${(sp.percent * 100).toInt()}%)",
                                    style = MaterialTheme.typography.bodyMedium
                                )
                            } else {
                                Text("${sp.ownedCount} owned  •  target not set", style = MaterialTheme.typography.bodyMedium)
                            }
                            Text(
                                "Value: $${"%.2f".format(sp.totalValue)}",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }
            }
        }
    }
}
