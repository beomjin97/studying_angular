import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Observable,
  Observer,
  Subscription,
  filter,
  interval,
  map,
} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private countObsSubscription: Subscription = new Subscription();

  constructor() {}

  ngOnInit() {
    // this.countObsSubscription = interval(1000).subscribe((count) => {
    //   console.log(count);
    // });
    const customIntervalObservable = Observable.create(
      (observer: Observer<any>) => {
        let count = 0;
        setInterval(() => {
          observer.next(count);
          // if (count === 2) {
          if (count === 5) {
            observer.complete();
          }
          if (count > 3) {
            observer.error(new Error('Count is greater than 3'));
          }
          count++;
        }, 1000);
      }
    );

    this.countObsSubscription = customIntervalObservable
      .pipe(
        filter((data: number) => {
          return data > 0;
        }),
        map((data: number) => {
          return `Round ${data + 1}`;
        })
      )
      .subscribe(
        (data: number) => {
          console.log(data);
        },
        (error: any) => {
          console.log(error.message);
        },
        () => {
          console.log('completed!');
        }
      );
  }

  ngOnDestroy(): void {
    this.countObsSubscription.unsubscribe();
  }
}
