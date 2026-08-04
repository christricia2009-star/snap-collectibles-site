package com.snapcollectibles.app.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.snapcollectibles.app.MainActivity
import com.snapcollectibles.app.R
import com.snapcollectibles.app.data.PreferencesManager

/**
 * Home-screen widget: collection market value + item count.
 * Values come from SharedPreferences, refreshed when the collection changes.
 */
class PortfolioWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { id ->
            updateAppWidget(context, appWidgetManager, id)
        }
    }

    companion object {
        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val prefs = PreferencesManager(context)
            val value = prefs.lastPortfolioValue
            val count = prefs.lastPortfolioCount

            val views = RemoteViews(context.packageName, R.layout.widget_portfolio)
            views.setTextViewText(
                R.id.widget_value,
                "$${"%,.2f".format(value)}"
            )
            views.setTextViewText(
                R.id.widget_count,
                if (count == 1) "1 piece" else "$count pieces"
            )
            views.setTextViewText(R.id.widget_title, "Snap Collectibles")

            val launch = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val pending = PendingIntent.getActivity(
                context,
                0,
                launch,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root, pending)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
