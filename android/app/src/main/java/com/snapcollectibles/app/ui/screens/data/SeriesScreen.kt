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
import com.snapcollectibles.app.data.portfolioValue
import com.snapcollectibles.app.viewmodel.CollectibleViewModel

data class SeriesGroup(
    val series: String,
    val ownedCount: Int,
    val pieceCount: Int,
    val target: Int,
    val seriesValue: Double,
    val category: String
) {
    val progress: Float
        get() = if (target > 0) (ownedCount.toFloat() / target).coerceIn(0f, 1f) else 0f
    val percentLabel: String
        get() = if (target > 0) "${(progress * 100).toInt()}%" else "—"
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SeriesScreen(
    viewModel: CollectibleViewModel,
    onBack: () -> Unit
) {
    val allItems by viewModel.allCollectibles.collectAsState()

    val groups = remember(allItems) {
        allItems
            .filter { it.status == "Owned" || it.status == "Selling" }
            .filter { it.series.isNotBlank() }
            .groupBy { it.series.trim() }
            .map { (series, items) ->
                val target = items.maxOfOrNull { it.seriesTarget } ?: 0
                SeriesGroup(
                    series = series,
                    ownedCount = items.size,
                    pieceCount = items.sumOf { it.quantity.coerceAtLeast(1) },
                    target = target,
                    seriesValue = items.sumOf { it.portfolioValue },
                    category = items.groupBy { it.category }.maxByOrNull { it.value.size }?.key ?: ""
                )
            }
            .sortedWith(
                compareByDescending<SeriesGroup> { it.seriesValue }
                    .thenBy { it.series.lowercase() }
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
        if (groups.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("No series yet", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "Set Series on items (and optional Series Target) to track completion.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                item {
                    Text(
                        "${groups.size} series • Owned + Selling",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                items(groups, key = { it.series }) { group ->
                    SeriesCard(group)
                }
            }
        }
    }
}

@Composable
private fun SeriesCard(group: SeriesGroup) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(group.series, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            if (group.category.isNotBlank()) {
                Text(group.category, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Text(
                "Owned: ${group.ownedCount} entries (${group.pieceCount} pcs)" +
                    if (group.target > 0) " • Target: ${group.target}" else "",
                style = MaterialTheme.typography.bodyMedium
            )
            Text(
                "Series value: $${"%.2f".format(group.seriesValue)}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.SemiBold
            )
            if (group.target > 0) {
                LinearProgressIndicator(
                    progress = { group.progress },
                    modifier = Modifier.fillMaxWidth()
                )
                Text(
                    "${group.percentLabel} complete (${group.ownedCount}/${group.target})",
                    style = MaterialTheme.typography.labelMedium
                )
            } else {
                Text(
                    "Set Series Target on any item in this series to track % complete",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
