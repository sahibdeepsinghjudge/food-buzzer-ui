import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrdersList } from '../orders-list/orders-list';
import { OrderDetails } from '../order-details/order-details';

const routes: Routes = [
  { path: '', component: OrdersList },
  { path: ':id', component: OrderDetails }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OrdersModule { }
