import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expriesIn: string;
  localId: string;
}

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponse>('http://localhost:8080/auth/signup', {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((error) => {
          let errMessage = 'An unknown error occurred!';
          if (error.error || !error.error.errer) {
            return throwError(() => errMessage);
          }

          switch (error.error.error.message) {
            case 'EMAIL_EXISTS':
              errMessage = 'This email exists already';
          }
          return throwError(() => errMessage);
        })
      );
  }
}
