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
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.PhotoLibrary
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontWeight
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
fun ScanScreen(
    viewModel: CollectibleViewModel,
    onItemCreated: (Long) -> Unit = {},
    onCancel: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val valuationService = remember { ValuationService() }

    var selectedCategory by remember { mutableStateOf("") }
    var photoUri by remember { mutableStateOf("") }
    var barcode by remember { mutableStateOf("") }
    var isIdentifying by remember { mutableStateOf(false) }
    var status by remember { mutableStateOf("Owned") }
    var showBarcodeScanner by remember { mutableStateOf(false) }

    // AI results
    var identifiedName by remember { mutableStateOf("") }
    var identifiedBrand by remember { mutableStateOf("") }
    var identifiedSeries by remember { mutableStateOf("") }
    var identifiedYear by remember { mutableStateOf("") }

    val categories = listOf(
        "Funko", "Sports Cards", "Trading Cards", "Comics", "Coins",
        "Toys", "Action Figures", "Statues", "Pins", "Hot Wheels",
        "LEGO", "Video Games", "Other"
    )
    val statuses = listOf("Owned", "Selling", "Wishlist")

    // Camera photo
    val photoFile = remember { File(context.cacheDir, "scan_${System.currentTimeMillis()}.jpg") }
    val photoUriForCamera = remember {
        FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", photoFile)
    }
    val takePictureLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.TakePicture()
    ) { success ->
        if (success) {
            photoUri = photoUriForCamera.toString()
            Toast.makeText(context, "Photo captured", Toast.LENGTH_SHORT).show()
        }
    }

    // Gallery picker
    val pickImageLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let {
            photoUri = it.toString()
            Toast.makeText(context, "Photo selected", Toast.LENGTH_SHORT).show()
        }
    }

    // Permission
    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) {
            takePictureLauncher.launch(photoUriForCamera)
        } else {
            Toast.makeText(context, "Camera permission required", Toast.LENGTH_SHORT).show()
        }
    }

    // URI → Base64
    suspend fun uriToBase64(uriString: String): String? = withContext(Dispatchers.IO) {
        try {
            val uri = Uri.parse(uriString)
            val inputStream = context.contentResolver.openInputStream(uri) ?: return@withContext null
            val bitmap = BitmapFactory.decodeStream(inputStream)
            inputStream.close()
            val outputStream = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.JPEG, 70, outputStream)
            Base64.encodeToString(outputStream.toByteArray(), Base64.NO_WRAP)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Scan Collectible") },
                navigationIcon = {
                    TextButton(onClick = onCancel) { Text("Cancel") }
                }
            )
        }
    ) { padding ->
        if (showBarcodeScanner) {
            // Live barcode scanner
            BarcodeCameraPreview(
                onBarcodeDetected = { code ->
                    barcode = code
                    showBarcodeScanner = false
                    Toast.makeText(context, "Barcode: $code", Toast.LENGTH_SHORT).show()
                },
                onClose = { showBarcodeScanner = false }
            )
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(16.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // STEP 1: Category
                Text("1. Select Category", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

                var catExpanded by remember { mutableStateOf(false) }
                ExposedDropdownMenuBox(
                    expanded = catExpanded,
                    onExpandedChange = { catExpanded = it }
                ) {
                    OutlinedTextField(
                        value = if (selectedCategory.isBlank()) "Choose category..." else selectedCategory,
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
                                    selectedCategory = option
                                    catExpanded = false
                                }
                            )
                        }
                    }
                }

                if (selectedCategory.isBlank()) {
                    Text(
                        "Select a category first. This helps the AI give better results.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    return@Column
                }

                // STEP 2: How to add
                Text("2. How do you want to add it?", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

                Button(
                    onClick = { permissionLauncher.launch(Manifest.permission.CAMERA) },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.CameraAlt, contentDescription = null)
                    Spacer(Modifier.width(8.dp))
                    Text("Take Photo")
                }

                OutlinedButton(
                    onClick = { pickImageLauncher.launch("image/*") },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.PhotoLibrary, contentDescription = null)
                    Spacer(Modifier.width(8.dp))
                    Text("Choose from Library")
                }

                OutlinedButton(
                    onClick = { showBarcodeScanner = true },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.QrCode, contentDescription = null)
                    Spacer(Modifier.width(8.dp))
                    Text("Scan Barcode / UPC with Camera")
                }

                OutlinedTextField(
                    value = barcode,
                    onValueChange = { barcode = it },
                    label = { Text("Barcode / UPC") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )

                OutlinedButton(
                    onClick = {
                        identifiedName = " "
                        identifiedBrand = ""
                        identifiedSeries = ""
                        identifiedYear = ""
                        photoUri = ""
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Edit, contentDescription = null)
                    Spacer(Modifier.width(8.dp))
                    Text("Add Manually")
                }

                // Photo ready + AI
                if (photoUri.isNotBlank()) {
                    Text("Photo ready", style = MaterialTheme.typography.bodySmall)

                    Button(
                        onClick = {
                            val prefs = PreferencesManager(context)
                            val key = prefs.openRouterApiKey
                            if (key.isBlank()) {
                                Toast.makeText(context, "Set OpenRouter API key in Settings first", Toast.LENGTH_LONG).show()
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
                                    identifiedName = result.name
                                    identifiedBrand = result.brand
                                    identifiedSeries = result.series
                                    identifiedYear = result.year ?: ""
                                    Toast.makeText(context, "Identified (${result.confidence})", Toast.LENGTH_LONG).show()
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
                        Text("Identify with AI")
                    }
                }

                // STEP 3: Review & Save
                if (identifiedName.isNotBlank()) {
                    HorizontalDivider()
                    Text("3. Review & Save", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

                    OutlinedTextField(
                        value = identifiedName.trim(),
                        onValueChange = { identifiedName = it },
                        label = { Text("Name *") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = identifiedBrand,
                        onValueChange = { identifiedBrand = it },
                        label = { Text("Brand") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = identifiedSeries,
                        onValueChange = { identifiedSeries = it },
                        label = { Text("Series") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = identifiedYear,
                        onValueChange = { identifiedYear = it },
                        label = { Text("Year") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    var statusExpanded by remember { mutableStateOf(false) }
                    ExposedDropdownMenuBox(
                        expanded = statusExpanded,
                        onExpandedChange = { statusExpanded = it }
                    ) {
                        OutlinedTextField(
                            value = status,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Add to List") },
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
                        onClick = {
                            if (identifiedName.trim().isBlank()) {
                                Toast.makeText(context, "Name is required", Toast.LENGTH_SHORT).show()
                                return@Button
                            }
                            val item = Collectible(
                                name = identifiedName.trim(),
                                category = selectedCategory,
                                brand = identifiedBrand.trim(),
                                series = identifiedSeries.trim(),
                                year = identifiedYear.toIntOrNull(),
                                status = status,
                                photoUri = photoUri,
                                barcode = barcode.trim()
                            )
                            scope.launch {
                                viewModel.insert(item)
                                Toast.makeText(context, "Added to $status", Toast.LENGTH_SHORT).show()
                                onCancel()
                            }
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Save Collectible")
                    }
                }
            }
        }
    }
}

@Composable
private fun BarcodeCameraPreview(
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
                .align(Alignment.TopEnd)
                .padding(16.dp)
        ) {
            Text("Close")
        }
    }
}