import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Owner } from './pages/interface/owner';
import { Restaurant } from './pages/interface/restaurant';
import { Observable } from 'rxjs';
import { ApiResponse } from './pages/interface/apiresponse';

@Injectable({
  providedIn: 'root',
})
export class Dataservice {
  private url="assets/demodata.json";
  constructor(private http: HttpClient){}
  getData(): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.url);
  }
  updateRestaurantStatus(id: number, status: string) {
  //return this.http.put(`http://localhost:8080/restaurants/${id}/status`, { status });
}
}
