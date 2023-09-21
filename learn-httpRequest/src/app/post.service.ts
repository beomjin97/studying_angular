import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Post } from './post.model';
import { Subject, catchError, map, tap, throwError } from 'rxjs';

@Injectable()
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(postData: Post) {
    this.http
      .post('http://localhost:8080/post', postData, { observe: 'response' })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          this.error.next(error.message);
        },
      });
  }

  fetchPosts() {
    let searchParams = new HttpParams().append('key', 'value');
    searchParams = searchParams.append('key2', 'value2');

    return this.http
      .get<{ [key: string]: Post }>('http://localhost:8080/post', {
        headers: new HttpHeaders({ 'Custom-Header': 'hello' }),
        params: searchParams,
      })
      .pipe(
        map((res) => {
          const postsArr: Post[] = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              postsArr.push({ ...res[key], id: key });
            }
          }
          return postsArr;
        }),
        catchError((errorRes) => {
          return throwError(() => errorRes);
        })
      );
  }

  deletePosts() {
    return this.http
      .delete('http://localhost:8080/post', {
        observe: 'events',
        responseType: 'json',
      })
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            //...
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
