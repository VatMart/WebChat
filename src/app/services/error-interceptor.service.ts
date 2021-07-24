import {Injectable} from '@angular/core';
import {TokenStorageService} from "./token-storage.service";
import {NotificationService} from "./notification.service";
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private router: Router,
              private tokenService: TokenStorageService,
              private notificationService: NotificationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(err => {
      if (err.status === 401) {
        this.tokenService.logOut();
        this.router.navigate(['/signin']);
        //window.location.reload();
      }

      const error = err.error.message || err.statusText;
      this.notificationService.showSnackBar(error);
      return throwError(error);
    }));
  }
}

export const authErrorInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true}
];

