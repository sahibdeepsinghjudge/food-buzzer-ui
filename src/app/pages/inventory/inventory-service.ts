import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DataTile } from '../../ui/data-tiles/data-tiles';
import { baseUrl } from '../../services/constants';

export interface RawMaterial {
  id: number;
  restaurantId: number;
  name: string;
  sku?: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderLevel?: number;
  costPerUnit?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

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

  getRawMaterials(): Observable<RawMaterial[]> {
    return this.http.get<{data: RawMaterial[]}>(baseUrl + '/inventory/all', { "headers": this.getHeaders() })
      .pipe(map(res => res.data || []));
  }

  getInventoryStats(): Observable<DataTile[]> {
    return this.getRawMaterials().pipe(
      map(materials => {
        const total = materials.length;
        const outOfStock = materials.filter(m => m.currentStock === 0).length;
        const lowStock = materials.filter(
          m => m.reorderLevel !== null && m.reorderLevel !== undefined && m.currentStock > 0 && m.currentStock <= m.reorderLevel
        ).length;
        const active = materials.filter(m => m.isActive).length;

        return [{
          label: 'Total Products',
          number: total.toString(),
          comparison_number_percentage: null,
          comparison_parameter: null
        }, {
          label: 'Active Products',
          number: active.toString(),
          comparison_number_percentage: null,
          comparison_parameter: null
        }, {
          label: 'Low Stock Products',
          number: lowStock.toString(),
          comparison_number_percentage: null,
          comparison_parameter: null
        }, {
          label: 'Out of Stock Products',
          number: outOfStock.toString(),
          comparison_number_percentage: null,
          comparison_parameter: null
        }];
      })
    );
  }

  getFilteredMaterials(f: string): Observable<RawMaterial[]> { 
    switch (f) { 
      case "low_on_stock":
          return this.http.get<{data: RawMaterial[]}>(baseUrl + '/inventory/low-stock', { "headers": this.getHeaders() })
            .pipe(map(res => res.data || []));
      case "out_of_stock":
          return this.getRawMaterials().pipe(map(p => p.filter(m => m.currentStock === 0)));
      case "active":
          return this.getRawMaterials().pipe(map(p => p.filter(m => m.isActive)));
      case "inactive":
          return this.getRawMaterials().pipe(map(p => p.filter(m => !m.isActive)));
      default:
        return this.getRawMaterials();
    }
  }

  getMaterialById(id: number): Observable<RawMaterial | undefined> {
    return this.getRawMaterials().pipe(
      map(items => items.find(i => i.id === id))
    );
  }

  addMaterial(data: Partial<RawMaterial>): Observable<any> {
    return this.http.post(baseUrl + '/inventory/add', data, { "headers": this.getHeaders() });
  }

  updateStock(id: number, data: Partial<RawMaterial>): Observable<any> {
    return this.http.put(baseUrl + `/inventory/update-stock/${id}`, data, { "headers": this.getHeaders() });
  }

  deleteMaterial(id: number): Observable<any> {
    return this.http.delete(baseUrl + `/inventory/delete/${id}`, { "headers": this.getHeaders() });
  }

  searchMaterials(name: string): Observable<RawMaterial[]> {
    return this.http.get<{data: RawMaterial[]}>(baseUrl + `/inventory/search?name=${encodeURIComponent(name)}`, { "headers": this.getHeaders() })
      .pipe(map(res => res.data || []));
  }
}