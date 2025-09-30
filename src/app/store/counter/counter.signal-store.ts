import { signalStore } from '@ngrx/signals';
import { withSelectors, withActions } from '../../shared/utils/ngxs.utils';
import { CounterSelector } from './data-access/counter.selector';
import {
  Decrement,
  Increment,
  IncrementBy,
  Reset,
} from './data-access/counter.actions';

export const CounterStore = signalStore(
  withSelectors({
    counter: CounterSelector.getValue,
  }),
  withActions({
    increment: Increment,
    decrement: Decrement,
    reset: Reset,
    incrementBy: IncrementBy,
  })
);
