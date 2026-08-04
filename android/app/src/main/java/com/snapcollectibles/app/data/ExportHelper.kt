package com.snapcollectibles.app.data

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import java.io.BufferedReader
import java.io.File
import java.io.FileWriter
import java.io.InputStreamReader
import java.text.SimpleDateFormat
import java.util.*

object ExportHelper {

    fun exportCollectionToCsv(context: Context, collectibles: List<Collectible>): Uri? {
        return try {
            val timestamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date())
            val fileName = "SnapCollectibles_$timestamp.csv"
            val file = File(context.cacheDir, fileName)

            FileWriter(file).use { writer ->
                writer.append(
                    "ID,Name,Category,Brand,Series,Year,Condition,Variant,Quantity,Location," +
                    "Estimated Value,Preferred Value,Purchase Price,Unrealized Gain," +
                    "Amazon Price,eBay Avg Sold,eBay Low,eBay High,eBay Sample Count," +
                    "Barcode,Notes,Status,Date Added,Last Valued At\n"
                )

                collectibles.forEach { item ->
                    writer.append("${item.id},")
                    writer.append("\"${item.name.replace("\"", "\"\"")}\",")
                    writer.append("\"${item.category}\",")
                    writer.append("\"${item.brand}\",")
                    writer.append("\"${item.series}\",")
                    writer.append("${item.year ?: ""},")
                    writer.append("\"${item.condition}\",")
                    writer.append("\"${item.variant.replace("\"", "\"\"")}\",")
                    writer.append("${item.quantity},")
                    writer.append("\"${item.location.replace("\"", "\"\"")}\",")
                    writer.append("${item.estimatedValue},")
                    writer.append("${item.preferredValue},")
                    writer.append("${item.purchasePrice},")
                    writer.append("${item.unrealizedGain},")
                    writer.append("${item.amazonPrice},")
                    writer.append("${item.ebayAvgSold},")
                    writer.append("${item.ebayLow},")
                    writer.append("${item.ebayHigh},")
                    writer.append("${item.ebaySampleCount},")
                    writer.append("\"${item.barcode}\",")
                    writer.append("\"${item.notes.replace("\"", "\"\"")}\",")
                    writer.append("\"${item.status}\",")
                    writer.append("${item.dateAdded},")
                    writer.append("${item.lastValuedAt}\n")
                }
            }

            FileProvider.getUriForFile(
                context,
                "${context.packageName}.fileprovider",
                file
            )
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    fun shareCsv(context: Context, uri: Uri) {
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "text/csv"
            putExtra(Intent.EXTRA_STREAM, uri)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        context.startActivity(Intent.createChooser(intent, "Export Collection"))
    }

    fun importFromCsv(context: Context, uri: Uri): List<Collectible> {
        val items = mutableListOf<Collectible>()
        try {
            context.contentResolver.openInputStream(uri)?.use { inputStream ->
                BufferedReader(InputStreamReader(inputStream)).use { reader ->
                    val header = reader.readLine() ?: return emptyList()
                    // Support both old and new header layouts by position where possible
                    reader.lineSequence().forEach { line ->
                        if (line.isBlank()) return@forEach
                        val cols = parseCsvLine(line)
                        if (cols.size >= 4) {
                            // Detect new format by presence of many columns
                            val isNew = cols.size >= 20
                            if (isNew) {
                                items.add(
                                    Collectible(
                                        name = cols.getOrElse(1) { "Unknown" },
                                        category = cols.getOrElse(2) { "Other" },
                                        brand = cols.getOrElse(3) { "" },
                                        series = cols.getOrElse(4) { "" },
                                        year = cols.getOrElse(5) { "" }.toIntOrNull(),
                                        condition = cols.getOrElse(6) { "Near Mint" },
                                        variant = cols.getOrElse(7) { "" },
                                        quantity = cols.getOrElse(8) { "1" }.toIntOrNull() ?: 1,
                                        location = cols.getOrElse(9) { "" },
                                        estimatedValue = cols.getOrElse(10) { "0" }.toDoubleOrNull() ?: 0.0,
                                        purchasePrice = cols.getOrElse(12) { "0" }.toDoubleOrNull() ?: 0.0,
                                        amazonPrice = cols.getOrElse(14) { "0" }.toDoubleOrNull() ?: 0.0,
                                        ebayAvgSold = cols.getOrElse(15) { "0" }.toDoubleOrNull() ?: 0.0,
                                        ebayLow = cols.getOrElse(16) { "0" }.toDoubleOrNull() ?: 0.0,
                                        ebayHigh = cols.getOrElse(17) { "0" }.toDoubleOrNull() ?: 0.0,
                                        ebaySampleCount = cols.getOrElse(18) { "0" }.toIntOrNull() ?: 0,
                                        barcode = cols.getOrElse(19) { "" },
                                        notes = cols.getOrElse(20) { "" },
                                        status = cols.getOrElse(21) { "Owned" }
                                    )
                                )
                            } else {
                                // Legacy format
                                items.add(
                                    Collectible(
                                        name = cols.getOrElse(1) { "Unknown" },
                                        category = cols.getOrElse(2) { "Other" },
                                        brand = cols.getOrElse(3) { "" },
                                        series = cols.getOrElse(4) { "" },
                                        year = cols.getOrElse(5) { "" }.toIntOrNull(),
                                        condition = cols.getOrElse(6) { "Near Mint" },
                                        estimatedValue = cols.getOrElse(7) { "0" }.toDoubleOrNull() ?: 0.0,
                                        purchasePrice = cols.getOrElse(8) { "0" }.toDoubleOrNull() ?: 0.0,
                                        amazonPrice = cols.getOrElse(9) { "0" }.toDoubleOrNull() ?: 0.0,
                                        ebayAvgSold = cols.getOrElse(10) { "0" }.toDoubleOrNull() ?: 0.0,
                                        barcode = cols.getOrElse(11) { "" },
                                        notes = cols.getOrElse(12) { "" },
                                        status = cols.getOrElse(13) { "Owned" }
                                    )
                                )
                            }
                        }
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return items
    }

    private fun parseCsvLine(line: String): List<String> {
        val result = mutableListOf<String>()
        var current = StringBuilder()
        var inQuotes = false
        for (i in line.indices) {
            val c = line[i]
            when {
                c == '"' -> inQuotes = !inQuotes
                c == ',' && !inQuotes -> {
                    result.add(current.toString())
                    current = StringBuilder()
                }
                else -> current.append(c)
            }
        }
        result.add(current.toString())
        return result
    }
}
