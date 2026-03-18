import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { baseUrl } from './constants';

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

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const userId = localStorage.getItem("userId");
    if (userId) {
      headers = headers.append("X-User-Id", userId);
      headers = headers.append('ngrok-skip-browser-warning', 'true');
    }
    return headers;
  }

  private mapToFrontendRecipe(backendRecipe: any): Recipe {
    return {
      id: backendRecipe.id || backendRecipe.recipeId || backendRecipe.recipe_id, // Safely fallback to any ID keys
      name: backendRecipe.name,
      description: backendRecipe.description,
      ingredients: (backendRecipe.items || []).map((item: any) => ({
        materialId: item.rawMaterialId,
        portionSize: item.quantity
      })),
      createdAt: backendRecipe.createdAt || new Date().toISOString()
    };
  }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<{data: any[]}>(baseUrl + '/recipes', { headers: this.getHeaders() }).pipe(
      map(res => (res.data || []).map(r => this.mapToFrontendRecipe(r)))
    );
  }

  getRecipeById(id: number): Observable<Recipe | undefined> {
    return this.http.get<{data: any}>(baseUrl + `/recipes/${id}`, { headers: this.getHeaders() }).pipe(
      map(res => res.data ? this.mapToFrontendRecipe(res.data) : undefined)
    );
  }

  addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Observable<Recipe> {
    const payload = {
      name: recipe.name,
      description: recipe.description,
      items: recipe.ingredients.map(ing => ({
        rawMaterialId: ing.materialId,
        quantity: ing.portionSize
      }))
    };
    return this.http.post<{data: any}>(baseUrl + '/recipes', payload, { headers: this.getHeaders() }).pipe(
      map(res => this.mapToFrontendRecipe(res.data || {}))
    );
  }

  // Stubs for currently undocumented endpoints if the app still tries to call them
  updateRecipe(id: number, updatedData: Partial<Recipe>): Observable<Recipe> {
    const payload = {
      name: updatedData.name,
      description: updatedData.description,
      items: (updatedData.ingredients || []).map(ing => ({
        rawMaterialId: ing.materialId,
        quantity: ing.portionSize
      }))
    };
    return this.http.put<{data: any}>(baseUrl + `/recipes/${id}`, payload, { headers: this.getHeaders() }).pipe(
      map(res => this.mapToFrontendRecipe(res.data || {}))
    );
  }

  deleteRecipe(id: number): Observable<boolean> {
    return of(true).pipe(delay(400));
  }
}
