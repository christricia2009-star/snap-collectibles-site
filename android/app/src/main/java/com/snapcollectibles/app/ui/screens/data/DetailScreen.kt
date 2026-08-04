package com.snapcollectibles.app.ui.screens

import android.content.Intent
import android.os.Build
import android.view.HapticFeedbackConstants
import android.widget.Toast
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import coil.compose.AsyncImage
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.snapcollectibles.app.data.Collectible
import com.snapcollectibles.app.data.PreferencesManager
import com.snapcollectibles.app.data.SoldCompResult
import com.snapcollectibles.app.data.ValuationService
import com.snapcollectibles.app.data.allPhotos
import com.snapcollectibles.app.data.hasRoiData
import com.snapcollectibles.app.data.portfolioValue
import com.snapcollectibles.app.data.preferredValue
import com.snapcollectibles.app.data.unrealizedGain
import com.snapcollectibles.app.viewmodel.CollectibleViewModel
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

data class PricePoint(val ts: Long, val price: Double, val source: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetailScreen(
    viewModel: CollectibleViewModel,
    collectibleId: Long,
    onEdit: () -> Unit,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val view = LocalView.current
    val scope = rememberCoroutineScope()
    val valuationService = remember { ValuationService() }
    val gson = remember { Gson() }

    var collectible by remember { mutableStateOf<Collectible?>(null) }
    var isLoadingAmazon by remember { mutableStateOf(false) }
    var isLoadingEbay by remember { mutableStateOf(false) }
    var showFullPhoto by remember { mutableStateOf(false) }
    var fullPhotoUri by remember { mutableStateOf("") }
    var showSoldComps by remember { mutableStateOf(false) }
    var lastSoldResult by remember { mutableStateOf<SoldCompResult?>(null) }

    LaunchedEffect(collectibleId) {
        collectible = viewModel.getById(collectibleId)
    }

    val item = collectible ?: return

    fun haptic() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            view.performHapticFeedback(HapticFeedbackConstants.CONFIRM)
        } else {
            view.performHapticFeedback(HapticFeedbackConstants.LONG_PRESS)
        }
    }

    fun updateStatus(newStatus: String) {
        haptic()
        val updated = item.copy(status = newStatus)
        viewModel.update(updated)
        collectible = updated
        Toast.makeText(context, "Moved to $newStatus", Toast.LENGTH_SHORT).show()
    }

    fun addPricePoint(price: Double, source: String, base: Collectible = item): Collectible {
        val type = object : TypeToken<MutableList<PricePoint>>() {}.type
        val history: MutableList<PricePoint> = try {
            gson.fromJson(base.priceHistoryJson, type) ?: mutableListOf()
        } catch (e: Exception) {
            mutableListOf()
        }
        history.add(0, PricePoint(System.currentTimeMillis(), price, source))
        return base.copy(priceHistoryJson = gson.toJson(history.take(20)))
    }

    val dateFormat = remember { SimpleDateFormat("MMM d, yyyy h:mm a", Locale.getDefault()) }
    val photos = item.allPhotos
    val pref = item.preferredValue

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(item.name, maxLines = 1) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = onEdit) {
                        Icon(Icons.Default.Edit, contentDescription = "Edit")
                    }
                    IconButton(onClick = {
                        haptic()
                        viewModel.delete(item)
                        onBack()
                    }) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete")
                    }
                    IconButton(onClick = {
                        val text = buildString {
                            appendLine(item.name)
                            appendLine("List: ${item.status}")
                            appendLine("Category: ${item.category}")
                            appendLine("Brand: ${item.brand}")
                            if (item.series.isNotBlank()) appendLine("Series: ${item.series}")
                            if (item.variant.isNotBlank()) appendLine("Variant: ${item.variant}")
                            if (item.year != null) appendLine("Year: ${item.year}")
                            appendLine("Condition: ${item.condition}")
                            if (item.quantity > 1) appendLine("Quantity: ${item.quantity}")
                            if (item.location.isNotBlank()) appendLine("Location: ${item.location}")
                            if (pref > 0) appendLine("Market Value: $${"%.2f".format(pref)}")
                            if (item.amazonPrice > 0) appendLine("Amazon: $${"%.2f".format(item.amazonPrice)}")
                            if (item.ebayAvgSold > 0) {
                                appendLine("eBay Avg Sold: $${"%.2f".format(item.ebayAvgSold)}")
                                if (item.ebayLow > 0) appendLine("eBay Range: $${"%.2f".format(item.ebayLow)} – $${"%.2f".format(item.ebayHigh)} (n=${item.ebaySampleCount})")
                            }
                            if (item.barcode.isNotBlank()) appendLine("Barcode: ${item.barcode}")
                            if (item.notes.isNotBlank()) appendLine("\nNotes:\n${item.notes}")
                        }
                        val intent = Intent(Intent.ACTION_SEND).apply {
                            type = "text/plain"
                            putExtra(Intent.EXTRA_TEXT, text)
                            putExtra(Intent.EXTRA_SUBJECT, item.name)
                        }
                        context.startActivity(Intent.createChooser(intent, "Share Collectible"))
                    }) {
                        Icon(Icons.Default.Share, contentDescription = "Share")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            if (photos.isNotEmpty()) {
                if (photos.size == 1) {
                    AsyncImage(
                        model = photos[0],
                        contentDescription = null,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(260.dp)
                            .clickable {
                                fullPhotoUri = photos[0]
                                showFullPhoto = true
                            },
                        contentScale = ContentScale.Crop
                    )
                } else {
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(photos) { uri ->
                            AsyncImage(
                                model = uri,
                                contentDescription = null,
                                modifier = Modifier
                                    .size(200.dp)
                                    .clickable {
                                        fullPhotoUri = uri
                                        showFullPhoto = true
                                    },
                                contentScale = ContentScale.Crop
                            )
                        }
                    }
                }
                Text(
                    "Tap photo to view full screen",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Text("List: ${item.status}", style = MaterialTheme.typography.titleMedium)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(
                    selected = item.status == "Owned",
                    onClick = { updateStatus("Owned") },
                    label = { Text("Collection") }
                )
                FilterChip(
                    selected = item.status == "Selling",
                    onClick = { updateStatus("Selling") },
                    label = { Text("Selling") }
                )
                FilterChip(
                    selected = item.status == "Wishlist",
                    onClick = { updateStatus("Wishlist") },
                    label = { Text("Wishlist") }
                )
            }

            HorizontalDivider()

            Text("Category: ${item.category}")
            Text("Brand: ${item.brand}")
            if (item.series.isNotBlank()) Text("Series: ${item.series}")
            if (item.variant.isNotBlank()) Text("Variant: ${item.variant}")
            if (item.year != null) Text("Year: ${item.year}")
            Text("Condition: ${item.condition}")
            if (item.quantity > 1) Text("Quantity: ${item.quantity}")
            if (item.location.isNotBlank()) Text("Location: ${item.location}")
            if (item.seriesTarget > 0) {
                Text("Series target (set size): ${item.seriesTarget}")
            }

            if (pref > 0) {
                Text(
                    "Market Value: $${"%.2f".format(pref)}" +
                        if (item.quantity > 1) " × ${item.quantity} = $${"%.2f".format(item.portfolioValue)}" else "",
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    "Source priority: eBay sold > Amazon > manual estimate",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            if (item.estimatedValue > 0 && item.estimatedValue != pref) {
                Text("Manual estimate: $${"%.2f".format(item.estimatedValue)}")
            }
            if (item.purchasePrice > 0) {
                Text("Purchase Price: $${"%.2f".format(item.purchasePrice)}")
                if (item.hasRoiData) {
                    val g = item.unrealizedGain
                    val sign = if (g >= 0) "+" else ""
                    Text(
                        "Unrealized P/L: $sign$${"%.2f".format(g)}",
                        color = if (g >= 0) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error
                    )
                }
            }
            if (item.barcode.isNotBlank()) Text("Barcode / UPC / ASIN: ${item.barcode}")

            if (item.amazonPrice > 0) {
                Text(
                    "Amazon: $${"%.2f".format(item.amazonPrice)}",
                    color = MaterialTheme.colorScheme.primary
                )
            }
            if (item.ebayAvgSold > 0) {
                Text(
                    "eBay Avg Sold: $${"%.2f".format(item.ebayAvgSold)}",
                    color = MaterialTheme.colorScheme.primary
                )
                if (item.ebayLow > 0 || item.ebayHigh > 0) {
                    Text(
                        "eBay range: $${"%.2f".format(item.ebayLow)} – $${"%.2f".format(item.ebayHigh)} (${item.ebaySampleCount} sales)",
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }

            if (item.lastValuedAt > 0) {
                Text(
                    "Last valued: ${dateFormat.format(Date(item.lastValuedAt))}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (item.notes.isNotBlank()) {
                Text("Notes", style = MaterialTheme.typography.titleSmall)
                Text(item.notes)
            }

            val history: List<PricePoint> = try {
                val type = object : TypeToken<List<PricePoint>>() {}.type
                gson.fromJson(item.priceHistoryJson, type) ?: emptyList()
            } catch (e: Exception) {
                emptyList()
            }

            if (history.isNotEmpty()) {
                HorizontalDivider()
                Text("Price History", style = MaterialTheme.typography.titleMedium)
                history.take(8).forEach { point ->
                    Text(
                        "${dateFormat.format(Date(point.ts))}  •  $${"%.2f".format(point.price)}  (${point.source})",
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }

            Spacer(Modifier.height(16.dp))
            Text("Price Lookup", style = MaterialTheme.typography.titleMedium)

            Button(
                onClick = {
                    val prefs = PreferencesManager(context)
                    val apiKey = prefs.rainforestApiKey
                    if (apiKey.isBlank()) {
                        Toast.makeText(context, "Set Rainforest API key in Settings", Toast.LENGTH_LONG).show()
                        return@Button
                    }
                    if (item.barcode.isBlank()) {
                        Toast.makeText(context, "Need a barcode / UPC / ASIN first", Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    isLoadingAmazon = true
                    scope.launch {
                        val isUpc = item.barcode.length >= 12 && item.barcode.all { it.isDigit() }
                        val price = valuationService.getAmazonPrice(apiKey, item.barcode, isUpc = isUpc)
                        isLoadingAmazon = false
                        if (price != null) {
                            haptic()
                            var updated = item.copy(
                                amazonPrice = price,
                                estimatedValue = if (item.estimatedValue == 0.0) price else item.estimatedValue,
                                lastValuedAt = System.currentTimeMillis()
                            )
                            updated = addPricePoint(price, "Amazon", updated)
                            viewModel.update(updated)
                            collectible = updated
                            Toast.makeText(context, "Amazon: $${"%.2f".format(price)}", Toast.LENGTH_LONG).show()
                        } else {
                            Toast.makeText(context, "Could not fetch Amazon price", Toast.LENGTH_SHORT).show()
                        }
                    }
                },
                enabled = !isLoadingAmazon,
                modifier = Modifier.fillMaxWidth()
            ) {
                if (isLoadingAmazon) {
                    CircularProgressIndicator(modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(8.dp))
                }
                Text("Check Amazon Price")
            }

            OutlinedButton(
                onClick = {
                    val prefs = PreferencesManager(context)
                    val apiKey = prefs.soldCompsApiKey
                    if (apiKey.isBlank()) {
                        Toast.makeText(context, "Set SoldComps API key in Settings", Toast.LENGTH_LONG).show()
                        return@OutlinedButton
                    }
                    isLoadingEbay = true
                    scope.launch {
                        val result = valuationService.getEbaySoldComps(apiKey, item.name)
                        isLoadingEbay = false
                        if (result != null) {
                            haptic()
                            lastSoldResult = result
                            var updated = item.copy(
                                ebayAvgSold = result.avgPrice,
                                ebayLow = result.minPrice,
                                ebayHigh = result.maxPrice,
                                ebaySampleCount = result.count,
                                estimatedValue = if (item.estimatedValue == 0.0) result.avgPrice else item.estimatedValue,
                                lastValuedAt = System.currentTimeMillis()
                            )
                            updated = addPricePoint(result.avgPrice, "eBay", updated)
                            viewModel.update(updated)
                            collectible = updated
                            showSoldComps = true
                        } else {
                            Toast.makeText(context, "No sold comps found", Toast.LENGTH_SHORT).show()
                        }
                    }
                },
                enabled = !isLoadingEbay,
                modifier = Modifier.fillMaxWidth()
            ) {
                if (isLoadingEbay) {
                    CircularProgressIndicator(modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(8.dp))
                }
                Text("Check eBay Sold Comps")
            }
        }
    }

    if (showFullPhoto && fullPhotoUri.isNotBlank()) {
        Dialog(
            onDismissRequest = { showFullPhoto = false },
            properties = DialogProperties(usePlatformDefaultWidth = false)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .clickable { showFullPhoto = false },
                contentAlignment = Alignment.Center
            ) {
                AsyncImage(
                    model = fullPhotoUri,
                    contentDescription = null,
                    modifier = Modifier.fillMaxWidth(),
                    contentScale = ContentScale.Fit
                )
            }
        }
    }

    if (showSoldComps && lastSoldResult != null) {
        AlertDialog(
            onDismissRequest = { showSoldComps = false },
            title = { Text("eBay Sold Comps") },
            text = {
                Column {
                    Text("Average: $${"%.2f".format(lastSoldResult!!.avgPrice)}")
                    Text("Low: $${"%.2f".format(lastSoldResult!!.minPrice)}")
                    Text("High: $${"%.2f".format(lastSoldResult!!.maxPrice)}")
                    Text("Based on ${lastSoldResult!!.count} recent sales")
                    if (lastSoldResult!!.listings.isNotEmpty()) {
                        Spacer(Modifier.height(8.dp))
                        Text("Top sales:", fontWeight = FontWeight.SemiBold)
                        lastSoldResult!!.listings.take(5).forEach { listing ->
                            Text("• $${"%.2f".format(listing.soldPrice)} – ${listing.title.take(40)}...")
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showSoldComps = false }) {
                    Text("OK")
                }
            }
        )
    }
}
