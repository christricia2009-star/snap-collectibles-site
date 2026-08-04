package com.snapcollectibles.app.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "collectibles")
data class Collectible(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val category: String = "Other",
    val brand: String = "",
    val series: String = "",
    val year: Int? = null,
    val condition: String = "Near Mint",
    val estimatedValue: Double = 0.0,
    val purchasePrice: Double = 0.0,
    val barcode: String = "",
    val photoUri: String = "",
    val photoUri2: String = "",
    val photoUri3: String = "",
    val notes: String = "",
    val amazonPrice: Double = 0.0,
    val ebayAvgSold: Double = 0.0,
    val ebayLow: Double = 0.0,
    val ebayHigh: Double = 0.0,
    val ebaySampleCount: Int = 0,
    val lastValuedAt: Long = 0L,
    val status: String = "Owned",          // Owned | Selling | Wishlist
    val dateAdded: Long = System.currentTimeMillis(),
    // Simple price history stored as JSON string: [{"ts":123,"price":45.0,"source":"ebay"}, ...]
    val priceHistoryJson: String = "[]",
    val location: String = "",
    val quantity: Int = 1,
    val variant: String = "",
    val seriesTarget: Int = 0
)

/** Preferred market value: eBay sold avg > Amazon > manual estimate. */
val Collectible.preferredValue: Double
    get() = when {
        ebayAvgSold > 0.0 -> ebayAvgSold
        amazonPrice > 0.0 -> amazonPrice
        else -> estimatedValue
    }

/** (preferredValue - purchasePrice) × quantity when purchase price is set. */
val Collectible.unrealizedGain: Double
    get() = if (purchasePrice > 0.0) {
        (preferredValue - purchasePrice) * quantity.coerceAtLeast(1)
    } else {
        0.0
    }

val Collectible.hasRoiData: Boolean
    get() = purchasePrice > 0.0 && preferredValue > 0.0

val Collectible.allPhotos: List<String>
    get() = listOf(photoUri, photoUri2, photoUri3).filter { it.isNotBlank() }

/** Line-item market value (preferred × quantity). */
val Collectible.portfolioValue: Double
    get() = preferredValue * quantity.coerceAtLeast(1)

fun Collectible.isFreshlyValued(withinMs: Long = FRESH_VALUATION_MS): Boolean {
    if (lastValuedAt <= 0L) return false
    return System.currentTimeMillis() - lastValuedAt < withinMs
}

const val FRESH_VALUATION_MS: Long = 24L * 60L * 60L * 1000L
