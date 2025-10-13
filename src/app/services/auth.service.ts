import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl:string ="https://localhost:7059/api/User/";
  private payload:any;
  constructor(private http:HttpClient) {
    this.payload = this.decodedToken();
    console.log(this.payload);
   }

  signup(userObj:any){
    return this.http.post<any>(`${this.baseUrl}register`,userObj);
  }

  login(loginObj:any){
    return this.http.post<any>(`${this.baseUrl}authenticate`,loginObj);
  }

 
  storeToken(tokenValue:string){
    localStorage.setItem('token',tokenValue);
  }

  storeRefreshToken(refreshtokenValue:string){
    localStorage.setItem('refreshToken',refreshtokenValue);
  }
  
  getToken(){
    return localStorage.getItem('token');
  }
   getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token');
  }

  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken() || '';
    console.log("Decoded Token: ",jwtHelper.decodeToken(token))
    return jwtHelper.decodeToken(token);
  }
  
  getFullNameFromToken(){
    if(this.payload)
      return this.payload.unique_name;
  }

  getRoleFromToken(){
    if(this.payload)
      return this.payload.role;
  }

  renewToken(tokenApi : TokenApiModel){
    return this.http.post<any>(`${this.baseUrl}refresh`,tokenApi)
  }

  signOut(){
    // localStorage.removeItem('token');
    localStorage.clear();
  }
}
