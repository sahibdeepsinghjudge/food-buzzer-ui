import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl } from './constants';

export interface CartItemDTO {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  restaurantId?: number;
  tableId?: string;
  userId?: number;
  cartItems: CartItemDTO[];
  overrideDiscount?: number;
}

export interface OrderResponse {
  orderId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  restaurantId: number;
  tableId: string;
  status: string;
  cartItems: CartItemDTO[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const userId = localStorage.getItem("userId");
    if (userId) {
      headers = headers.append("userId", userId);
      headers = headers.append('ngrok-skip-browser-warning', 'true');
    }
    return headers;
  }

  // GET /api/orders/restaurant/orders?statuses=...
  getRestaurantOrders(statuses?: string[]): Observable<any[]> {
    let params = new HttpParams();
    if (statuses && statuses.length > 0) {
      statuses.forEach(s => {
        params = params.append('statuses', s);
      });
    }
    return this.http.get<any>(baseUrl + '/orders/restaurant/orders', {
      headers: this.getHeaders(),
      params
    }).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      })
    );
  }

  // POST /api/orders/create
  createOrder(payload: OrderRequest): Observable<any> {
    return this.http.post<any>(baseUrl + '/orders/create', payload, {
      headers: this.getHeaders()
    }).pipe(
      map(res => res.data || res)
    );
  }

  // PUT /api/orders/{orderId}/status?status=...
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put<any>(baseUrl + `/orders/${orderId}/status`, null, {
      headers: this.getHeaders(),
      params
    }).pipe(
      map(res => res.data || res)
    );
  }
}
