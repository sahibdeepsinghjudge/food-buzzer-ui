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
      headers = headers.append('ngrok-skip-browser-warning', 'true');
    }
    return headers;
  }

  getTableStatus(): Observable<any> 
  {
    let url = baseUrl + '/restaurant-tables/active';

    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      map(res => res.data || res)
    );
  }

}
