import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
constructor(private auth:AuthService,private router:Router,private toastr:ToastrService){

}

  canActivate():boolean {
    if(this.auth.isLoggedIn()){      
      return true;
    }
    else{
         
         this.router.navigate(['login']);
        this.toastr.error("Access Denied, Please Login First","Error");
        return false;
    } 
  }
  
}
