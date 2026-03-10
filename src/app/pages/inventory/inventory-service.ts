import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { DataTile } from '../../ui/data-tiles/data-tiles';

export interface RawMaterial {
  id: number
  restaurant_id: number
  name: string
  sku?: string
  category: string
  unit: string
  current_stock: number
  reorder_level?: number
  cost_per_unit?: number
  is_active: boolean
  created_at: string
  updated_at: string
}


@Injectable({
  providedIn: 'root'
})
export class InventoryService {


  private dataUrl = '/src/app/pages/inventory/assets/data/raw-materials.json'


  constructor(private http: HttpClient) {}

  getRawMaterials(): Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>(this.dataUrl)
  }

  getInventoryStats(): Observable<DataTile[]> {
    // pipe() here will allow us to use the map function which will help in transforming the data to a usable data meaning the business logic is present here only and not in the component.
    // also the get will return an observable and not the data directly.
    // pipe is used to chain observables together.
    return this.getRawMaterials().pipe(
      map(materials => {
        const total = materials.length
        const outOfStock = materials.filter(
          m => m.current_stock === 0
        ).length

        const lowStock = materials.filter(
          m =>
            m.reorder_level !== null &&
            m.current_stock > 0 &&
            m.current_stock <= (m.reorder_level ?? 0)
        ).length

        const active = materials.filter(
          m => m.is_active
        ).length

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
        }]
      })
    )
  }

  getFilteredMaterials(f:string) { 
    switch (f) { 
      case "low_on_stock":
          return this.getRawMaterials().pipe(map(p=> p.filter(m =>
            m.reorder_level !== null &&
            m.current_stock > 0 &&
            m.current_stock <= (m.reorder_level ?? 0)
          )))
      case "out_of_stock":
          return this.getRawMaterials().pipe(map(p=> p.filter(m =>
            m.current_stock === 0
          )))
      case "active":
          return this.getRawMaterials().pipe(map(p=> p.filter(m =>
            m.is_active
          )))
      case "inactive":
          return this.getRawMaterials().pipe(map(p=> p.filter(m =>
            !m.is_active
          )))
      default:
        return this.getRawMaterials()
    }
  }

  getMaterialById(id: number) {
    return this.getRawMaterials().pipe(
      map(items => items.find(i => i.id === id))
    )
  }

}