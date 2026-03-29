import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl } from './constants';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  emailId: string | null;
  loyaltyPoints: number;
  restaurantId: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const userId = localStorage.getItem('userId');
    if (userId) {
      headers = headers.append('X-User-Id', userId);
    }
    headers = headers.append('ngrok-skip-browser-warning', 'true');
    return headers;
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<any>(baseUrl + '/customers', { headers: this.getHeaders() }).pipe(
      map(res => {
        const list = res.data || res || [];
        return Array.isArray(list) ? list : [];
      })
    );
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<any>(baseUrl + '/customers', {
      headers: this.getHeaders(),
      params: { id }
    }).pipe(
      map(res => res.data || res)
    );
  }
}
