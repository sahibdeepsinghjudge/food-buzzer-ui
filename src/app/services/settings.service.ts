import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RestaurantData{
  restaurantId: number;
  name: string;
  location: string;
  phone: string;
  zipcode: string;
  ownerName: string;
  ownerId: number;
  email: string;
  cisine: string;
  openingTime: Date;
  closingTime: Date;
}

@Injectable({
  providedIn: 'root',
})


export class SettingsService {
  constructor(private http: HttpClient) {}
  getData(id: number): Observable<any>{
    let url="assets/demodata.json";
    return this.http.get<any>(url);
  }
}
