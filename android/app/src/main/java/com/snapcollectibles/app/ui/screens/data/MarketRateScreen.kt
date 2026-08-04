package com.snapcollectibles.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.snapcollectibles.app.viewmodel.CollectibleViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MarketRateScreen(
    viewModel: CollectibleViewModel,
    onBack: () -> Unit
) {
    val allItems by viewModel.allCollectibles.collectAsState()

    val totalValue = allItems.sumOf { it.preferredValue * it.quantity.coerceAtLeast(1) }
    val ownedValue = allItems.filter { it.status == "Owned" }.sumOf { it.preferredValue * it.quantity.coerceAtLeast(1) }
    val sellingValue = allItems.filter { it.status == "Selling" }.sumOf { it.preferredValue * it.quantity.coerceAtLeast(1) }
    val wishlistValue = allItems.filter { it.status == "Wishlist" }.sumOf { it.preferredValue * it.quantity.coerceAtLeast(1) }

    val costBasis = allItems.filter { it.purchasePrice > 0 }
        .sumOf { it.purchasePrice * it.quantity.coerceAtLeast(1) }
    val unrealized = allItems.filter { it.hasRoiData }
        .sumOf { it.unrealizedGain * it.quantity.coerceAtLeast(1) }

    val avgValue = if (allItems.isNotEmpty()) totalValue / allItems.size else 0.0

    val topCategories = allItems
        .groupBy { it.category }
        .mapValues { (_, items) -> items.sumOf { it.preferredValue * it.quantity.coerceAtLeast(1) } }
        .entries
        .sortedByDescending { it.value }
        .take(6)

    val valuedWithEbay = allItems.count { it.ebayAvgSold > 0 }
    val valuedWithAmazon = allItems.count { it.amazonPrice > 0 }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Market Rate") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                "Collection Market Overview",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )

            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Total Preferred Market Value", style = MaterialTheme.typography.labelMedium)
                    Text(
                        "$${"%.2f".format(totalValue)}",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text("${allItems.size} items • Avg $${"%.2f".format(avgValue)}")
                    Text(
                        "eBay sold data: $valuedWithEbay • Amazon: $valuedWithAmazon",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            if (costBasis > 0) {
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("Cost Basis: $${"%.2f".format(costBasis)}")
                        Text(
                            "Unrealized P/L: ${if (unrealized >= 0) "+" else ""}${"%.2f".format(unrealized)}",
                            fontWeight = FontWeight.SemiBold,
                            color = if (unrealized >= 0) MaterialTheme.colorScheme.primary
                            else MaterialTheme.colorScheme.error
                        )
                    }
                }
            }

            Text("By List", style = MaterialTheme.typography.titleMedium)
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Collection: $${"%.2f".format(ownedValue)}")
                    Text("Selling: $${"%.2f".format(sellingValue)}")
                    Text("Wishlist: $${"%.2f".format(wishlistValue)}")
                }
            }

            if (topCategories.isNotEmpty()) {
                Text("Top Categories by Value", style = MaterialTheme.typography.titleMedium)
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        topCategories.forEach { (cat, value) ->
                            Text("$cat: $${"%.2f".format(value)}")
                        }
                    }
                }
            }

            Text(
                "Preferred value uses eBay sold average when available (most accurate for secondary market), then Amazon, then your manual estimate. Re-check prices regularly for the most accurate market rate.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
