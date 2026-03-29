import { Routes } from '@angular/router';
import { Welcome } from './pages/welcome/welcome';
import { DashboardLayout } from './pages/dashboard/dashboard-layout/dashboard-layout';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: Welcome, pathMatch: 'full' },
    {
        path: 'm/:slug',
        loadComponent: () => import('./pages/public-menu/public-menu').then(m => m.PublicMenuComponent),
        canActivate: [guestGuard]
    },
    { 
        path: 'accounts', 
        loadChildren: () => import('./pages/accounts/accounts-main/accounts-main-module').then(m => m.AccountsMainModule),
        canActivate: [guestGuard]
    },
    {
        path: 'onboarding',
        loadComponent: () => import('./pages/onboarding/onboarding').then(m => m.Onboarding),
        canActivate: [authGuard]
    },
    { 
        path: '',
        component: DashboardLayout,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard/dashboard-module').then(m => m.DashboardModule) },
            { path: 'inventory', loadChildren: () => import('./pages/inventory/inventory/inventory-module').then(m => m.InventoryModule) },
            { path: 'recipes', loadChildren: () => import('./pages/recipes/recipe/recipe-module').then(m => m.RecipeModule) },
            { path: 'products', loadChildren: () => import('./pages/products/products-module').then(m => m.ProductsModule) },
            { path: 'team', loadChildren: () => import('./pages/teams/teams-main/teams-main-module').then(m => m.TeamsModule) },
            { path: 'settings', loadChildren: () => import('./pages/settings/setting/setting-module').then(m => m.SettingModule) },
            { path: 'orders', loadChildren: () => import('./pages/orders/orders/orders-module').then(m => m.OrdersModule) },
            { path: 'table-manager', loadChildren: () => import('./pages/tableorders/tableorder/tableorder-module').then(m => m.TableorderModule) },
            { path: 'customers', loadComponent: () => import('./pages/customers/customers').then(m => m.CustomersComponent) },
        ]
    },
    { path: 'pos', loadChildren: () => import('./pages/pos/pos/pos-module').then(m => m.PosModule) },

    { 
        path: 'admin', 
        loadChildren: () => import('./pages/admin/admin/admin-module').then(m => m.AdminModule),
        canActivate: [adminGuard]
    },
    {
        path: 'kds',
        loadChildren:() => import('./pages/kds/kds/kds-module').then(m=>m.KdsModule),
        canActivate: [authGuard]
    },
    {
        path: 'print/order/:id',
        loadComponent: () => import('./pages/orders/print-bill/print-bill').then(m => m.PrintBill),
        canActivate: [authGuard]
    },
    {
        path: '403',
        loadComponent: () => import('./pages/errors/error-403').then(m => m.Error403)
    },
    {
        path: '500',
        loadComponent: () => import('./pages/errors/error-500').then(m => m.Error500)
    },
    {
        path: '**',
        loadComponent: () => import('./pages/errors/error-404').then(m => m.Error404)
    }
];
