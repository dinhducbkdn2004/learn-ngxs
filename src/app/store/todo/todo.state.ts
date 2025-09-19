import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AddTodo, RemoveTodo, ToggleTodo } from './todo.actions';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoStateModel {
  todos: Todo[];
}
@State<TodoStateModel>({
  name: 'todo',
  defaults: {
    todos: [],
  },
})
@Injectable()
export class TodoState {
  @Selector()
  static getState(state: TodoStateModel) {
    return state.todos;
  }

  @Selector()
  static getCompletedTodos(state: TodoStateModel) {
    return state.todos.filter((todo) => todo.completed);
  }

  @Selector()
  static getIncompleteTodos(state: TodoStateModel) {
    return state.todos.filter((todo) => !todo.completed);
  }

  @Action(AddTodo)
  add(ctx: StateContext<TodoStateModel>, action: AddTodo) {
    const stateModel = ctx.getState();
    const newTodo: Todo = {
      id: stateModel.todos.length + 1,
      title: action.title,
      completed: false,
    }
    ctx.patchState({
      todos: [...stateModel.todos, newTodo], 
    });
  }

  @Action(ToggleTodo)
  toggle(ctx: StateContext<TodoStateModel>, action: ToggleTodo) {
    const stateModel = ctx.getState();
    ctx.patchState({
      todos: stateModel.todos.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      ),
    });
  }

  @Action(RemoveTodo)
  remove(ctx: StateContext<TodoStateModel>, action: RemoveTodo) {
    const stateModel = ctx.getState();
    ctx.patchState({
      todos: stateModel.todos.filter((todo) => todo.id !== action.id),
    });
  }

}
