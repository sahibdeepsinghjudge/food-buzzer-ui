import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./teams-main').then(m => m.TeamsMain)
  },
  {
    path: ':id',
    loadComponent: () => import('../team-member-details/team-member-details').then(m => m.TeamMemberDetails)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsModule { }
