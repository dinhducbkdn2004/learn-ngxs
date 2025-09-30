import { Selector } from '@ngxs/store';
import { UsersStateModel } from './users.model';
import { UsersState } from './users.state';

export class UsersSelector {
  @Selector([UsersState])
  static getUsers(state: UsersStateModel) {
    console.log('state.users', state.users);
    return state.users;
  }

  @Selector([UsersState])
  static usersCount(state: UsersStateModel) {
    console.log('state users length', state.users.length);
    return state.users.length;
  }

  @Selector([UsersState])
  static filteredUsers(state: UsersStateModel) {
    const keyword = state.searchKeyword.toLowerCase();
    return state.users.filter((user) =>
      user.name.toLowerCase().includes(keyword)
    );
  }
}
