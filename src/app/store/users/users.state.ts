import { UserService } from '../../core/services/api.service';
import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { FetchUsers, SearchUsers } from './users.actions';
import { tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UsersStateModel {
  users: User[];
  searchKeyword: string;
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    users: [],
    searchKeyword: '',
  },
})
@Injectable()
export class UsersState {
  private userService = inject(UserService);
  @Selector()
  static getUsers(state: UsersStateModel) {
    console.log('state.users', state.users);
    return state.users;
  }

  @Selector()
  static usersCount(state: UsersStateModel) {
    console.log('state.users.length', state.users.length);
    return state.users.length;
  }

   @Selector()
  static filteredUsers(state: UsersStateModel) {
    const keyword = state.searchKeyword.toLowerCase();
    return state.users.filter(user => user.name.toLowerCase().includes(keyword));
  }

  @Action(FetchUsers)
  fetchUsers(ctx: StateContext<UsersStateModel>) {
    return this.userService.getUsers().pipe(
      tap((users) => {
        ctx.patchState({ users });
      })
    );
  }

  @Action(SearchUsers)
  search(ctx: StateContext<UsersStateModel>, action: SearchUsers) {
    ctx.patchState({ searchKeyword: action.keyword });
  }

}
