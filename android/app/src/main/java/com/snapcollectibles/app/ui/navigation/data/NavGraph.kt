package com.snapcollectibles.app.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.snapcollectibles.app.ui.screens.*
import com.snapcollectibles.app.viewmodel.CollectibleViewModel

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Add : Screen("add")
    object Edit : Screen("edit/{id}") {
        fun createRoute(id: Long) = "edit/$id"
    }
    object Detail : Screen("detail/{id}") {
        fun createRoute(id: Long) = "detail/$id"
    }
    object Settings : Screen("settings")
    object Scan : Screen("scan")
    object Stats : Screen("stats")
    object MarketRate : Screen("market_rate")
    object Series : Screen("series")
    object BulkScan : Screen("bulk_scan")
}

@Composable
fun NavGraph(
    navController: NavHostController,
    viewModel: CollectibleViewModel
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route
    ) {
        composable(Screen.Home.route) {
            HomeScreen(
                viewModel = viewModel,
                onAddClick = { navController.navigate(Screen.Add.route) },
                onItemClick = { id -> navController.navigate(Screen.Detail.createRoute(id)) },
                onSettingsClick = { navController.navigate(Screen.Settings.route) },
                onScanClick = { navController.navigate(Screen.Scan.route) },
                onStatsClick = { navController.navigate(Screen.Stats.route) },
                onSeriesClick = { navController.navigate(Screen.Series.route) },
                onBulkScanClick = { navController.navigate(Screen.BulkScan.route) }
            )
        }

        composable(Screen.Add.route) {
            AddEditScreen(
                viewModel = viewModel,
                collectibleId = null,
                onSaved = { navController.popBackStack() },
                onCancel = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.Edit.route,
            arguments = listOf(navArgument("id") { type = NavType.LongType })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getLong("id") ?: return@composable
            AddEditScreen(
                viewModel = viewModel,
                collectibleId = id,
                onSaved = { navController.popBackStack() },
                onCancel = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.Detail.route,
            arguments = listOf(navArgument("id") { type = NavType.LongType })
        ) { backStackEntry ->
            val id = backStackEntry.arguments?.getLong("id") ?: return@composable
            DetailScreen(
                viewModel = viewModel,
                collectibleId = id,
                onEdit = { navController.navigate(Screen.Edit.createRoute(id)) },
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Settings.route) {
            SettingsScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() },
                onMarketRateClick = { navController.navigate(Screen.MarketRate.route) }
            )
        }

        composable(Screen.Scan.route) {
            ScanScreen(
                viewModel = viewModel,
                onItemCreated = {},
                onCancel = { navController.popBackStack() }
            )
        }

        composable(Screen.Stats.route) {
            StatsScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.MarketRate.route) {
            MarketRateScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Series.route) {
            SeriesScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.BulkScan.route) {
            BulkScanScreen(
                viewModel = viewModel,
                onDone = { navController.popBackStack() }
            )
        }
    }
}
