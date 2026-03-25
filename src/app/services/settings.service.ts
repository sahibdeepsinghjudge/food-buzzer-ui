import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from './constants';

export interface RestaurantData{
  restaurantId: number;
  name: string;
  location: string;
  phone: string;
  zipcode: string;
  ownerName: string;
  ownerId: number;
  email: string;
  ownerEmail: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})


export class SettingsService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const userID = localStorage.getItem("userId");
    if(userID){
      headers = headers.append("X-User-Id", userID);
      headers = headers.append('ngrok-skip-browser-warning', 'true');
    }
    return headers;
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/auth/me`, { headers: this.getHeaders() });
  }

  getRestaurantInfo(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/restaurants/me`, { headers: this.getHeaders() });
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${baseUrl}/auth/update-password`, {
      oldPassword,
      newPassword
    }, { headers: this.getHeaders() });
  }

  updateRestaurantInfo(data: any): Observable<any> {
    return this.http.put<any>(`${baseUrl}/restaurants/update`, data, { headers: this.getHeaders() });
  }
}
