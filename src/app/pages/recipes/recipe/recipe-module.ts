import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RecipeDashboard } from '../recipe-dashboard/recipe-dashboard';
import { CreateRecipe } from '../create-recipe/create-recipe';
import { ViewRecipe } from '../view-recipe/view-recipe';


const routes: Routes = [
  { path: '', component: RecipeDashboard },
  { path: 'create-recipe', component: CreateRecipe },
  { path: 'recipe/:id', component: ViewRecipe }
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
export class RecipeModule { }
