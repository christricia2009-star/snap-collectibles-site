package com.snapcollectibles.app.data

import android.graphics.Bitmap
import android.util.Base64
import com.google.gson.Gson
import com.google.gson.JsonArray
import com.google.gson.JsonObject
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.ByteArrayOutputStream
import java.util.concurrent.TimeUnit

data class SoldListing(
    val title: String,
    val soldPrice: Double,
    val shipping: Double,
    val condition: String,
    val soldDate: String,
    val url: String
)

data class SoldCompResult(
    val avgPrice: Double,
    val minPrice: Double,
    val maxPrice: Double,
    val count: Int,
    val listings: List<SoldListing> = emptyList()
)

data class AiIdentifyResult(
    val name: String,
    val brand: String,
    val series: String,
    val category: String,
    val year: String?,
    val confidence: String
)

data class PriceHistoryPoint(
    val ts: Long,
    val price: Double,
    val source: String
)

class ValuationService {

    private val client = OkHttpClient.Builder()
        .connectTimeout(45, TimeUnit.SECONDS)
        .readTimeout(90, TimeUnit.SECONDS)
        .build()

    private val gson = Gson()

    // ──────────────────────────────────────────────
    // Amazon via Rainforest
    // ──────────────────────────────────────────────
    suspend fun getAmazonPrice(
        apiKey: String,
        asinOrUpc: String,
        isUpc: Boolean = false
    ): Double? = withContext(Dispatchers.IO) {
        try {
            val url = if (isUpc) {
                "https://api.rainforestapi.com/request?api_key=$apiKey&type=product&gtin=$asinOrUpc&amazon_domain=amazon.com"
            } else {
                "https://api.rainforestapi.com/request?api_key=$apiKey&type=product&asin=$asinOrUpc&amazon_domain=amazon.com"
            }
            val request = Request.Builder().url(url).build()
            val response = client.newCall(request).execute()
            val body = response.body?.string() ?: return@withContext null
            val json = gson.fromJson(body, JsonObject::class.java)
            val product = json.getAsJsonObject("product") ?: return@withContext null
            val buybox = product.getAsJsonObject("buybox_winner")
            val priceObj = buybox?.getAsJsonObject("price") ?: product.getAsJsonObject("price")
            priceObj?.get("value")?.asDouble
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    // ──────────────────────────────────────────────
    // eBay Sold Comps via SoldComps API
    // ──────────────────────────────────────────────
    suspend fun getEbaySoldComps(
        apiKey: String,
        query: String
    ): SoldCompResult? = withContext(Dispatchers.IO) {
        try {
            val encoded = java.net.URLEncoder.encode(query, "UTF-8")
            val url = "https://api.sold-comps.com/v1/scrape?keyword=$encoded&count=40"

            val request = Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer $apiKey")
                .build()

            val response = client.newCall(request).execute()
            val body = response.body?.string() ?: return@withContext null
            val json = gson.fromJson(body, JsonObject::class.java)
            val items = json.getAsJsonArray("items") ?: return@withContext null

            val listings = mutableListOf<SoldListing>()
            val prices = mutableListOf<Double>()

            items.forEach { element ->
                val obj = element.asJsonObject
                val priceStr = obj.get("soldPrice")?.asString
                val price = priceStr?.toDoubleOrNull()
                if (price != null) {
                    prices.add(price)
                    listings.add(
                        SoldListing(
                            title = obj.get("title")?.asString ?: "",
                            soldPrice = price,
                            shipping = obj.get("shippingPrice")?.asString?.toDoubleOrNull() ?: 0.0,
                            condition = obj.get("condition")?.asString ?: "",
                            soldDate = obj.get("endedAt")?.asString ?: "",
                            url = obj.get("url")?.asString ?: ""
                        )
                    )
                }
            }

            if (prices.isEmpty()) return@withContext null

            SoldCompResult(
                avgPrice = prices.average(),
                minPrice = prices.minOrNull() ?: 0.0,
                maxPrice = prices.maxOrNull() ?: 0.0,
                count = prices.size,
                listings = listings
            )
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    // ──────────────────────────────────────────────
    // OpenRouter AI Vision – single item
    // ──────────────────────────────────────────────
    suspend fun identifyFromPhoto(
        apiKey: String,
        imageBase64: String,
        categoryHint: String = ""
    ): AiIdentifyResult? = withContext(Dispatchers.IO) {
        try {
            val hint = if (categoryHint.isNotBlank()) {
                " The item is likely in the category: $categoryHint."
            } else ""
            val prompt = """
                You are an expert collectibles identifier.$hint
                Look at this photo of a collectible item (Funko, sports card, comic, toy, coin, etc.).
                Return ONLY a valid JSON object with these fields:
                {
                  "name": "full item name",
                  "brand": "brand or manufacturer",
                  "series": "series or line if known",
                  "category": "one of: Funko, Sports Cards, Comics, Coins, Toys, Action Figures, Trading Cards, Other",
                  "year": "year if visible or known, otherwise null",
                  "confidence": "high, medium, or low"
                }
                Do not add any extra text outside the JSON.
            """.trimIndent()

            val content = callOpenRouterVision(apiKey, imageBase64, prompt) ?: return@withContext null
            val clean = stripJsonFences(content)
            val resultJson = gson.fromJson(clean, JsonObject::class.java)

            AiIdentifyResult(
                name = resultJson.get("name")?.asString ?: "",
                brand = resultJson.get("brand")?.asString ?: "",
                series = resultJson.get("series")?.asString ?: "",
                category = resultJson.get("category")?.asString ?: "Other",
                year = resultJson.get("year")?.asString,
                confidence = resultJson.get("confidence")?.asString ?: "medium"
            )
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    // ──────────────────────────────────────────────
    // OpenRouter AI Vision – bulk shelf / group scan
    // ──────────────────────────────────────────────
    suspend fun identifyBulkFromPhoto(
        apiKey: String,
        imageBase64: String,
        categoryHint: String = ""
    ): List<AiIdentifyResult>? = withContext(Dispatchers.IO) {
        try {
            val hint = if (categoryHint.isNotBlank()) {
                " Prefer identifying items as category: $categoryHint."
            } else ""
            val prompt = """
                You are an expert collectibles identifier looking at a shelf or group photo of collectibles.$hint
                Identify as many distinct collectible items as you can see (Funko Pops, cards, figures, etc.).
                Return ONLY a valid JSON array (no extra text). Each element:
                {
                  "name": "full item name",
                  "brand": "brand or manufacturer",
                  "series": "series or line if known",
                  "category": "one of: Funko, Sports Cards, Comics, Coins, Toys, Action Figures, Trading Cards, Other",
                  "year": "year if known otherwise null",
                  "confidence": "high, medium, or low"
                }
                If you are unsure about an item, still include it with lower confidence.
                Maximum 25 items. Do not invent items that are not visible.
            """.trimIndent()

            val content = callOpenRouterVision(apiKey, imageBase64, prompt) ?: return@withContext null
            val clean = stripJsonFences(content)

            val array: JsonArray = try {
                gson.fromJson(clean, JsonArray::class.java)
            } catch (_: Exception) {
                // Model sometimes wraps array in an object
                val obj = gson.fromJson(clean, JsonObject::class.java)
                obj.getAsJsonArray("items")
                    ?: obj.getAsJsonArray("results")
                    ?: return@withContext null
            }

            val results = mutableListOf<AiIdentifyResult>()
            array.forEach { element ->
                val o = element.asJsonObject
                val name = o.get("name")?.asString?.trim().orEmpty()
                if (name.isNotBlank()) {
                    results.add(
                        AiIdentifyResult(
                            name = name,
                            brand = o.get("brand")?.asString ?: "",
                            series = o.get("series")?.asString ?: "",
                            category = o.get("category")?.asString ?: categoryHint.ifBlank { "Other" },
                            year = o.get("year")?.asString,
                            confidence = o.get("confidence")?.asString ?: "medium"
                        )
                    )
                }
            }
            results.ifEmpty { null }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    /**
     * Re-value a single item using SoldComps (by name) and Rainforest (by barcode/ASIN).
     * Skips network if [force] is false and last valued within 24h.
     * Appends successful prices to priceHistoryJson.
     */
    suspend fun revalueItem(
        item: Collectible,
        rainforestKey: String,
        soldCompsKey: String,
        force: Boolean = false
    ): Collectible = withContext(Dispatchers.IO) {
        if (!force && item.isFreshlyValued()) {
            return@withContext item
        }

        var updated = item
        var history = parseHistory(item.priceHistoryJson)
        val now = System.currentTimeMillis()

        var touched = false

        if (soldCompsKey.isNotBlank() && item.name.isNotBlank()) {
            val comps = getEbaySoldComps(soldCompsKey, item.name)
            if (comps != null) {
                updated = updated.copy(
                    ebayAvgSold = comps.avgPrice,
                    ebayLow = comps.minPrice,
                    ebayHigh = comps.maxPrice,
                    ebaySampleCount = comps.count,
                    estimatedValue = if (updated.estimatedValue == 0.0) comps.avgPrice else updated.estimatedValue
                )
                history = appendHistory(history, comps.avgPrice, "eBay")
                touched = true
            }
        }

        if (rainforestKey.isNotBlank() && item.barcode.isNotBlank()) {
            val isUpc = item.barcode.length >= 12 && item.barcode.all { it.isDigit() }
            val amazon = getAmazonPrice(rainforestKey, item.barcode, isUpc = isUpc)
            if (amazon != null) {
                updated = updated.copy(
                    amazonPrice = amazon,
                    estimatedValue = if (updated.estimatedValue == 0.0) amazon else updated.estimatedValue
                )
                history = appendHistory(history, amazon, "Amazon")
                touched = true
            }
        }

        if (touched) {
            updated = updated.copy(
                priceHistoryJson = gson.toJson(history.take(20)),
                lastValuedAt = now
            )
        }
        updated
    }

    /**
     * Batch re-value. Calls [onProgress] after each item (done, total).
     * Rate-limits ~400ms between network-backed items. Updates via [onItemUpdated].
     */
    suspend fun batchRevalue(
        items: List<Collectible>,
        rainforestKey: String,
        soldCompsKey: String,
        force: Boolean = false,
        onProgress: suspend (done: Int, total: Int, currentName: String) -> Unit = { _, _, _ -> },
        onItemUpdated: suspend (Collectible) -> Unit = {}
    ): Int {
        val total = items.size
        var successCount = 0
        items.forEachIndexed { index, item ->
            onProgress(index, total, item.name)
            val before = item
            val after = revalueItem(item, rainforestKey, soldCompsKey, force)
            val changed = after.ebayAvgSold != before.ebayAvgSold ||
                after.amazonPrice != before.amazonPrice ||
                after.ebayLow != before.ebayLow ||
                after.lastValuedAt != before.lastValuedAt
            if (changed) {
                onItemUpdated(after)
                successCount++
            }
            if (index < items.lastIndex) {
                delay(400)
            }
            onProgress(index + 1, total, item.name)
        }
        return successCount
    }

    // ──────────────────────────────────────────────
    // Image helpers
    // ──────────────────────────────────────────────

    /** Downscale large bitmaps then JPEG+base64 encode for OpenRouter. */
    fun encodeBitmapForAi(bitmap: Bitmap, maxDim: Int = 1280, quality: Int = 72): String {
        val scaled = downscale(bitmap, maxDim)
        val stream = ByteArrayOutputStream()
        scaled.compress(Bitmap.CompressFormat.JPEG, quality, stream)
        if (scaled !== bitmap) scaled.recycle()
        return Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP)
    }

    fun downscale(bitmap: Bitmap, maxDim: Int): Bitmap {
        val w = bitmap.width
        val h = bitmap.height
        val longest = maxOf(w, h)
        if (longest <= maxDim) return bitmap
        val scale = maxDim.toFloat() / longest
        val nw = (w * scale).toInt().coerceAtLeast(1)
        val nh = (h * scale).toInt().coerceAtLeast(1)
        return Bitmap.createScaledBitmap(bitmap, nw, nh, true)
    }

    // ──────────────────────────────────────────────
    // Internals
    // ──────────────────────────────────────────────

    private fun callOpenRouterVision(
        apiKey: String,
        imageBase64: String,
        prompt: String
    ): String? {
        val dataUrl = "data:image/jpeg;base64,$imageBase64"
        val payload = mapOf(
            "model" to "google/gemini-2.5-flash",
            "messages" to listOf(
                mapOf(
                    "role" to "user",
                    "content" to listOf(
                        mapOf("type" to "text", "text" to prompt),
                        mapOf(
                            "type" to "image_url",
                            "image_url" to mapOf("url" to dataUrl)
                        )
                    )
                )
            )
        )

        val jsonBody = gson.toJson(payload)
        val body = jsonBody.toRequestBody("application/json".toMediaType())

        val request = Request.Builder()
            .url("https://openrouter.ai/api/v1/chat/completions")
            .addHeader("Authorization", "Bearer $apiKey")
            .addHeader("Content-Type", "application/json")
            .post(body)
            .build()

        val response = client.newCall(request).execute()
        val responseBody = response.body?.string() ?: return null
        val json = gson.fromJson(responseBody, JsonObject::class.java)

        return json
            .getAsJsonArray("choices")
            ?.get(0)?.asJsonObject
            ?.getAsJsonObject("message")
            ?.get("content")?.asString
    }

    private fun stripJsonFences(content: String): String {
        return content
            .replace("```json", "")
            .replace("```", "")
            .trim()
    }

    private fun parseHistory(json: String): MutableList<PriceHistoryPoint> {
        return try {
            val type = object : TypeToken<MutableList<PriceHistoryPoint>>() {}.type
            gson.fromJson(json, type) ?: mutableListOf()
        } catch (_: Exception) {
            mutableListOf()
        }
    }

    private fun appendHistory(
        history: MutableList<PriceHistoryPoint>,
        price: Double,
        source: String
    ): MutableList<PriceHistoryPoint> {
        history.add(0, PriceHistoryPoint(System.currentTimeMillis(), price, source))
        return history
    }
}
