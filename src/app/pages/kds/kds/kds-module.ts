import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { Allorders } from '../allorders/allorders';
import { Pendingorders } from '../pendingorders/pendingorders';
import { Accepted } from '../accepted/accepted';
import { Declined } from '../declined/declined';
import { Cooking } from '../cooking/cooking';
import { Ready } from '../ready/ready';
import { Completed } from '../completed/completed';

const routes : Routes = [
  { path: '', component: Kdsscreen},
  { path: 'view-all', component: Allorders},
  { path: 'pending-orders', component: Pendingorders},
  { path: 'accepted', component: Accepted},
  { path: 'declined', component: Declined},
  { path: 'cooking', component: Cooking},
  { path: 'ready', component: Ready},
  { path: 'completed', component: Completed},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class KdsModule { }
