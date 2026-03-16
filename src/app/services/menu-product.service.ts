import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ProductRecipe {
  recipeId: number;
  qty: number;
}

export interface MenuProduct {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  qty: number;
  isVeg: boolean;
  isBestseller: boolean;
  recipes: ProductRecipe[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuProductService {
  private products: MenuProduct[] = [
    {
      id: 1,
      name: 'Paneer Butter Masala Combo',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 299,
      qty: 1,
      isVeg: true,
      isBestseller: true,
      recipes: [{ recipeId: 1, qty: 1 }],
      createdAt: new Date().toISOString()
    }
  ];

  constructor() {}

  getProducts(): Observable<MenuProduct[]> {
    return of([...this.products]).pipe(delay(300));
  }

  getProductById(id: number): Observable<MenuProduct | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product ? { ...product } : undefined).pipe(delay(200));
  }

  addProduct(product: Omit<MenuProduct, 'id' | 'createdAt'>): Observable<MenuProduct> {
    const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    const newProduct: MenuProduct = { 
      ...product, 
      id: newId,
      createdAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    return of({ ...newProduct }).pipe(delay(400));
  }

  updateProduct(id: number, updatedData: Partial<MenuProduct>): Observable<MenuProduct> {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedData };
      return of({ ...this.products[index] }).pipe(delay(400));
    }
    throw new Error('Menu Product not found');
  }

  deleteProduct(id: number): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      return of(true).pipe(delay(400));
    }
    return of(false).pipe(delay(400));
  }
}
