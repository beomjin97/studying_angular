import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  userActivated = false;
  private activatedSub: Subscription | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.activatedSub = this.userService.activatedEmiiter.subscribe(
      (didActivated) => {
        this.userActivated = didActivated;
      }
    );
  }

  ngOnDestory(): void {
    this.activatedSub?.unsubscribe();
  }
}
