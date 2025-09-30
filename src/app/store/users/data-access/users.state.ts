import { ApiService } from '../../../core/services/api.service';
import { inject, Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { FetchUsers, SearchUsers } from './users.actions';
import { tap } from 'rxjs';
import { UsersStateModel } from './users.model';

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    users: [],
    searchKeyword: '',
  },
})
@Injectable()
export class UsersState {
  private readonly apiService = inject(ApiService);
  @Action(FetchUsers)
  fetchUsers(ctx: StateContext<UsersStateModel>) {
    return this.apiService.getUsers().pipe(
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
