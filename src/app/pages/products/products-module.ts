import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductsDashboard } from './products-dashboard/products-dashboard';
import { CreateProduct } from './create-product/create-product';


const routes: Routes = [
  { path: '', component: ProductsDashboard },
  { path: 'create-product', component: CreateProduct },
  { path: 'edit-product/:id', component: CreateProduct }
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
export class ProductsModule { }
