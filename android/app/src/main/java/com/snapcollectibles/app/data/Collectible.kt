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
    val notes: String = "",
    val amazonPrice: Double = 0.0,
    val ebayAvgSold: Double = 0.0,
    val lastValuedAt: Long = 0L,
    val status: String = "Owned",          // Owned | Selling | Wishlist
    val dateAdded: Long = System.currentTimeMillis(),
    val priceHistoryJson: String = "[]",

    val location: String = "",
    val quantity: Int = 1,
    val variant: String = "",
    val photoUri2: String = "",
    /** Third photo slot for multi-photo gallery */
    val photoUri3: String = "",
    val ebayLow: Double = 0.0,
    val ebayHigh: Double = 0.0,
    val ebaySampleCount: Int = 0,
    /**
     * Optional known total for this series (e.g. "12" for a 12-pop wave).
     * Used for series completion %. 0 = unknown / not set.
     */
    val seriesTarget: Int = 0
) {
    val preferredValue: Double
        get() = when {
            ebayAvgSold > 0 -> ebayAvgSold
            amazonPrice > 0 -> amazonPrice
            else -> estimatedValue
        }

    val unrealizedGain: Double
        get() = if (purchasePrice > 0) preferredValue - purchasePrice else 0.0

    val hasRoiData: Boolean
        get() = purchasePrice > 0 && preferredValue > 0

    /** All non-blank photo URIs for gallery */
    val allPhotos: List<String>
        get() = listOf(photoUri, photoUri2, photoUri3).filter { it.isNotBlank() }

    /** True if valued within the given window (ms) */
    fun isFreshlyValued(withinMs: Long = 24L * 60 * 60 * 1000): Boolean {
        if (lastValuedAt <= 0) return false
        return System.currentTimeMillis() - lastValuedAt < withinMs
    }
}
