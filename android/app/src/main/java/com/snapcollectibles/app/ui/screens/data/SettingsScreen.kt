package com.snapcollectibles.app.ui.screens

import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.snapcollectibles.app.data.ExportHelper
import com.snapcollectibles.app.data.PreferencesManager
import com.snapcollectibles.app.data.ValuationService
import com.snapcollectibles.app.viewmodel.CollectibleViewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    viewModel: CollectibleViewModel,
    onBack: () -> Unit,
    onMarketRateClick: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val prefs = remember { PreferencesManager(context) }
    val valuationService = remember { ValuationService() }

    // Keys live only in SharedPreferences — never hardcoded defaults.
    var rainforestKey by remember { mutableStateOf(prefs.rainforestApiKey) }
    var soldCompsKey by remember { mutableStateOf(prefs.soldCompsApiKey) }
    var openRouterKey by remember { mutableStateOf(prefs.openRouterApiKey) }

    var showRainforest by remember { mutableStateOf(false) }
    var showSoldComps by remember { mutableStateOf(false) }
    var showOpenRouter by remember { mutableStateOf(false) }

    var testingRainforest by remember { mutableStateOf(false) }
    var testingSoldComps by remember { mutableStateOf(false) }
    var testingOpenRouter by remember { mutableStateOf(false) }

    var rainforestStatus by remember { mutableStateOf<Boolean?>(null) }
    var soldCompsStatus by remember { mutableStateOf<Boolean?>(null) }
    var openRouterStatus by remember { mutableStateOf<Boolean?>(null) }

    val importLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let {
            val items = ExportHelper.importFromCsv(context, it)
            if (items.isNotEmpty()) {
                viewModel.insertAll(items)
                Toast.makeText(context, "Imported ${items.size} items", Toast.LENGTH_LONG).show()
            } else {
                Toast.makeText(context, "No items found or import failed", Toast.LENGTH_SHORT).show()
            }
        }
    }

    val allItems by viewModel.allCollectibles.collectAsState()
    val batchProgress by viewModel.batchRevalueProgress.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Settings") },
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
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {

            Text("API Keys", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text(
                "Keys are stored only on this device (SharedPreferences). Never committed to source. Tap the eye icon to reveal / edit.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Text("Rainforest (Amazon prices)", style = MaterialTheme.typography.titleSmall)
            OutlinedTextField(
                value = rainforestKey,
                onValueChange = { rainforestKey = it },
                label = { Text("Rainforest API Key") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                visualTransformation = if (showRainforest)
                    VisualTransformation.None
                else
                    PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                trailingIcon = {
                    IconButton(onClick = { showRainforest = !showRainforest }) {
                        Icon(
                            if (showRainforest) Icons.Default.VisibilityOff
                            else Icons.Default.Visibility,
                            contentDescription = if (showRainforest) "Hide" else "Show"
                        )
                    }
                }
            )
            Row(verticalAlignment = Alignment.CenterVertically) {
                Button(
                    onClick = {
                        if (rainforestKey.isBlank()) {
                            Toast.makeText(context, "Enter a key first", Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        testingRainforest = true
                        rainforestStatus = null
                        scope.launch {
                            val result = valuationService.getAmazonPrice(
                                rainforestKey.trim(), "B0D1XD1ZV3", isUpc = false
                            )
                            testingRainforest = false
                            rainforestStatus = result != null
                            Toast.makeText(
                                context,
                                if (result != null) "Rainforest OK" else "Rainforest test failed",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    },
                    enabled = !testingRainforest
                ) {
                    if (testingRainforest) {
                        CircularProgressIndicator(modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                    }
                    Text("Test")
                }
                Spacer(Modifier.width(12.dp))
                rainforestStatus?.let {
                    Icon(
                        if (it) Icons.Default.CheckCircle else Icons.Default.Error,
                        contentDescription = null,
                        tint = if (it) MaterialTheme.colorScheme.primary
                        else MaterialTheme.colorScheme.error
                    )
                }
            }

            Text("SoldComps (eBay sold comps)", style = MaterialTheme.typography.titleSmall)
            OutlinedTextField(
                value = soldCompsKey,
                onValueChange = { soldCompsKey = it },
                label = { Text("SoldComps API Key") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                visualTransformation = if (showSoldComps)
                    VisualTransformation.None
                else
                    PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                trailingIcon = {
                    IconButton(onClick = { showSoldComps = !showSoldComps }) {
                        Icon(
                            if (showSoldComps) Icons.Default.VisibilityOff
                            else Icons.Default.Visibility,
                            contentDescription = if (showSoldComps) "Hide" else "Show"
                        )
                    }
                }
            )
            Row(verticalAlignment = Alignment.CenterVertically) {
                Button(
                    onClick = {
                        if (soldCompsKey.isBlank()) {
                            Toast.makeText(context, "Enter a key first", Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        testingSoldComps = true
                        soldCompsStatus = null
                        scope.launch {
                            val result = valuationService.getEbaySoldComps(
                                soldCompsKey.trim(), "funko pop"
                            )
                            testingSoldComps = false
                            soldCompsStatus = result != null
                            Toast.makeText(
                                context,
                                if (result != null) "SoldComps OK (${result.count} results)"
                                else "SoldComps test failed",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    },
                    enabled = !testingSoldComps
                ) {
                    if (testingSoldComps) {
                        CircularProgressIndicator(modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                    }
                    Text("Test")
                }
                Spacer(Modifier.width(12.dp))
                soldCompsStatus?.let {
                    Icon(
                        if (it) Icons.Default.CheckCircle else Icons.Default.Error,
                        contentDescription = null,
                        tint = if (it) MaterialTheme.colorScheme.primary
                        else MaterialTheme.colorScheme.error
                    )
                }
            }

            Text("OpenRouter (AI photo recognition)", style = MaterialTheme.typography.titleSmall)
            OutlinedTextField(
                value = openRouterKey,
                onValueChange = { openRouterKey = it },
                label = { Text("OpenRouter API Key") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                visualTransformation = if (showOpenRouter)
                    VisualTransformation.None
                else
                    PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                trailingIcon = {
                    IconButton(onClick = { showOpenRouter = !showOpenRouter }) {
                        Icon(
                            if (showOpenRouter) Icons.Default.VisibilityOff
                            else Icons.Default.Visibility,
                            contentDescription = if (showOpenRouter) "Hide" else "Show"
                        )
                    }
                }
            )
            Row(verticalAlignment = Alignment.CenterVertically) {
                Button(
                    onClick = {
                        if (openRouterKey.isBlank()) {
                            Toast.makeText(context, "Enter a key first", Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        testingOpenRouter = true
                        openRouterStatus = null
                        scope.launch {
                            kotlinx.coroutines.delay(400)
                            testingOpenRouter = false
                            openRouterStatus = openRouterKey.trim().startsWith("sk-") ||
                                openRouterKey.length > 20
                            Toast.makeText(
                                context,
                                if (openRouterStatus == true) "OpenRouter key looks valid"
                                else "Check your OpenRouter key",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    },
                    enabled = !testingOpenRouter
                ) {
                    if (testingOpenRouter) {
                        CircularProgressIndicator(modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                    }
                    Text("Test")
                }
                Spacer(Modifier.width(12.dp))
                openRouterStatus?.let {
                    Icon(
                        if (it) Icons.Default.CheckCircle else Icons.Default.Error,
                        contentDescription = null,
                        tint = if (it) MaterialTheme.colorScheme.primary
                        else MaterialTheme.colorScheme.error
                    )
                }
            }

            Button(
                onClick = {
                    prefs.rainforestApiKey = rainforestKey.trim()
                    prefs.soldCompsApiKey = soldCompsKey.trim()
                    prefs.openRouterApiKey = openRouterKey.trim()
                    Toast.makeText(context, "API keys saved", Toast.LENGTH_SHORT).show()
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Save All Keys")
            }

            HorizontalDivider()

            Text("Market", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            OutlinedButton(
                onClick = onMarketRateClick,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Market Rate")
            }
            OutlinedButton(
                onClick = {
                    if (prefs.rainforestApiKey.isBlank() && prefs.soldCompsApiKey.isBlank()) {
                        Toast.makeText(
                            context,
                            "Save Rainforest or SoldComps API key first",
                            Toast.LENGTH_LONG
                        ).show()
                        return@OutlinedButton
                    }
                    viewModel.batchRevalue(all = true, force = false) { ok, total ->
                        Toast.makeText(
                            context,
                            "Re-valued $ok of $total (skipped fresh <24h)",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                },
                enabled = batchProgress == null,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Batch Re-value Entire Collection")
            }
            batchProgress?.let { (done, total) ->
                LinearProgressIndicator(
                    progress = { if (total > 0) done.toFloat() / total else 0f },
                    modifier = Modifier.fillMaxWidth()
                )
                Text("Re-valuing $done / $total…", style = MaterialTheme.typography.labelSmall)
            }

            HorizontalDivider()

            Text("Data", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text(
                "Schema upgrades may reset local data (destructive migration). Export CSV before updating the app.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Button(
                onClick = {
                    val uri = ExportHelper.exportCollectionToCsv(context, allItems)
                    if (uri != null) ExportHelper.shareCsv(context, uri)
                    else Toast.makeText(context, "Export failed", Toast.LENGTH_SHORT).show()
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Export Collection (CSV)")
            }

            OutlinedButton(
                onClick = { importLauncher.launch("text/*") },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Import Collection (CSV)")
            }

            HorizontalDivider()

            Text("Insurance", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Text(
                "Protect your collection. Many collectors use specialized collectibles insurance or a rider on their homeowners policy.",
                style = MaterialTheme.typography.bodyMedium
            )
            Text(
                "Tip: Export your collection CSV (includes preferred value, unrealized gain, location, quantity) and keep an updated list for your insurance agent.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(Modifier.height(24.dp))
            Text(
                "Snap Collectibles – Android 1.1",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
