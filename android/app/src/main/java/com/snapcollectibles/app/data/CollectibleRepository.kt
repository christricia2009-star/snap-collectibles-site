package com.snapcollectibles.app.data

import kotlinx.coroutines.flow.Flow

class CollectibleRepository(private val dao: CollectibleDao) {

    fun getAll(): Flow<List<Collectible>> = dao.getAll()

    fun getByStatus(status: String): Flow<List<Collectible>> = dao.getByStatus(status)

    fun search(query: String, status: String = ""): Flow<List<Collectible>> = dao.search(query, status)

    suspend fun getById(id: Long) = dao.getById(id)

    suspend fun insert(collectible: Collectible) = dao.insert(collectible)

    suspend fun update(collectible: Collectible) = dao.update(collectible)

    suspend fun delete(collectible: Collectible) = dao.delete(collectible)

    suspend fun deleteById(id: Long) = dao.deleteById(id)
}