import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { UsersStore } from '../../store/users/users.signal-store';

@Component({
  selector: 'app-users',
  standalone: true,
  providers: [UsersStore],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly usersStore = inject(UsersStore);

  searchKeyword = signal('');

  constructor() {
    toObservable(this.searchKeyword)
      .pipe(debounceTime(900), takeUntilDestroyed(this.destroyRef))
      .subscribe((keyword) => this.usersStore.search(keyword));
  }

  ngOnInit() {
    this.usersStore.fetchUsers();
  }

  onSearch(keyword: string) {
    console.log('Search keyword:', keyword);
    this.searchKeyword.set(keyword);
  }
}
