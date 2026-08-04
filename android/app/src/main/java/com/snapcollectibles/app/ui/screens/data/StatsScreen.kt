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
import com.snapcollectibles.app.data.hasRoiData
import com.snapcollectibles.app.data.portfolioValue
import com.snapcollectibles.app.data.preferredValue
import com.snapcollectibles.app.data.unrealizedGain
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
    val portfolio = owned + selling

    val totalPreferred = portfolio.sumOf { it.portfolioValue }
    val costBasis = portfolio
        .filter { it.purchasePrice > 0 }
        .sumOf { it.purchasePrice * it.quantity.coerceAtLeast(1) }
    val unrealized = portfolio.filter { it.hasRoiData }.sumOf { it.unrealizedGain }
    val ebayCoverage = portfolio.count { it.ebayAvgSold > 0 }
    val amazonCoverage = portfolio.count { it.amazonPrice > 0 }
    val withValue = portfolio.count { it.preferredValue > 0 }

    val topCategories = portfolio
        .groupBy { it.category }
        .mapValues { (_, items) -> items.sumOf { it.portfolioValue } }
        .entries
        .sortedByDescending { it.value }
        .take(8)

    val locations = portfolio
        .filter { it.location.isNotBlank() }
        .groupBy { it.location }
        .mapValues { (_, items) ->
            items.sumOf { it.portfolioValue } to items.sumOf { it.quantity.coerceAtLeast(1) }
        }
        .entries
        .sortedByDescending { it.value.first }

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
            StatCard("Total Items", "${allItems.size} entries • ${portfolio.sumOf { it.quantity.coerceAtLeast(1) }} pieces (owned+selling)")
            StatCard("Market Value", "$${"%.2f".format(totalPreferred)}")
            StatCard("Cost Basis", if (costBasis > 0) "$${"%.2f".format(costBasis)}" else "— (add purchase prices)")
            StatCard(
                "Unrealized P/L",
                if (portfolio.any { it.hasRoiData }) {
                    val sign = if (unrealized >= 0) "+" else ""
                    "$sign$${"%.2f".format(unrealized)}"
                } else "—"
            )

            HorizontalDivider()

            Text("Valuation Coverage", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            StatCard("With preferred value", "$withValue / ${portfolio.size}")
            StatCard("eBay sold comps", "$ebayCoverage items")
            StatCard("Amazon (Rainforest)", "$amazonCoverage items")

            HorizontalDivider()

            Text("By List", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            StatCard("Collection", "${owned.size} • $${"%.2f".format(owned.sumOf { it.portfolioValue })}")
            StatCard("Selling", "${selling.size} • $${"%.2f".format(selling.sumOf { it.portfolioValue })}")
            StatCard("Wishlist", "${wishlist.size} • $${"%.2f".format(wishlist.sumOf { it.portfolioValue })}")

            if (topCategories.isNotEmpty()) {
                HorizontalDivider()
                Text("Top Categories by Value", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                topCategories.forEach { (cat, value) ->
                    Text("$cat: $${"%.2f".format(value)}")
                }
            }

            if (locations.isNotEmpty()) {
                HorizontalDivider()
                Text("By Location", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                locations.forEach { (loc, pair) ->
                    val (value, qty) = pair
                    Text("$loc: $qty pcs • $${"%.2f".format(value)}")
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
