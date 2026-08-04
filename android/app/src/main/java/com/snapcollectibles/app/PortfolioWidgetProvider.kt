package com.snapcollectibles.app

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import com.snapcollectibles.app.data.PreferencesManager

class PortfolioWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val prefs = PreferencesManager(context)
        val value = prefs.lastPortfolioValue
        val count = prefs.lastPortfolioCount
        appWidgetIds.forEach { id ->
            val views = RemoteViews(context.packageName, R.layout.widget_portfolio)
            views.setTextViewText(R.id.widget_value, "$" + "%.2f".format(value))
            views.setTextViewText(R.id.widget_count, "$count items")
            appWidgetManager.updateAppWidget(id, views)
        }
    }

    companion object {
        fun refreshAll(context: Context) {
            val prefs = PreferencesManager(context)
            val mgr = AppWidgetManager.getInstance(context)
            val ids = mgr.getAppWidgetIds(
                android.content.ComponentName(context, PortfolioWidgetProvider::class.java)
            )
            if (ids.isNotEmpty()) {
                val views = RemoteViews(context.packageName, R.layout.widget_portfolio)
                views.setTextViewText(R.id.widget_value, "$" + "%.2f".format(prefs.lastPortfolioValue))
                views.setTextViewText(R.id.widget_count, "${prefs.lastPortfolioCount} items")
                ids.forEach { mgr.updateAppWidget(it, views) }
            }
        }
    }
}
