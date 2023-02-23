import { UtilService } from './../services/util.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class KeycloackInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private utils: UtilService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = localStorage.getItem('keycloak_token');

    if (token) {
        request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token.replace('"','')}`
            }
        });
    }

    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        console.log('Token vencido. Redireccionando a login');
        this.utils.notification('Token vencido. Redireccionando a login', 'warning');
        setTimeout(() => {
          localStorage.clear();
          this.router.navigate(['/login']);
        }, 500);
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}
