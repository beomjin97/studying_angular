import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expriesIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponse>('http://localhost:8080/auth/signup', {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(
            res.email,
            res.localId,
            res.idToken,
            +res.expriesIn
          );
        })
      );
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      userData._tokenExirationDate
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>('http://localhost:8080/auth.signin', {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(catchError(this.handleError));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expriesIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expriesIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expriesIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errMessage = 'An unknown error occurred!';
    if (errorRes.error || !errorRes.error.errer) {
      return throwError(() => errMessage);
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errMessage = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errMessage = 'This password is not correct';
        break;
    }
    return throwError(() => errMessage);
  }
}
