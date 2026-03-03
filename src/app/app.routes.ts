import { Routes } from '@angular/router';
import { Welcome } from './pages/welcome/welcome';

export const routes: Routes = [
    { path: '', component: Welcome },
    { path: 'accounts', loadChildren: () => import('./pages/accounts/accounts-main/accounts-main-module').then(m => m.AccountsMainModule) },
];
