import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { KdsFilteredOrders } from '../kds-filtered-orders/kds-filtered-orders';
import { KdsOrderDetail } from '../kds-order-detail/kds-order-detail';

const routes: Routes = [
  { path: '',        component: KdsFilteredOrders, data: { filter: 'view-all' } },
  { path: 'view-all',        component: KdsFilteredOrders, data: { filter: 'view-all' } },
  { path: 'pending-orders',  component: KdsFilteredOrders, data: { filter: 'pending-orders' } },
  { path: 'accepted',        component: KdsFilteredOrders, data: { filter: 'accepted' } },
  { path: 'declined',        component: KdsFilteredOrders, data: { filter: 'declined' } },
  { path: 'cooking',         component: KdsFilteredOrders, data: { filter: 'cooking' } },
  { path: 'ready',           component: KdsFilteredOrders, data: { filter: 'ready' } },
  { path: 'completed',       component: KdsFilteredOrders, data: { filter: 'completed' } },
  { path: 'order/:id',       component: KdsOrderDetail },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class KdsModule { }
