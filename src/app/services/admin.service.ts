import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl } from './constants';

export interface AdminApprovalRequest {
  restaurantId: number;
  isApproved: boolean;
  approvalNotes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
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

  // GET /api/admin/requests?status={status}
  getRequestsByStatus(status?: string): Observable<any> {
    let url = baseUrl + '/admin/requests';
    if (status) {
      url += `?status=${status}`;
    }
    
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      map(res => res.data || res)
    );
  }

  // GET /api/admin/restaurants/by-user/{userId}
  getRestaurantByUserId(userId: number): Observable<any> {
    return this.http.get<any>(baseUrl + `/admin/restaurants/by-user/${userId}`, { headers: this.getHeaders() }).pipe(
      map(res => res.data || res)
    );
  }

  // POST /api/admin/restaurants/approval
  updateApproval(payload: AdminApprovalRequest): Observable<any> {
    return this.http.post<any>(baseUrl + '/admin/restaurants/approval', payload, { headers: this.getHeaders() }).pipe(
      map(res => res.data || res)
    );
  }
}
