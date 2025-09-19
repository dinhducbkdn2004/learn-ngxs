import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AddAnimal, RemoveAnimal } from './animals.actions';

export interface AnimalsStateModel {
  animals: string[];
}

@State<AnimalsStateModel>({
  name: 'animals',
  defaults: {
    animals: [],
  },
})
@Injectable()
export class AnimalsState {
  @Selector()
  static getAnimals(state: AnimalsStateModel) {
    return state.animals;
  }

  @Action(AddAnimal)
  addAnimal(ctx: StateContext<AnimalsStateModel>, action: AddAnimal) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      animals: [...state.animals, action.name],
    });
  }

  @Action(RemoveAnimal)
  removeAnimal(ctx: StateContext<AnimalsStateModel>, action: RemoveAnimal) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      animals: state.animals.filter((item) => item !== action.name),
    });
  }
}
