import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardMain } from '../dashboard-main/dashboard-main';



export const routes: Routes = [
    { path: '', component: DashboardMain },
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

export class DashboardModule { }
