import { Routes } from '@angular/router';
import { Welcome } from './pages/welcome/welcome';

export const routes: Routes = [
    { path: '', component: Welcome },
    { path: 'accounts', loadChildren: () => import('./pages/accounts/accounts-main/accounts-main-module').then(m => m.AccountsMainModule) },
    { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard/dashboard-module').then(m => m.DashboardModule) },
    { path: 'admin', loadChildren: () => import('./pages/admin/admin/admin-module').then(m => m.AdminModule) },
];
