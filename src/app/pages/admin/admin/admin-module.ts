import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from '../admin-dashboard/admin-dashboard';
import { RestaurantDetails } from '../restaurant-details/restaurant-details';
import { ApprovedRequest } from '../approved-request/approved-request';
import { RejectedRequests } from '../rejected-requests/rejected-requests';

/*
const routes: Routes = [
  { path: '', component: AdminDashboard },
  { path: 'restaurant-details/:id', component: RestaurantDetails},
  { path: 'approved-requests', component: ApprovedRequest},
  { path: 'rejected-requests', component: RejectedRequests}
*/

import { DashboardLayout as AdminDashboardLayout } from '../dashboard-layout/dashboard-layout';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardLayout,
    children: [
      { path: '', component: AdminDashboard },
      { path: 'restaurant-details/:id', component: RestaurantDetails},
      { path: 'approved-requests', component: ApprovedRequest},
      { path: 'rejected-requests', component: RejectedRequests}
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
