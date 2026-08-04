package com.snapcollectibles.app.ui.screens

import android.Manifest
import android.graphics.BitmapFactory
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.PhotoLibrary
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.Role
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
import java.io.File

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BulkScanScreen(
    viewModel: CollectibleViewModel,
    onDone: () -> Unit,
    onCancel: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val valuationService = remember { ValuationService() }

    var selectedCategory by remember { mutableStateOf("") }
    var photoUri by remember { mutableStateOf("") }
    var isScanning by remember { mutableStateOf(false) }
    var status by remember { mutableStateOf("Owned") }
    var results by remember { mutableStateOf<List<AiIdentifyResult>>(emptyList()) }
    var selected by remember { mutableStateOf<Set<Int>>(emptySet()) }

    val categories = listOf(
        "Funko", "Sports Cards", "Trading Cards", "Comics", "Coins",
        "Toys", "Action Figures", "Statues", "Pins", "Hot Wheels",
        "LEGO", "Video Games", "Other"
    )
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
            Toast.makeText(context, "Shelf photo captured", Toast.LENGTH_SHORT).show()
        }
    }
    val pickImageLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let {
            photoUri = it.toString()
            results = emptyList()
            selected = emptySet()
            Toast.makeText(context, "Photo selected", Toast.LENGTH_SHORT).show()
        }
    }
    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) takePictureLauncher.launch(photoUriForCamera)
        else Toast.makeText(context, "Camera permission required", Toast.LENGTH_SHORT).show()
    }

    suspend fun uriToBase64Downscaled(uriString: String): String? = withContext(Dispatchers.IO) {
        try {
            val uri = Uri.parse(uriString)
            val inputStream = context.contentResolver.openInputStream(uri) ?: return@withContext null
            val bitmap = BitmapFactory.decodeStream(inputStream)
            inputStream.close()
            valuationService.encodeBitmapForAi(bitmap, maxDim = 1280, quality = 72)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    fun runBulkIdentify() {
        val prefs = PreferencesManager(context)
        val key = prefs.openRouterApiKey
        if (key.isBlank()) {
            Toast.makeText(context, "Set OpenRouter API key in Settings first", Toast.LENGTH_LONG).show()
            return
        }
        if (photoUri.isBlank()) {
            Toast.makeText(context, "Take or pick a shelf photo first", Toast.LENGTH_SHORT).show()
            return
        }
        isScanning = true
        scope.launch {
            val base64 = uriToBase64Downscaled(photoUri)
            if (base64 == null) {
                isScanning = false
                Toast.makeText(context, "Could not read photo", Toast.LENGTH_SHORT).show()
                return@launch
            }
            val list = valuationService.identifyBulkFromPhoto(key, base64, selectedCategory)
            isScanning = false
            if (list.isNullOrEmpty()) {
                Toast.makeText(context, "No items detected — try a clearer photo", Toast.LENGTH_LONG).show()
            } else {
                results = list
                selected = list.indices.toSet()
                Toast.makeText(context, "Found ${list.size} items", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun addSelected() {
        if (selected.isEmpty()) {
            Toast.makeText(context, "Select at least one item", Toast.LENGTH_SHORT).show()
            return
        }
        val catDefault = selectedCategory.ifBlank { "Other" }
        var added = 0
        var skipped = 0
        val toInsert = mutableListOf<Collectible>()
        selected.sorted().forEach { index ->
            val r = results.getOrNull(index) ?: return@forEach
            if (viewModel.isDuplicate(r.name)) {
                skipped++
            } else {
                toInsert.add(
                    Collectible(
                        name = r.name,
                        brand = r.brand,
                        series = r.series,
                        category = r.category.ifBlank { catDefault },
                        year = r.year?.toIntOrNull(),
                        status = status,
                        photoUri = photoUri,
                        notes = "Bulk scan (${r.confidence})"
                    )
                )
                added++
            }
        }
        if (toInsert.isNotEmpty()) {
            viewModel.insertAll(toInsert)
        }
        Toast.makeText(
            context,
            "Added $added" + if (skipped > 0) " • skipped $skipped duplicates" else "",
            Toast.LENGTH_LONG
        ).show()
        if (added > 0) onDone()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Bulk Shelf Scan") },
                navigationIcon = {
                    IconButton(onClick = onCancel) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        if (results.isEmpty()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(16.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    "Photograph a shelf or group of collectibles. AI will detect multiple items for batch add.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Text("Category hint (improves accuracy)", style = MaterialTheme.typography.titleSmall)
                var catExpanded by remember { mutableStateOf(false) }
                ExposedDropdownMenuBox(
                    expanded = catExpanded,
                    onExpandedChange = { catExpanded = it }
                ) {
                    OutlinedTextField(
                        value = if (selectedCategory.isBlank()) "Optional…" else selectedCategory,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Category") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(catExpanded) },
                        modifier = Modifier.menuAnchor().fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = catExpanded,
                        onDismissRequest = { catExpanded = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("Any / Mixed") },
                            onClick = {
                                selectedCategory = ""
                                catExpanded = false
                            }
                        )
                        categories.forEach { option ->
                            DropdownMenuItem(
                                text = { Text(option) },
                                onClick = {
                                    selectedCategory = option
                                    catExpanded = false
                                }
                            )
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
                        onClick = { runBulkIdentify() },
                        enabled = !isScanning,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        if (isScanning) {
                            CircularProgressIndicator(modifier = Modifier.size(20.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Detecting items…")
                        } else {
                            Text("Detect Items with AI")
                        }
                    }
                }
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        "${results.size} detected • ${selected.size} selected",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        TextButton(onClick = { selected = results.indices.toSet() }) {
                            Text("Select all")
                        }
                        TextButton(onClick = { selected = emptySet() }) {
                            Text("Clear")
                        }
                        TextButton(onClick = {
                            results = emptyList()
                            selected = emptySet()
                        }) {
                            Text("Rescan")
                        }
                    }
                    var statusExpanded by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(
                        expanded = statusExpanded,
                        onExpandedChange = { statusExpanded = it }
                    ) {
                        OutlinedTextField(
                            value = status,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Add selected to list") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(statusExpanded) },
                            modifier = Modifier.menuAnchor().fillMaxWidth()
                        )
                        ExposedDropdownMenu(
                            expanded = statusExpanded,
                            onDismissRequest = { statusExpanded = false }
                        ) {
                            statuses.forEach { option ->
                                DropdownMenuItem(
                                    text = { Text(option) },
                                    onClick = {
                                        status = option
                                        statusExpanded = false
                                    }
                                )
                            }
                        }
                    }
                    Button(
                        onClick = { addSelected() },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Add ${selected.size} Selected")
                    }
                }

                LazyColumn(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    itemsIndexed(results) { index, item ->
                        val checked = selected.contains(index)
                        val duplicate = viewModel.isDuplicate(item.name)
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .toggleable(
                                    value = checked,
                                    role = Role.Checkbox,
                                    onValueChange = { on ->
                                        selected = if (on) selected + index else selected - index
                                    }
                                )
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Checkbox(
                                    checked = checked,
                                    onCheckedChange = null
                                )
                                Spacer(Modifier.width(8.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(item.name, fontWeight = FontWeight.SemiBold)
                                    Text(
                                        listOfNotNull(
                                            item.brand.takeIf { it.isNotBlank() },
                                            item.series.takeIf { it.isNotBlank() },
                                            item.category,
                                            item.confidence
                                        ).joinToString(" • "),
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                    if (duplicate) {
                                        Text(
                                            "Already in collection",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.error
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
