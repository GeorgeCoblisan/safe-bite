import { HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { fetchAuthSession } from 'aws-amplify/auth';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req,
  next: HttpHandlerFn
) => {
  return from(fetchAuthSession()).pipe(
    switchMap((session) => {
      const token = session.tokens?.accessToken?.toString();

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authReq);
    })
  );
};
