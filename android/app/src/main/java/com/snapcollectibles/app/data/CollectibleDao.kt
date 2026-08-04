package com.snapcollectibles.app.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface CollectibleDao {

    @Query("SELECT * FROM collectibles ORDER BY dateAdded DESC")
    fun getAll(): Flow<List<Collectible>>

    @Query("SELECT * FROM collectibles WHERE status = :status ORDER BY dateAdded DESC")
    fun getByStatus(status: String): Flow<List<Collectible>>

    @Query("SELECT * FROM collectibles WHERE id = :id")
    suspend fun getById(id: Long): Collectible?

    @Query("""
        SELECT * FROM collectibles 
        WHERE (name LIKE '%' || :query || '%' 
            OR barcode LIKE '%' || :query || '%' 
            OR brand LIKE '%' || :query || '%')
        AND (:status = '' OR status = :status)
        ORDER BY dateAdded DESC
    """)
    fun search(query: String, status: String = ""): Flow<List<Collectible>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(collectible: Collectible): Long

    @Update
    suspend fun update(collectible: Collectible)

    @Delete
    suspend fun delete(collectible: Collectible)

    @Query("DELETE FROM collectibles WHERE id = :id")
    suspend fun deleteById(id: Long)
}