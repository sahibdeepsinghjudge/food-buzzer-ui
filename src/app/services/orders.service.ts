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
  id: number; // mapped from orderId for frontend consistency
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
      headers = headers.append("X-User-Id", userId);
      headers = headers.append('ngrok-skip-browser-warning', 'true');
    }
    return headers;
  }

  // Helper to map backend order to frontend model (parses cartItems if it's a string)
  private mapOrder(order: any): OrderResponse {
    let parsedCartItems = order.cartItems;
    if (typeof order.cartItems === 'string') {
      try {
        parsedCartItems = JSON.parse(order.cartItems);
      } catch (e) {
        console.error('Failed to parse cartItems:', order.cartItems);
        parsedCartItems = [];
      }
    }
    return {
      ...order,
      id: order.id || order.orderId, // ensure 'id' field is always present for frontend
      cartItems: parsedCartItems
    };
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
        console.log(res);
        const data = res.data || res;
        const ordersArray = Array.isArray(data) ? data : [];
        return ordersArray.map(o => this.mapOrder(o));
      })
    );
  }

  // Helper method to fetch a single order (currently API only has fetch all, so we filter)
  getOrderById(orderId: number): Observable<OrderResponse | undefined> {
    return this.getRestaurantOrders().pipe(
      map(orders => orders.find(o => Number(o.id) === orderId || Number(o.orderId) === orderId))
    );
  }

  // POST /api/orders/create
  createOrder(payload: OrderRequest): Observable<OrderResponse> {
    return this.http.post<any>(baseUrl + '/orders/create', payload, {
      headers: this.getHeaders()
    }).pipe(
      map(res => this.mapOrder(res.data || res))
    );
  }

  // PUT /api/orders/{orderId}/status?status=...
  updateOrderStatus(orderId: number, status: string): Observable<OrderResponse> {
    const params = new HttpParams().set('status', status);
    return this.http.put<any>(baseUrl + `/orders/${orderId}/status`, null, {
      headers: this.getHeaders(),
      params
    }).pipe(
      map(res => this.mapOrder(res.data || res))
    );
  }
}
