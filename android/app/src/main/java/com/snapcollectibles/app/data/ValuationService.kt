package com.snapcollectibles.app.data

import android.util.Base64
import com.google.gson.Gson
import com.google.gson.JsonObject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
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

data class BulkIdentifyResult(
    val items: List<AiIdentifyResult>,
    val rawNotes: String = ""
)

class ValuationService {

    private val client = OkHttpClient.Builder()
        .connectTimeout(45, TimeUnit.SECONDS)
        .readTimeout(45, TimeUnit.SECONDS)
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
    // eBay Sold Comps via SoldComps API (with individual listings)
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
    // OpenRouter AI Vision – Identify collectible from photo
    // ──────────────────────────────────────────────
    suspend fun identifyFromPhoto(
        apiKey: String,
        imageBase64: String
    ): AiIdentifyResult? = withContext(Dispatchers.IO) {
        try {
            val prompt = """
                You are an expert collectibles identifier.
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
            val responseBody = response.body?.string() ?: return@withContext null
            val json = gson.fromJson(responseBody, JsonObject::class.java)

            val content = json
                .getAsJsonArray("choices")
                ?.get(0)?.asJsonObject
                ?.getAsJsonObject("message")
                ?.get("content")?.asString
                ?: return@withContext null

            val clean = content
                .replace("```json", "")
                .replace("```", "")
                .trim()

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
    // Bulk shelf AI – identify multiple items in one photo
    // ──────────────────────────────────────────────
    suspend fun identifyBulkFromPhoto(
        apiKey: String,
        imageBase64: String,
        categoryHint: String = ""
    ): BulkIdentifyResult? = withContext(Dispatchers.IO) {
        try {
            val categoryClause = if (categoryHint.isNotBlank()) {
                "The photo is primarily of $categoryHint collectibles."
            } else {
                "Items may be Funko Pops, action figures, cards, LEGO, toys, or other collectibles."
            }
            val prompt = """
                You are an expert collectibles identifier looking at a shelf or group photo.
                $categoryClause
                Detect EVERY distinct collectible item visible in the image (boxed or loose).
                Return ONLY a valid JSON object with this shape:
                {
                  "items": [
                    {
                      "name": "full item name",
                      "brand": "brand or manufacturer",
                      "series": "series or line if known",
                      "category": "one of: Funko, Sports Cards, Comics, Coins, Toys, Action Figures, Trading Cards, LEGO, Other",
                      "year": "year if visible or known, otherwise null",
                      "confidence": "high, medium, or low"
                    }
                  ],
                  "notes": "optional short note about lighting, occlusion, or uncertainty"
                }
                List each unique item once. If you are unsure about an item, still include it with low confidence.
                Do not add any text outside the JSON.
            """.trimIndent()

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
            val responseBody = response.body?.string() ?: return@withContext null
            val json = gson.fromJson(responseBody, JsonObject::class.java)

            val content = json
                .getAsJsonArray("choices")
                ?.get(0)?.asJsonObject
                ?.getAsJsonObject("message")
                ?.get("content")?.asString
                ?: return@withContext null

            val clean = content
                .replace("```json", "")
                .replace("```", "")
                .trim()

            val resultJson = gson.fromJson(clean, JsonObject::class.java)
            val itemsArr = resultJson.getAsJsonArray("items") ?: return@withContext null
            val notes = resultJson.get("notes")?.asString ?: ""

            val items = mutableListOf<AiIdentifyResult>()
            itemsArr.forEach { el ->
                val o = el.asJsonObject
                items.add(
                    AiIdentifyResult(
                        name = o.get("name")?.asString ?: "",
                        brand = o.get("brand")?.asString ?: "",
                        series = o.get("series")?.asString ?: "",
                        category = o.get("category")?.asString ?: "Other",
                        year = o.get("year")?.asString,
                        confidence = o.get("confidence")?.asString ?: "medium"
                    )
                )
            }
            if (items.isEmpty()) return@withContext null
            BulkIdentifyResult(items = items, rawNotes = notes)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

}
