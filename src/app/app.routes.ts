import { Routes } from '@angular/router';
import { Welcome } from './pages/welcome/welcome';
import { DashboardLayout } from './pages/dashboard/dashboard-layout/dashboard-layout';

export const routes: Routes = [
    { path: '', component: Welcome },
    { path: 'accounts', loadChildren: () => import('./pages/accounts/accounts-main/accounts-main-module').then(m => m.AccountsMainModule) },
    { 
        path: '',
        component: DashboardLayout,
        children: [
            { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard/dashboard-module').then(m => m.DashboardModule) },
            { path: 'inventory', loadChildren: () => import('./pages/inventory/inventory/inventory-module').then(m => m.InventoryModule) },
            { path: 'recipes', loadChildren: () => import('./pages/recipes/recipe/recipe-module').then(m => m.RecipeModule) }
        ]
    },
    { path: 'admin', loadChildren: () => import('./pages/admin/admin/admin-module').then(m => m.AdminModule) },
];
