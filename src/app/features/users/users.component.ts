import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { User, UsersState } from '../../store/users/users.state';
import { Store } from '@ngxs/store';
import { FetchUsers, SearchUsers } from '../../store/users/users.actions';
import { AsyncPipe, CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  private readonly searchSubject = new Subject<string>();
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);

  users$ = this.store.select(UsersState.getUsers);
  userCount$ = this.store.select(UsersState.usersCount);
  filteredUsers$ = this.store.select(UsersState.filteredUsers);

  ngOnInit() {
    this.store.dispatch(new FetchUsers());

    this.searchSubject
      .pipe(debounceTime(900), takeUntilDestroyed(this.destroyRef))
      .subscribe((keyword) => {
        this.store.dispatch(new SearchUsers(keyword));
      });
  }

  onSearch(keyword: string) {
    this.searchSubject.next(keyword);
  }
}
