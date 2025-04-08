import { Injectable } from '@angular/core';
import {
  confirmResetPassword,
  confirmSignUp,
  ConfirmSignUpOutput,
  fetchAuthSession,
  fetchUserAttributes,
  FetchUserAttributesOutput,
  resetPassword,
  ResetPasswordOutput,
  signIn,
  SignInOutput,
  signOut,
  signUp,
  SignUpOutput,
} from 'aws-amplify/auth';
import { BehaviorSubject, catchError, from, Observable, of, tap } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isSessionChecked = new BehaviorSubject<boolean>(false);

  public isSessionChecked$ = this.isSessionChecked.asObservable();

  private isUserLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.checkSession();
  }

  signUp(user: User): Observable<SignUpOutput> {
    return from(
      signUp({
        username: user.email,
        password: user.password,
        options: {
          userAttributes: {
            email: user.email,
            name: user.name,
          },
        },
      })
    );
  }

  confirmSignUp(email: string, code: string): Observable<ConfirmSignUpOutput> {
    return from(
      confirmSignUp({
        username: email,
        confirmationCode: code,
      })
    );
  }

  signIn(email: string, password: string): Observable<SignInOutput> {
    return from(
      signIn({
        username: email,
        password: password,
      })
    ).pipe(tap(() => this.isUserLoggedIn$.next(true)));
  }

  signOut(): Observable<void> {
    return from(signOut()).pipe(tap(() => this.isUserLoggedIn$.next(false)));
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.isUserLoggedIn$.asObservable();
  }

  checkSession(): void {
    from(fetchAuthSession())
      .pipe(catchError(() => of(null)))
      .subscribe((session) => {
        this.isUserLoggedIn$.next(!!session?.tokens);
        this.isSessionChecked.next(true);
      });
  }

  getCurrentUser(): Observable<FetchUserAttributesOutput> {
    return from(fetchUserAttributes());
  }

  resetPassword(email: string): Observable<ResetPasswordOutput> {
    return from(
      resetPassword({
        username: email,
      })
    );
  }

  confirmResetPassword(user: User): Observable<void> {
    return from(
      confirmResetPassword({
        username: user.email,
        confirmationCode: user.code!,
        newPassword: user.password,
      })
    );
  }
}
