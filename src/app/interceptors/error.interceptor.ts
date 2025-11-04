import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private alert: AlertService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: any) => {
        let message = 'Unexpected error occurred';

        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            message = 'Network error: Please check your internet connection';
          } else {
            const serverMessage = (error.error && (error.error.message || error.error.detail || error.error.error_description))
              || error.message
              || `HTTP ${error.status} ${error.statusText}`;
            message = serverMessage;
          }
        } else if (error && error.message) {
          message = error.message;
        }

        this.alert.error(message, 'Error');
        return throwError(() => error);
      })
    );
  }
}