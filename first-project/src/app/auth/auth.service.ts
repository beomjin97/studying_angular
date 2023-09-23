import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';

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
  user = new Subject<User>();

  constructor(private http: HttpClient) {}

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

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>('http://localhost:8080/auth.signin', {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(catchError(this.handleError));
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
