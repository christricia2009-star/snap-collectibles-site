package com.snapcollectibles.app.data

import android.content.Context
import android.content.SharedPreferences

class PreferencesManager(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences("snap_collectibles_prefs", Context.MODE_PRIVATE)

    var rainforestApiKey: String
        get() = prefs.getString("rainforest_api_key", "") ?: ""
        set(value) = prefs.edit().putString("rainforest_api_key", value).apply()

    var soldCompsApiKey: String
        get() = prefs.getString("soldcomps_api_key", "") ?: ""
        set(value) = prefs.edit().putString("soldcomps_api_key", value).apply()

    var openRouterApiKey: String
        get() = prefs.getString("openrouter_api_key", "") ?: ""
        set(value) = prefs.edit().putString("openrouter_api_key", value).apply()

    /** Cached portfolio snapshot for the home-screen widget. */
    var lastPortfolioValue: Double
        get() = prefs.getFloat("last_portfolio_value", 0f).toDouble()
        set(value) = prefs.edit().putFloat("last_portfolio_value", value.toFloat()).apply()

    var lastPortfolioCount: Int
        get() = prefs.getInt("last_portfolio_count", 0)
        set(value) = prefs.edit().putInt("last_portfolio_count", value).apply()

    fun updatePortfolioSnapshot(value: Double, count: Int) {
        prefs.edit()
            .putFloat("last_portfolio_value", value.toFloat())
            .putInt("last_portfolio_count", count)
            .apply()
    }
}
