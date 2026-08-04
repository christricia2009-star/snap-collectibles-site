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
fun StatsScreen(
    viewModel: CollectibleViewModel,
    onBack: () -> Unit
) {
    val allItems by viewModel.allCollectibles.collectAsState()

    val owned = allItems.filter { it.status == "Owned" }
    val selling = allItems.filter { it.status == "Selling" }
    val wishlist = allItems.filter { it.status == "Wishlist" }

    val totalPreferred = allItems.sumOf { it.preferredValue * it.quantity.coerceAtLeast(1) }
    val ownedValue = owned.sumOf { it.preferredValue * it.quantity.coerceAtLeast(1) }
    val sellingValue = selling.sumOf { it.preferredValue * it.quantity.coerceAtLeast(1) }
    val wishlistValue = wishlist.sumOf { it.preferredValue * it.quantity.coerceAtLeast(1) }

    val costBasis = allItems.filter { it.purchasePrice > 0 }
        .sumOf { it.purchasePrice * it.quantity.coerceAtLeast(1) }
    val itemsWithCost = allItems.count { it.purchasePrice > 0 }
    val unrealized = allItems.filter { it.hasRoiData }
        .sumOf { it.unrealizedGain * it.quantity.coerceAtLeast(1) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Collection Stats") },
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
            StatCard("Total Items", "${allItems.size}")
            StatCard("Total Market Value", "$${"%.2f".format(totalPreferred)}")

            if (costBasis > 0) {
                StatCard("Cost Basis ($itemsWithCost items)", "$${"%.2f".format(costBasis)}")
                StatCard(
                    "Unrealized P/L",
                    "${if (unrealized >= 0) "+" else ""}${"%.2f".format(unrealized)}"
                )
            }

            HorizontalDivider()

            Text("By List", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            StatCard("Collection", "${owned.size} items • $${"%.2f".format(ownedValue)}")
            StatCard("Selling", "${selling.size} items • $${"%.2f".format(sellingValue)}")
            StatCard("Wishlist", "${wishlist.size} items • $${"%.2f".format(wishlistValue)}")

            HorizontalDivider()

            Text("Top Categories (by count)", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            allItems.groupBy { it.category }
                .mapValues { it.value.size }
                .entries
                .sortedByDescending { it.value }
                .take(8)
                .forEach { (cat, count) ->
                    Text("$cat: $count")
                }

            if (allItems.any { it.location.isNotBlank() }) {
                HorizontalDivider()
                Text("Locations", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                allItems.filter { it.location.isNotBlank() }
                    .groupBy { it.location }
                    .mapValues { it.value.size }
                    .entries
                    .sortedByDescending { it.value }
                    .take(10)
                    .forEach { (loc, count) ->
                        Text("$loc: $count")
                    }
            }
        }
    }
}

@Composable
private fun StatCard(title: String, value: String) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(title, style = MaterialTheme.typography.labelMedium)
            Text(value, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        }
    }
}
