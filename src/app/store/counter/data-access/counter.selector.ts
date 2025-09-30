import { Selector } from "@ngxs/store";
import { CounterStateModel } from "./counter.model";
import { CounterState } from "./counter.state";

export class CounterSelector {
  @Selector([CounterState])
  static getValue(state: CounterStateModel): number {
    return state.value;
  }
}
