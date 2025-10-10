import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

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
  
  getToken(){
    return localStorage.getItem('token');
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

  signOut(){
    // localStorage.removeItem('token');
    localStorage.clear();
  }
}
