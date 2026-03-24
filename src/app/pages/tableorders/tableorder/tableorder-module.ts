import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Tabledetail } from './tabledetail/tabledetail';

const routes : Routes = [
  {
    path: '' , component: Tabledetail
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
      RouterModule.forChild(routes)
  ]
})
export class TableorderModule { }
