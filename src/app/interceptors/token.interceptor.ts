import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { catchError, switchMap } from 'rxjs/operators';
import { TokenApiModel } from '../models/token-api.model';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth:AuthService,private toastr:ToastrService,private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();
    if(myToken){
      request = request.clone({
        setHeaders : {Authorization : `Bearer ${myToken}`}
      })
    }
    
    return next.handle(request).pipe(
      catchError((err:any)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            // this.toastr.warning("Youe session has expired. Please Login again.","Warnign");
            // this.router.navigate(['login']);
            return this.handleUnAuthorizedError(request,next);
          }
        }
        return throwError(()=>err)
      })
    );
  }

  handleUnAuthorizedError(req:HttpRequest<any>,next:HttpHandler){
    // alert("handleUnAuthorizedError");
    let tokenApiModel = new TokenApiModel();
    tokenApiModel.accessToken = this.auth.getToken()!;
    // console.log("Access Token: ",tokenApiModel.accessToken);
    tokenApiModel.refreshToken = this.auth.getRefreshToken()!;
    // console.log("Refresh Token: ",tokenApiModel.refreshToken);
    return this.auth.renewToken(tokenApiModel)
    .pipe(
      switchMap((data:TokenApiModel)=>{
        // alert("Token renowed");
        this.auth.storeRefreshToken(data.refreshToken);
        this.auth.storeToken(data.accessToken);
        req = req.clone({
          setHeaders: {Authorization : `Bearer ${data.accessToken}`}
        })
        return next.handle(req);
      }),
      catchError((err)=>{
        return throwError(()=>{
          this.toastr.warning("Youe session has expired. Please Login again.","Warning");
            this.router.navigate(['login']);
        })
      })
    )
  }
}
