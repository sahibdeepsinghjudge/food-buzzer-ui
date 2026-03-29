import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl } from './constants';

export interface TableData{
  id: number;
  restaurantId: number;
  tableNo: number;
  tableSize: number;
  floor: number;
  isOccupied: boolean;
  isDelete: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Tableservice {

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



  getTableStatus(): Observable<any> 
  {
    let url = baseUrl + '/restaurant-tables/active';

    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      map(res => { console.log(res); return res.data || res; })
    );
  }

  getTablesBySlug(slug: string): Observable<TableData[]> {
    let headers = new HttpHeaders().append('ngrok-skip-browser-warning', 'true');
    return this.http.get<any>(baseUrl + '/restaurant-tables/active', {
      headers,
      params: { restaurantSlug: slug }
    }).pipe(
      map(res => res.data || res || [])
    );
  }

  createTable(tableNo: number): Observable<any> {
    const payload = { tableNo: tableNo, tableSize: 1, floor: 1 };
    return this.http.post<any>(baseUrl + '/restaurant-tables/create', payload, { headers: this.getHeaders() }).pipe(
      map(res => res.data || res)
    );
  }

}
