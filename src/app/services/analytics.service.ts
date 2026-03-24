import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl } from './constants';

export interface MonthlyAnalyticsResponse {
  year: number;
  month: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface HourlyOrderCountDTO {
  hour: number;
  orderCount: number;
}

export interface TopSellingItemDTO {
  productId: number;
  itemName: string;
  quantitySold: number;
  revenue: number;
}

export interface DailyAnalyticsResponse {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  topSellingItems: TopSellingItemDTO[];
  hourlyOrders: HourlyOrderCountDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
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

  getCurrentMonthAnalytics(): Observable<MonthlyAnalyticsResponse> {
    return this.http.get<any>(baseUrl + '/analytics/monthly/current', {
      headers: this.getHeaders()
    }).pipe(
      map(res => res.data || res)
    );
  }

  getDailyAnalytics(date: string): Observable<DailyAnalyticsResponse> {
    let params = new HttpParams().set('date', date);
    return this.http.get<any>(baseUrl + '/analytics/daily', {
      headers: this.getHeaders(),
      params
    }).pipe(
      map(res => res.data || res)
    );
  }
}
