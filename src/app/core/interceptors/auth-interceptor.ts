import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authservice = inject(AuthService)
  if(authservice.isLoggedIn()){
    req = req.clone({
      setHeaders: {
        Authorization: "Bearer " + authservice.getToken()
      }
    })
  }
  return next(req);
};
