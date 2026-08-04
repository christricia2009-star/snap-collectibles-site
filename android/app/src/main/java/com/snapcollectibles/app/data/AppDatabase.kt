package com.snapcollectibles.app.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

/**
 * Room DB version 5 adds: location, quantity, variant, photoUri2/3,
 * ebayLow/High/SampleCount, seriesTarget.
 *
 * Uses [fallbackToDestructiveMigration] — export CSV before upgrading
 * if you need to keep local data across schema changes.
 */
@Database(
    entities = [Collectible::class],
    version = 5,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun collectibleDao(): CollectibleDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "snap_collectibles.db"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
