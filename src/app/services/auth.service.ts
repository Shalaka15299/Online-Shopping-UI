import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl:string ="https://localhost:7059/api/User/";
  constructor(private http:HttpClient) { }

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

  signOut(){
    // localStorage.removeItem('token');
    localStorage.clear();
  }
}
