import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface RecipeIngredient {
  materialId: number;
  portionSize: number;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipes: Recipe[] = [
    {
      id: 1,
      name: 'Paneer Butter Masala',
      description: 'A rich and creamy curry made with paneer, spices, onions, tomatoes, cashews and butter.',
      ingredients: [
        { materialId: 1, portionSize: 200 } // Example stub
      ],
      createdAt: new Date().toISOString()
    }
  ];

  constructor() {}

  getRecipes(): Observable<Recipe[]> {
    return of([...this.recipes]).pipe(delay(300));
  }

  getRecipeById(id: number): Observable<Recipe | undefined> {
    const recipe = this.recipes.find(r => r.id === id);
    return of(recipe ? { ...recipe } : undefined).pipe(delay(200));
  }

  addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Observable<Recipe> {
    const newId = this.recipes.length > 0 ? Math.max(...this.recipes.map(r => r.id)) + 1 : 1;
    const newRecipe: Recipe = { 
      ...recipe, 
      id: newId,
      createdAt: new Date().toISOString()
    };
    this.recipes.unshift(newRecipe);
    return of({ ...newRecipe }).pipe(delay(400));
  }

  updateRecipe(id: number, updatedData: Partial<Recipe>): Observable<Recipe> {
    const index = this.recipes.findIndex(r => r.id === id);
    if (index !== -1) {
      this.recipes[index] = { ...this.recipes[index], ...updatedData };
      return of({ ...this.recipes[index] }).pipe(delay(400));
    }
    throw new Error('Recipe not found');
  }

  deleteRecipe(id: number): Observable<boolean> {
    const index = this.recipes.findIndex(r => r.id === id);
    if (index !== -1) {
      this.recipes.splice(index, 1);
      return of(true).pipe(delay(400));
    }
    return of(false).pipe(delay(400));
  }
}
