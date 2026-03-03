import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { Login } from '../login/login';
import { Register } from '../register/register';
import { AccountsContainer } from '../accounts-container/accounts-container';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class AccountsMainModule { }
