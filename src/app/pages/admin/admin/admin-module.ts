import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from '../admin-dashboard/admin-dashboard';
import { RestaurantDetails } from '../restaurant-details/restaurant-details';

import { DashboardLayout as AdminDashboardLayout } from '../dashboard-layout/dashboard-layout';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardLayout,
    children: [
      { path: '', component: AdminDashboard },
      { path: 'restaurant-details/:id', component: RestaurantDetails},
    ]
  }
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
export class AdminModule { }
