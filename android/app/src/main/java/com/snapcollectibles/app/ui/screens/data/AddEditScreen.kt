package com.snapcollectibles.app.ui.screens

import android.Manifest
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Base64
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.common.InputImage
import com.snapcollectibles.app.data.Collectible
import com.snapcollectibles.app.data.PreferencesManager
import com.snapcollectibles.app.data.ValuationService
import com.snapcollectibles.app.viewmodel.CollectibleViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream
import java.io.File
import java.util.concurrent.Executors

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditScreen(
    viewModel: CollectibleViewModel,
    collectibleId: Long?,
    onSaved: () -> Unit,
    onCancel: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val valuationService = remember { ValuationService() }

    var name by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Other") }
    var brand by remember { mutableStateOf("") }
    var series by remember { mutableStateOf("") }
    var year by remember { mutableStateOf("") }
    var condition by remember { mutableStateOf("Near Mint") }
    var status by remember { mutableStateOf("Owned") }
    var estimatedValue by remember { mutableStateOf("") }
    var purchasePrice by remember { mutableStateOf("") }
    var barcode by remember { mutableStateOf("") }
    var notes by remember { mutableStateOf("") }
    var photoUri by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var quantity by remember { mutableStateOf("1") }
    var variant by remember { mutableStateOf("") }
    var seriesTarget by remember { mutableStateOf("") }
    var photoUri2 by remember { mutableStateOf("") }
    var photoUri3 by remember { mutableStateOf("") }

    var showCamera by remember { mutableStateOf(false) }
    var isBarcodeMode by remember { mutableStateOf(false) }
    var isIdentifying by remember { mutableStateOf(false) }

    val categories = listOf(
        "Funko", "Sports Cards", "Trading Cards", "Comics", "Coins",
        "Toys", "Action Figures", "Statues", "Pins", "Hot Wheels",
        "LEGO", "Video Games", "Other"
    )
    val conditions = listOf("Mint", "Near Mint", "Excellent", "Good", "Fair", "Poor")
    val statuses = listOf("Owned", "Selling", "Wishlist")

    // Load existing item
    LaunchedEffect(collectibleId) {
        if (collectibleId != null) {
            viewModel.getById(collectibleId)?.let { c ->
                name = c.name
                category = c.category
                brand = c.brand
                series = c.series
                year = c.year?.toString() ?: ""
                condition = c.condition
                status = c.status
                estimatedValue = if (c.estimatedValue > 0) c.estimatedValue.toString() else ""
                purchasePrice = if (c.purchasePrice > 0) c.purchasePrice.toString() else ""
                barcode = c.barcode
                notes = c.notes
                photoUri = c.photoUri
                location = c.location
                quantity = c.quantity.toString()
                variant = c.variant
                seriesTarget = if (c.seriesTarget > 0) c.seriesTarget.toString() else ""
                photoUri2 = c.photoUri2
                photoUri3 = c.photoUri3
            }
        }
    }

    // Photo capture setup
    val photoFile = remember {
        File(context.cacheDir, "snap_${System.currentTimeMillis()}.jpg")
    }
    val photoUriForCamera = remember {
        FileProvider.getUriForFile(
            context,
            "${context.packageName}.fileprovider",
            photoFile
        )
    }
    val takePictureLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.TakePicture()
    ) { success ->
        if (success) {
            photoUri = photoUriForCamera.toString()
            Toast.makeText(context, "Photo saved", Toast.LENGTH_SHORT).show()
        }
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) {
            if (isBarcodeMode) {
                showCamera = true
            } else {
                takePictureLauncher.launch(photoUriForCamera)
            }
        } else {
            Toast.makeText(context, "Camera permission required", Toast.LENGTH_SHORT).show()
        }
    }

    // Helper: convert photo URI to base64
    suspend fun uriToBase64(uriString: String): String? = withContext(Dispatchers.IO) {
        try {
            val uri = Uri.parse(uriString)
            val inputStream = context.contentResolver.openInputStream(uri) ?: return@withContext null
            val bitmap = BitmapFactory.decodeStream(inputStream)
            inputStream.close()

            val outputStream = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.JPEG, 70, outputStream)
            val bytes = outputStream.toByteArray()
            Base64.encodeToString(bytes, Base64.NO_WRAP)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (collectibleId == null) "Add Collectible" else "Edit Collectible") },
                navigationIcon = {
                    TextButton(onClick = onCancel) { Text("Cancel") }
                },
                actions = {
                    TextButton(onClick = {
                        if (name.isBlank()) {
                            Toast.makeText(context, "Name is required", Toast.LENGTH_SHORT).show()
                            return@TextButton
                        }
                        val item = Collectible(
                            id = collectibleId ?: 0,
                            name = name.trim(),
                            category = category,
                            brand = brand.trim(),
                            series = series.trim(),
                            year = year.toIntOrNull(),
                            condition = condition,
                            status = status,
                            estimatedValue = estimatedValue.toDoubleOrNull() ?: 0.0,
                            purchasePrice = purchasePrice.toDoubleOrNull() ?: 0.0,
                            barcode = barcode.trim(),
                            photoUri = photoUri,
                            notes = notes.trim(),
                            location = location.trim(),
                            quantity = quantity.toIntOrNull()?.coerceAtLeast(1) ?: 1,
                            variant = variant.trim(),
                            seriesTarget = seriesTarget.toIntOrNull() ?: 0,
                            photoUri2 = photoUri2,
                            photoUri3 = photoUri3
                        )
                        if (collectibleId == null) viewModel.insert(item)
                        else viewModel.update(item)
                        onSaved()
                    }) {
                        Text("Save")
                    }
                }
            )
        }
    ) { padding ->
        if (showCamera) {
            CameraPreview(
                isBarcodeMode = true,
                onBarcodeDetected = { code ->
                    barcode = code
                    showCamera = false
                    Toast.makeText(context, "Barcode: $code", Toast.LENGTH_SHORT).show()
                },
                onClose = { showCamera = false }
            )
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(16.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Name *") },
                    modifier = Modifier.fillMaxWidth()
                )

                // Category
                var catExpanded by remember { mutableStateOf(false) }
                ExposedDropdownMenuBox(
                    expanded = catExpanded,
                    onExpandedChange = { catExpanded = it }
                ) {
                    OutlinedTextField(
                        value = category,
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
                        categories.forEach { option ->
                            DropdownMenuItem(
                                text = { Text(option) },
                                onClick = {
                                    category = option
                                    catExpanded = false
                                }
                            )
                        }
                    }
                }

                OutlinedTextField(value = brand, onValueChange = { brand = it }, label = { Text("Brand") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = series, onValueChange = { series = it }, label = { Text("Series / Line") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = year, onValueChange = { year = it }, label = { Text("Year") }, modifier = Modifier.fillMaxWidth())

                // Condition
                var condExpanded by remember { mutableStateOf(false) }
                ExposedDropdownMenuBox(
                    expanded = condExpanded,
                    onExpandedChange = { condExpanded = it }
                ) {
                    OutlinedTextField(
                        value = condition,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Condition") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(condExpanded) },
                        modifier = Modifier.menuAnchor().fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = condExpanded,
                        onDismissRequest = { condExpanded = false }
                    ) {
                        conditions.forEach { option ->
                            DropdownMenuItem(
                                text = { Text(option) },
                                onClick = {
                                    condition = option
                                    condExpanded = false
                                }
                            )
                        }
                    }
                }

                // Status / List
                var statusExpanded by remember { mutableStateOf(false) }
                ExposedDropdownMenuBox(
                    expanded = statusExpanded,
                    onExpandedChange = { statusExpanded = it }
                ) {
                    OutlinedTextField(
                        value = status,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("List") },
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

                OutlinedTextField(value = estimatedValue, onValueChange = { estimatedValue = it }, label = { Text("Estimated Value ($)") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = purchasePrice, onValueChange = { purchasePrice = it }, label = { Text("Purchase Price ($)") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = barcode, onValueChange = { barcode = it }, label = { Text("Barcode / UPC / ASIN") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = notes, onValueChange = { notes = it }, label = { Text("Notes") }, modifier = Modifier.fillMaxWidth(), minLines = 3)
                OutlinedTextField(value = location, onValueChange = { location = it }, label = { Text("Location (shelf / bin / room)") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = quantity, onValueChange = { quantity = it }, label = { Text("Quantity") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = variant, onValueChange = { variant = it }, label = { Text("Variant / Exclusive / Chase") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = seriesTarget, onValueChange = { seriesTarget = it }, label = { Text("Series Target (total in set)") }, modifier = Modifier.fillMaxWidth())

                // Camera buttons
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(onClick = {
                        isBarcodeMode = false
                        permissionLauncher.launch(Manifest.permission.CAMERA)
                    }) {
                        Icon(Icons.Default.CameraAlt, contentDescription = null)
                        Spacer(Modifier.width(8.dp))
                        Text("Take Photo")
                    }
                    OutlinedButton(onClick = {
                        isBarcodeMode = true
                        permissionLauncher.launch(Manifest.permission.CAMERA)
                    }) {
                        Icon(Icons.Default.QrCode, contentDescription = null)
                        Spacer(Modifier.width(8.dp))
                        Text("Scan Barcode")
                    }
                }

                if (photoUri.isNotBlank()) {
                    Text("Photo attached", style = MaterialTheme.typography.bodySmall)

                    // AI Identify button
                    Button(
                        onClick = {
                            val prefs = PreferencesManager(context)
                            val key = prefs.openRouterApiKey
                            if (key.isBlank()) {
                                Toast.makeText(context, "Set OpenRouter API key in Settings", Toast.LENGTH_LONG).show()
                                return@Button
                            }
                            isIdentifying = true
                            scope.launch {
                                val base64 = uriToBase64(photoUri)
                                if (base64 == null) {
                                    isIdentifying = false
                                    Toast.makeText(context, "Could not read photo", Toast.LENGTH_SHORT).show()
                                    return@launch
                                }
                                val result = valuationService.identifyFromPhoto(key, base64)
                                isIdentifying = false
                                if (result != null) {
                                    name = result.name
                                    brand = result.brand
                                    series = result.series
                                    category = result.category
                                    if (!result.year.isNullOrBlank()) year = result.year
                                    Toast.makeText(context, "AI identified (${result.confidence})", Toast.LENGTH_LONG).show()
                                } else {
                                    Toast.makeText(context, "AI could not identify the item", Toast.LENGTH_SHORT).show()
                                }
                            }
                        },
                        enabled = !isIdentifying,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        if (isIdentifying) {
                            CircularProgressIndicator(modifier = Modifier.size(20.dp))
                            Spacer(Modifier.width(8.dp))
                        }
                        Text("Identify with AI (OpenRouter)")
                    }
                }
            }
        }
    }
}

@Composable
private fun CameraPreview(
    isBarcodeMode: Boolean,
    onBarcodeDetected: (String) -> Unit,
    onClose: () -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val previewView = remember { PreviewView(context) }
    val cameraExecutor = remember { Executors.newSingleThreadExecutor() }

    DisposableEffect(Unit) {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(context)
        cameraProviderFuture.addListener({
            val cameraProvider = cameraProviderFuture.get()
            val preview = Preview.Builder().build().also {
                it.setSurfaceProvider(previewView.surfaceProvider)
            }
            val imageAnalysis = ImageAnalysis.Builder()
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                .build()

            if (isBarcodeMode) {
                val scanner = BarcodeScanning.getClient()
                imageAnalysis.setAnalyzer(cameraExecutor) { imageProxy ->
                    val mediaImage = imageProxy.image
                    if (mediaImage != null) {
                        val image = InputImage.fromMediaImage(mediaImage, imageProxy.imageInfo.rotationDegrees)
                        scanner.process(image)
                            .addOnSuccessListener { barcodes ->
                                barcodes.firstOrNull()?.rawValue?.let { code ->
                                    onBarcodeDetected(code)
                                }
                            }
                            .addOnCompleteListener { imageProxy.close() }
                    } else {
                        imageProxy.close()
                    }
                }
            }

            try {
                cameraProvider.unbindAll()
                cameraProvider.bindToLifecycle(
                    lifecycleOwner,
                    CameraSelector.DEFAULT_BACK_CAMERA,
                    preview,
                    imageAnalysis
                )
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }, ContextCompat.getMainExecutor(context))

        onDispose {
            cameraExecutor.shutdown()
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        AndroidView({ previewView }, modifier = Modifier.fillMaxSize())
        Button(
            onClick = onClose,
            modifier = Modifier
                .align(androidx.compose.ui.Alignment.TopEnd)
                .padding(16.dp)
        ) {
            Text("Close")
        }
    }
}