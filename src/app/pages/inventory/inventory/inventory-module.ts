import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InventoryDashboard } from '../inventory-dashboard/inventory-dashboard';
import { CreateProducts } from '../create-products/create-products';
import { ViewProduct } from '../view-product/view-product';


const routes: Routes = [
  { path: '', component: InventoryDashboard },
  { path: 'create-products', component: CreateProducts },
  { path: 'product/:id', component: ViewProduct }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class InventoryModule { }
