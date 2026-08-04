package com.snapcollectibles.app.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.OpenInNew
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.snapcollectibles.app.data.SoldCompResult
import com.snapcollectibles.app.data.SoldListing

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SoldCompsScreen(
    result: SoldCompResult,
    itemName: String,
    onBack: () -> Unit
) {
    val context = LocalContext.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Sold Comps") },
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
        ) {
            // Summary card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(itemName, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(8.dp))
                    Text("Average: $${"%.2f".format(result.avgPrice)}", fontWeight = FontWeight.SemiBold)
                    Text("Range: $${"%.2f".format(result.minPrice)} – $${"%.2f".format(result.maxPrice)}")
                    Text("${result.count} recent sales")
                }
            }

            Text(
                "Recent Sales",
                style = MaterialTheme.typography.titleSmall,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(result.listings) { listing ->
                    SoldListingCard(listing) {
                        if (listing.url.isNotBlank()) {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(listing.url))
                            context.startActivity(intent)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SoldListingCard(listing: SoldListing, onOpen: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onOpen)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(
                text = listing.title,
                style = MaterialTheme.typography.bodyMedium,
                maxLines = 2
            )
            Spacer(Modifier.height(6.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    "$${"%.2f".format(listing.soldPrice)}",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )
                if (listing.soldDate.isNotBlank()) {
                    Text(listing.soldDate, style = MaterialTheme.typography.bodySmall)
                }
            }
            if (listing.condition.isNotBlank()) {
                Text(listing.condition, style = MaterialTheme.typography.bodySmall)
            }
            if (listing.url.isNotBlank()) {
                Row {
                    Icon(Icons.Default.OpenInNew, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("View on eBay", style = MaterialTheme.typography.labelSmall)
                }
            }
        }
    }
}