import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { Increment, Decrement, Reset, IncrementBy } from './counter.actions';
import { CounterStateModel } from './counter.model';

@State<CounterStateModel>({
  name: 'counter',
  defaults: {
    value: 0,
  },
})
@Injectable()
export class CounterState {
  @Action(Increment)
  increment(ctx: StateContext<CounterStateModel>) {
    const state = ctx.getState();
    ctx.setState({ value: state.value + 1 });
  }

  @Action(Decrement)
  decrement(ctx: StateContext<CounterStateModel>) {
    const state = ctx.getState();
    ctx.setState({ value: state.value - 1 });
  }

  @Action(Reset)
  reset(ctx: StateContext<CounterStateModel>) {
    ctx.setState({ value: 0 });
  }

  @Action(IncrementBy)
  incrementBy(ctx: StateContext<CounterStateModel>, action: IncrementBy) {
    const state = ctx.getState();
    ctx.setState({ value: state.value + action.payload });
  }
}
