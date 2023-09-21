import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, map } from 'rxjs';
import { Post } from './post.model';
import { PostsService } from './post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isLoading: boolean = false;
  error: null | unknown = null;
  private errorSub: Subscription | null = null;

  constructor(private postService: PostsService) {}

  ngOnInit() {
    this.postService.fetchPosts().subscribe((posts) => {
      this.loadedPosts = posts;
    });
    this.errorSub = this.postService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });
  }

  onCreatePost(postData: Post) {
    this.postService.createAndStorePost(postData);
  }

  onFetchPosts() {
    this.isLoading = true;
    this.postService.fetchPosts().subscribe({
      next: (posts) => {
        this.isLoading = false;
        this.loadedPosts = posts;
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.message;
        console.log(error);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }

  onClearPosts() {
    this.postService.deletePosts().subscribe((res) => {
      console.log(res);
      this.loadedPosts = [];
    });
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy(): void {
    this.errorSub?.unsubscribe();
  }
}
