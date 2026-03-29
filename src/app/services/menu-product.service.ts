import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl } from './constants';

export interface ProductRecipe {
  recipeId: number;
  qty: number;
}

export interface MenuProduct {
  id: number;
  name: string;
  sku?: string;
  category?: string;
  price: number;
  qty: number;
  isVeg: boolean;
  isBestSeller: boolean;
  isLive?: boolean;
  recipes: ProductRecipe[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuProductService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const userId = localStorage.getItem("userId");
    if (userId) {
      headers = headers.append("X-User-Id", userId);
    }
    headers = headers.append('ngrok-skip-browser-warning', 'true');
    return headers;
  }

  // Maps backend ApiResponse to frontend MenuProduct
  private mapToFrontendProduct(dto: any): MenuProduct {
    return {
      id: dto.id || dto.productId || 0,
      name: dto.name || '',
      sku: dto.sku || '',
      category: dto.category || '',
      price: dto.price || 0,
      qty: dto.qty || 1,
      isVeg: dto.isVeg,
      isBestSeller: dto.isBestSeller,
      isLive:dto.isLive,
      recipes: (dto.recipes || []).map((r: any) => ({
        recipeId: r.recipeId,
        qty: r.quantity || r.qty || 1
      })),
      createdAt: dto.createdAt || new Date().toISOString()
    };
  }

  getProducts(): Observable<MenuProduct[]> {
    return this.http.get<any>(baseUrl + '/products', { headers: this.getHeaders() }).pipe(
      map(res => {
        const list = res.data || res || [];
        return (Array.isArray(list) ? list : []).map(p => this.mapToFrontendProduct(p));
      })
    );
  }

  getProductById(id: number): Observable<MenuProduct | undefined> {
    return this.http.get<any>(baseUrl + `/products/${id}`, { headers: this.getHeaders() }).pipe(
      map(res => this.mapToFrontendProduct(res.data || res))
    );
  }

  getPublicMenuByRestaurantSlug(slug: string): Observable<{ products: MenuProduct[], restaurant: any }> {
    return this.http.get<any>(baseUrl + `/products/public/restaurants/${slug}/menu`, { headers: this.getHeaders() }).pipe(
      map(res => {
        const payload = res.data || {};
        const productList = payload.products || [];
        return {
          products: (Array.isArray(productList) ? productList : []).map((p: any) => this.mapToFrontendProduct(p)),
          restaurant: payload.restaurant || null
        };
      })
    );
  }

  addProduct(productPayload: any): Observable<MenuProduct> {
    // Expects productPayload to be properly formatted ProductRequestDTO from the component
    return this.http.post<any>(baseUrl + '/products', productPayload, { headers: this.getHeaders() }).pipe(
      map(res => this.mapToFrontendProduct(res.data || res))
    );
  }

  updateProduct(id: number, productPayload: any): Observable<MenuProduct> {
    console.log(productPayload)
    return this.http.put<any>(baseUrl + `/products/${id}`, productPayload, { headers: this.getHeaders() }).pipe(
      map(res => this.mapToFrontendProduct(res.data || res))
    );
  }

  deleteProduct(id: number): Observable<boolean> {
    // API docs don't have delete product yet? We'll make standard DELETE call just in case
    return this.http.delete<any>(baseUrl + `/products/${id}`, { headers: this.getHeaders() }).pipe(
      map(() => true)
    );
  }
}
