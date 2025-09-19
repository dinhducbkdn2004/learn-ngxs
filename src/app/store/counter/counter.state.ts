import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Increment, Decrement, Reset, IncrementBy } from './counter.actions';

export interface CounterStateModel {
  value: number;
}

@State<CounterStateModel>({
  name: 'counter',
  defaults: {
    value: 0,
  },
})
@Injectable()
export class CounterState {
  @Selector()
  static getValue(state: CounterStateModel): number {
    return state.value;
  }

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
