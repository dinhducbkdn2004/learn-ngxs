import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { CounterState } from './../../store/counter/counter.state';
import {
  Decrement,
  Increment,
  IncrementBy,
  Reset,
} from './../../store/counter/counter.actions';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-counter',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css',
})
export class CounterComponent {
  count$!: Observable<number>;
  addAmount = 0;

  constructor(private readonly store: Store) {
    this.count$ = this.store.select(CounterState.getValue);
  }

  increment() {
    this.store.dispatch(new Increment());
  }

  decrement() {
    this.store.dispatch(new Decrement());
  }

  reset() {
    this.store.dispatch(new Reset());
    this.addAmount = 0;
  }

  incrementBy() {
    if (this.addAmount) {
      this.store.dispatch(new IncrementBy(this.addAmount));
    }
  }
}
