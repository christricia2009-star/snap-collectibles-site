package com.snapcollectibles.app.ui.screens

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.snapcollectibles.app.data.PreferencesManager
import com.snapcollectibles.app.data.hasRoiData
import com.snapcollectibles.app.data.portfolioValue
import com.snapcollectibles.app.data.preferredValue
import com.snapcollectibles.app.data.unrealizedGain
import com.snapcollectibles.app.viewmodel.CollectibleViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MarketRateScreen(
    viewModel: CollectibleViewModel,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val allItems by viewModel.allCollectibles.collectAsState()
    val batchProgress by viewModel.batchRevalueProgress.collectAsState()

    val portfolio = allItems.filter { it.status == "Owned" || it.status == "Selling" }
    val totalValue = portfolio.sumOf { it.portfolioValue }
    val ownedValue = allItems.filter { it.status == "Owned" }.sumOf { it.portfolioValue }
    val sellingValue = allItems.filter { it.status == "Selling" }.sumOf { it.portfolioValue }
    val wishlistValue = allItems.filter { it.status == "Wishlist" }.sumOf { it.portfolioValue }
    val costBasis = portfolio.filter { it.purchasePrice > 0 }
        .sumOf { it.purchasePrice * it.quantity.coerceAtLeast(1) }
    val unrealized = portfolio.filter { it.hasRoiData }.sumOf { it.unrealizedGain }
    val avgValue = if (portfolio.isNotEmpty()) totalValue / portfolio.size else 0.0
    val ebayCoverage = portfolio.count { it.ebayAvgSold > 0 }
    val amazonCoverage = portfolio.count { it.amazonPrice > 0 }

    val topCategories = portfolio
        .groupBy { it.category }
        .mapValues { (_, items) -> items.sumOf { it.portfolioValue } }
        .entries
        .sortedByDescending { it.value }
        .take(6)

    val locations = portfolio
        .filter { it.location.isNotBlank() }
        .groupBy { it.location }
        .mapValues { (_, items) -> items.sumOf { it.portfolioValue } }
        .entries
        .sortedByDescending { it.value }
        .take(8)

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Market Rate") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(
                        onClick = {
                            val prefs = PreferencesManager(context)
                            if (prefs.rainforestApiKey.isBlank() && prefs.soldCompsApiKey.isBlank()) {
                                Toast.makeText(
                                    context,
                                    "Set Rainforest or SoldComps API key in Settings",
                                    Toast.LENGTH_LONG
                                ).show()
                                return@IconButton
                            }
                            viewModel.batchRevalue(all = true, force = false) { ok, total ->
                                Toast.makeText(
                                    context,
                                    "Updated $ok of $total (skipped fresh <24h)",
                                    Toast.LENGTH_LONG
                                ).show()
                            }
                        },
                        enabled = batchProgress == null
                    ) {
                        Icon(Icons.Default.Refresh, contentDescription = "Re-value collection")
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
            batchProgress?.let { (done, total) ->
                LinearProgressIndicator(
                    progress = { if (total > 0) done.toFloat() / total else 0f },
                    modifier = Modifier.fillMaxWidth()
                )
                Text("Re-valuing $done / $total…", style = MaterialTheme.typography.labelSmall)
            }

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
                    Text(
                        "${portfolio.size} entries • Avg $${"%.2f".format(avgValue)} (eBay > Amazon > manual)",
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }

            Card(modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("Cost basis: ${if (costBasis > 0) "$${"%.2f".format(costBasis)}" else "—"}")
                    Text(
                        "Unrealized P/L: ${
                            if (portfolio.any { it.hasRoiData }) {
                                val s = if (unrealized >= 0) "+" else ""
                                "$s$${"%.2f".format(unrealized)}"
                            } else "—"
                        }"
                    )
                    Text("eBay coverage: $ebayCoverage • Amazon: $amazonCoverage")
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

            if (locations.isNotEmpty()) {
                Text("By Location", style = MaterialTheme.typography.titleMedium)
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        locations.forEach { (loc, value) ->
                            Text("$loc: $${"%.2f".format(value)}")
                        }
                    }
                }
            }

            Text(
                "Preferred value uses eBay sold average when available, otherwise Amazon, otherwise your manual estimate. " +
                    "Tap refresh to batch re-value the whole collection (skips items valued in the last 24 hours).",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
