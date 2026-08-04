package com.snapcollectibles.app.ui.screens

import android.Manifest
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Base64
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.PhotoLibrary
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.core.content.FileProvider
import com.snapcollectibles.app.data.AiIdentifyResult
import com.snapcollectibles.app.data.Collectible
import com.snapcollectibles.app.data.PreferencesManager
import com.snapcollectibles.app.data.ValuationService
import com.snapcollectibles.app.viewmodel.CollectibleViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream
import java.io.File

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BulkScanScreen(
    viewModel: CollectibleViewModel,
    onDone: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val valuationService = remember { ValuationService() }

    var categoryHint by remember { mutableStateOf("Funko") }
    var photoUri by remember { mutableStateOf("") }
    var isScanning by remember { mutableStateOf(false) }
    var results by remember { mutableStateOf<List<AiIdentifyResult>>(emptyList()) }
    var selected by remember { mutableStateOf<Set<Int>>(emptySet()) }
    var notes by remember { mutableStateOf("") }
    var status by remember { mutableStateOf("Owned") }

    val categories = listOf("Funko", "Action Figures", "Toys", "LEGO", "Sports Cards", "Trading Cards", "Comics", "Other")
    val statuses = listOf("Owned", "Selling", "Wishlist")

    val photoFile = remember { File(context.cacheDir, "bulk_${System.currentTimeMillis()}.jpg") }
    val photoUriForCamera = remember {
        FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", photoFile)
    }
    val takePictureLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.TakePicture()
    ) { success ->
        if (success) {
            photoUri = photoUriForCamera.toString()
            results = emptyList()
            selected = emptySet()
        }
    }
    val pickImageLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let {
            photoUri = it.toString()
            results = emptyList()
            selected = emptySet()
        }
    }
    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) takePictureLauncher.launch(photoUriForCamera)
        else Toast.makeText(context, "Camera permission required", Toast.LENGTH_SHORT).show()
    }

    suspend fun uriToBase64(uriString: String): String? = withContext(Dispatchers.IO) {
        try {
            val uri = Uri.parse(uriString)
            val inputStream = context.contentResolver.openInputStream(uri) ?: return@withContext null
            val bitmap = BitmapFactory.decodeStream(inputStream)
            inputStream.close()
            // Downscale large shelf photos for API
            val maxDim = 1600
            val scaled = if (bitmap.width > maxDim || bitmap.height > maxDim) {
                val ratio = minOf(maxDim.toFloat() / bitmap.width, maxDim.toFloat() / bitmap.height)
                Bitmap.createScaledBitmap(
                    bitmap,
                    (bitmap.width * ratio).toInt(),
                    (bitmap.height * ratio).toInt(),
                    true
                )
            } else bitmap
            val outputStream = ByteArrayOutputStream()
            scaled.compress(Bitmap.CompressFormat.JPEG, 75, outputStream)
            Base64.encodeToString(outputStream.toByteArray(), Base64.NO_WRAP)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Bulk Shelf Scan") },
                navigationIcon = {
                    TextButton(onClick = onDone) { Text("Close") }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            if (results.isEmpty()) {
                Column(
                    modifier = Modifier.verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        "Photograph a whole shelf or group of collectibles. AI will list every item it can see so you can add them in bulk.",
                        style = MaterialTheme.typography.bodyMedium
                    )

                    var catExpanded by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(expanded = catExpanded, onExpandedChange = { catExpanded = it }) {
                        OutlinedTextField(
                            value = categoryHint,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Category hint") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(catExpanded) },
                            modifier = Modifier.menuAnchor().fillMaxWidth()
                        )
                        ExposedDropdownMenu(expanded = catExpanded, onDismissRequest = { catExpanded = false }) {
                            categories.forEach { option ->
                                DropdownMenuItem(text = { Text(option) }, onClick = {
                                    categoryHint = option
                                    catExpanded = false
                                })
                            }
                        }
                    }

                    Button(
                        onClick = { permissionLauncher.launch(Manifest.permission.CAMERA) },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.CameraAlt, contentDescription = null)
                        Spacer(Modifier.width(8.dp))
                        Text("Take Shelf Photo")
                    }
                    OutlinedButton(
                        onClick = { pickImageLauncher.launch("image/*") },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.PhotoLibrary, contentDescription = null)
                        Spacer(Modifier.width(8.dp))
                        Text("Choose from Library")
                    }

                    if (photoUri.isNotBlank()) {
                        Text("Photo ready", style = MaterialTheme.typography.bodySmall)
                        Button(
                            onClick = {
                                val key = PreferencesManager(context).openRouterApiKey
                                if (key.isBlank()) {
                                    Toast.makeText(context, "Set OpenRouter API key in Settings", Toast.LENGTH_LONG).show()
                                    return@Button
                                }
                                isScanning = true
                                scope.launch {
                                    val base64 = uriToBase64(photoUri)
                                    if (base64 == null) {
                                        isScanning = false
                                        Toast.makeText(context, "Could not read photo", Toast.LENGTH_SHORT).show()
                                        return@launch
                                    }
                                    val bulk = valuationService.identifyBulkFromPhoto(key, base64, categoryHint)
                                    isScanning = false
                                    if (bulk != null && bulk.items.isNotEmpty()) {
                                        results = bulk.items
                                        selected = bulk.items.indices.toSet()
                                        notes = bulk.rawNotes
                                        Toast.makeText(context, "Found ${bulk.items.size} items", Toast.LENGTH_LONG).show()
                                    } else {
                                        Toast.makeText(context, "No items detected – try a clearer photo", Toast.LENGTH_LONG).show()
                                    }
                                }
                            },
                            enabled = !isScanning,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            if (isScanning) {
                                CircularProgressIndicator(modifier = Modifier.size(20.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("Detecting items…")
                            } else {
                                Text("Detect All Items with AI")
                            }
                        }
                    }
                }
            } else {
                // Results review
                Text(
                    "${results.size} items detected – uncheck any to skip",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )
                if (notes.isNotBlank()) {
                    Text(notes, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }

                var statusExpanded by remember { mutableStateOf(false) }
                ExposedDropdownMenuBox(expanded = statusExpanded, onExpandedChange = { statusExpanded = it }) {
                    OutlinedTextField(
                        value = status,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Add selected to") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(statusExpanded) },
                        modifier = Modifier.menuAnchor().fillMaxWidth()
                    )
                    ExposedDropdownMenu(expanded = statusExpanded, onDismissRequest = { statusExpanded = false }) {
                        statuses.forEach { option ->
                            DropdownMenuItem(text = { Text(option) }, onClick = {
                                status = option
                                statusExpanded = false
                            })
                        }
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(vertical = 8.dp)) {
                    TextButton(onClick = { selected = results.indices.toSet() }) { Text("Select all") }
                    TextButton(onClick = { selected = emptySet() }) { Text("Select none") }
                }

                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    itemsIndexed(results) { index, item ->
                        Card(modifier = Modifier.fillMaxWidth()) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Checkbox(
                                    checked = index in selected,
                                    onCheckedChange = {
                                        selected = if (it) selected + index else selected - index
                                    }
                                )
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(item.name, fontWeight = FontWeight.SemiBold)
                                    Text(
                                        listOf(item.brand, item.series, item.category, item.confidence)
                                            .filter { it.isNotBlank() }
                                            .joinToString(" • "),
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }
                }

                Button(
                    onClick = {
                        val toAdd = results.filterIndexed { i, _ -> i in selected }
                        if (toAdd.isEmpty()) {
                            Toast.makeText(context, "Select at least one item", Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        scope.launch {
                            val collectibles = toAdd.map { r ->
                                Collectible(
                                    name = r.name,
                                    category = r.category.ifBlank { categoryHint },
                                    brand = r.brand,
                                    series = r.series,
                                    year = r.year?.toIntOrNull(),
                                    status = status,
                                    photoUri = photoUri,
                                    notes = if (r.confidence == "low") "AI confidence: low" else ""
                                )
                            }
                            viewModel.insertAll(collectibles)
                            Toast.makeText(context, "Added ${collectibles.size} items to $status", Toast.LENGTH_LONG).show()
                            onDone()
                        }
                    },
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
                ) {
                    Text("Add ${selected.size} Selected Items")
                }
                TextButton(onClick = {
                    results = emptyList()
                    selected = emptySet()
                }, modifier = Modifier.fillMaxWidth()) {
                    Text("Scan another photo")
                }
            }
        }
    }
}
