import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, throwError, switchMap} from 'rxjs';

import {AuthService} from "./services";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Injectable()
export class MainInterceptor implements HttpInterceptor {

  isRefreshing = false

  constructor(private authService :AuthService, private matDialog : MatDialog, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    const accessToken = this.authService.getAccessToken();

    if(accessToken){
      request = this.addToken(request, accessToken)
    }

    return next.handle(request).pipe(
      catchError((res:HttpErrorResponse)=>{
        if(res && res.error && res.status === 401){
          return this.handle401Error(request, next)
        }
        return throwError(()=> res)
      })
    );
  }

  addToken(request: HttpRequest<unknown>, token:string):HttpRequest<any>{
    return request.clone({
      setHeaders:{Authorization: `Bearer ${token}`}
    })
  }

  handle401Error(request: HttpRequest<unknown>, next: HttpHandler):any{
    const refreshToken = this.authService.getRefreshToken()

    if(refreshToken && !this.isRefreshing){
      this.isRefreshing = true
      return this.authService.refresh(refreshToken).pipe(
        switchMap((token)=>{
          this.isRefreshing = false
          return next.handle(this.addToken(request, token.access))
        }),
        catchError(() => {
          this.isRefreshing = false
          this.authService.deleteToken()
          this.matDialog.closeAll()
          this.router.navigate(['auth', 'login'])
          return throwError(()=> new Error('Token invalid or expired'))
        })
      )
    }
  }

}

