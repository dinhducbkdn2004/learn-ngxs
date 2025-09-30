import { signalStore } from '@ngrx/signals';
import { withActions, withSelectors } from '../../shared/utils/ngxs.utils';
import { UsersSelector } from './data-access/users.selector';
import { FetchUsers, SearchUsers } from './data-access/users.actions';

export const UsersStore = signalStore(
  withSelectors({
    getUsers: UsersSelector.getUsers,
    usersCount: UsersSelector.usersCount,
    filteredUsers: UsersSelector.filteredUsers,
  }),
  withActions({ fetchUsers: FetchUsers, search: SearchUsers })
);
