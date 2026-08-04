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

    /** Full header used by current exports (new layout). */
    private val NEW_HEADERS = listOf(
        "ID", "Name", "Category", "Brand", "Series", "Year", "Condition",
        "Estimated Value", "Preferred Value", "Unrealized Gain",
        "Purchase Price", "Amazon Price", "eBay Avg Sold", "eBay Low", "eBay High",
        "eBay Sample Count", "Barcode", "Notes", "Status", "Date Added",
        "Location", "Quantity", "Variant", "Series Target",
        "Photo URI", "Photo URI 2", "Photo URI 3"
    )

    fun exportCollectionToCsv(context: Context, collectibles: List<Collectible>): Uri? {
        return try {
            val timestamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date())
            val fileName = "SnapCollectibles_$timestamp.csv"
            val file = File(context.cacheDir, fileName)

            FileWriter(file).use { writer ->
                writer.append(NEW_HEADERS.joinToString(","))
                writer.append("\n")

                collectibles.forEach { item ->
                    writer.append("${item.id},")
                    writer.append("\"${escape(item.name)}\",")
                    writer.append("\"${escape(item.category)}\",")
                    writer.append("\"${escape(item.brand)}\",")
                    writer.append("\"${escape(item.series)}\",")
                    writer.append("${item.year ?: ""},")
                    writer.append("\"${escape(item.condition)}\",")
                    writer.append("${item.estimatedValue},")
                    writer.append("${item.preferredValue},")
                    writer.append("${item.unrealizedGain},")
                    writer.append("${item.purchasePrice},")
                    writer.append("${item.amazonPrice},")
                    writer.append("${item.ebayAvgSold},")
                    writer.append("${item.ebayLow},")
                    writer.append("${item.ebayHigh},")
                    writer.append("${item.ebaySampleCount},")
                    writer.append("\"${escape(item.barcode)}\",")
                    writer.append("\"${escape(item.notes)}\",")
                    writer.append("\"${escape(item.status)}\",")
                    writer.append("${item.dateAdded},")
                    writer.append("\"${escape(item.location)}\",")
                    writer.append("${item.quantity},")
                    writer.append("\"${escape(item.variant)}\",")
                    writer.append("${item.seriesTarget},")
                    writer.append("\"${escape(item.photoUri)}\",")
                    writer.append("\"${escape(item.photoUri2)}\",")
                    writer.append("\"${escape(item.photoUri3)}\"\n")
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

    /**
     * Accepts both legacy 15-column exports and the expanded layout.
     * Column mapping is by header name when present; falls back to legacy positions.
     */
    fun importFromCsv(context: Context, uri: Uri): List<Collectible> {
        val items = mutableListOf<Collectible>()
        try {
            context.contentResolver.openInputStream(uri)?.use { inputStream ->
                BufferedReader(InputStreamReader(inputStream)).use { reader ->
                    val headerLine = reader.readLine() ?: return emptyList()
                    val headers = parseCsvLine(headerLine).map { it.trim().lowercase(Locale.US) }
                    val isNewLayout = headers.contains("preferred value") ||
                        headers.contains("location") ||
                        headers.contains("quantity")

                    reader.lineSequence().forEach { line ->
                        if (line.isBlank()) return@forEach
                        val cols = parseCsvLine(line)
                        if (cols.size < 4) return@forEach

                        val item = if (isNewLayout && headers.isNotEmpty()) {
                            parseByHeader(headers, cols)
                        } else {
                            parseLegacy(cols)
                        }
                        if (item.name.isNotBlank()) items.add(item)
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return items
    }

    private fun parseLegacy(cols: List<String>): Collectible {
        // Legacy: ID,Name,Category,Brand,Series,Year,Condition,Est,Purchase,Amazon,eBay,Barcode,Notes,Status,DateAdded
        return Collectible(
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
    }

    private fun parseByHeader(headers: List<String>, cols: List<String>): Collectible {
        fun col(vararg names: String): String {
            for (n in names) {
                val idx = headers.indexOf(n.lowercase(Locale.US))
                if (idx >= 0 && idx < cols.size) return cols[idx]
            }
            return ""
        }

        return Collectible(
            name = col("name").ifBlank { "Unknown" },
            category = col("category").ifBlank { "Other" },
            brand = col("brand"),
            series = col("series"),
            year = col("year").toIntOrNull(),
            condition = col("condition").ifBlank { "Near Mint" },
            estimatedValue = col("estimated value").toDoubleOrNull() ?: 0.0,
            purchasePrice = col("purchase price").toDoubleOrNull() ?: 0.0,
            amazonPrice = col("amazon price").toDoubleOrNull() ?: 0.0,
            ebayAvgSold = col("ebay avg sold").toDoubleOrNull() ?: 0.0,
            ebayLow = col("ebay low").toDoubleOrNull() ?: 0.0,
            ebayHigh = col("ebay high").toDoubleOrNull() ?: 0.0,
            ebaySampleCount = col("ebay sample count").toIntOrNull() ?: 0,
            barcode = col("barcode"),
            notes = col("notes"),
            status = col("status").ifBlank { "Owned" },
            location = col("location"),
            quantity = col("quantity").toIntOrNull()?.coerceAtLeast(1) ?: 1,
            variant = col("variant"),
            seriesTarget = col("series target").toIntOrNull() ?: 0,
            photoUri = col("photo uri", "photouri"),
            photoUri2 = col("photo uri 2", "photouri2"),
            photoUri3 = col("photo uri 3", "photouri3")
        )
    }

    private fun escape(value: String): String = value.replace("\"", "\"\"")

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
