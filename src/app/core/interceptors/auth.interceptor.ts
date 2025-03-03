import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function authInterceptorFn(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwt');
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
    }
    return next(req);
  }