import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from './constants';

export interface LoginResponse {
  userId: string,
  role: string,
  accessLevel: number,
  message: string
}

export interface RegisterResponse {
  restaurantId: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private router: Router, private http: HttpClient) { }

  login(email: string, password: string): Observable<LoginResponse> {

    // Mock API call for login
    const resp = this.http.post<LoginResponse>(baseUrl + "/auth/login", {
      "email": email,
      "password": password
    })

    if (resp) {
      return resp;
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
    }
  }


  registerStepData1(data: {
    name: string,
    email: string,
    password: string
  }): Observable<LoginResponse> {
    const resp = this.http.post<LoginResponse>(baseUrl + "/auth/register-owner", {
      "fullName": data.name,
      "email": data.email,
      "password": data.password
    })
    if (resp) {
      return resp;
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
    }
  }

  registerStepData2(data: {
    rest_name: string;
    rest_address: string;
    gst_number: string;
    phone: string;
    zip_code: string;
  }): Observable<RegisterResponse> {
    let headers = new HttpHeaders();
    const userID = localStorage.getItem("userId")
    if(userID){
      headers=headers.append(
      "X-User-Id",userID
    )
    }
    
    const resp = this.http.post<RegisterResponse>(baseUrl + "/restaurants/create-restaurant",{
      "name": data.rest_name,
      "address": data.rest_address,
      "zipcode": data.zip_code,
      "phone": data.phone,
      "GST": data.gst_number
    },{
       "headers":headers,
    })
    if (resp) {
      return resp;
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
    }
  }




  isAuthenticated(): boolean {
    let userid = localStorage.getItem("userId");
    if(userid){
      if(userid==="null"){
        return false;
      }else{
        return true;
      }
    }else{
      return false;
    }
  }

  isAdmin(): boolean {
    return localStorage.getItem("role")?.toLowerCase() === "admin";
  }
  accessLevel():number{
    return parseInt(localStorage.getItem("access_level") || '0');
  }
  getUserEmail(): string {
    return localStorage.getItem("userEmail") || '';
  }
  getRole(): string {
    return localStorage.getItem("role") || '';
  }
  isOwner(): boolean {
    return localStorage.getItem("role")?.toLowerCase() === "owner";
  }
  logout(): void {
    localStorage.removeItem("userId");
    localStorage.removeItem("access_level");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");

    this.router.navigate(['/accounts/login']);
  }
}
