import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthState } from '../../store/auth/auth.state';
import { Store } from '@ngxs/store';
import { Login, Logout } from '../../store/auth/auth.actions';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  isAuthenticated$: Observable<boolean>;
  user$: Observable<any>;
  token$: Observable<string | null>;

  username: string = '';
  password: string = '';

  constructor(private store: Store) {
    this.isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
    this.user$ = this.store.select(AuthState.user);
    this.token$ = this.store.select(AuthState.token);
  }

  onSubmit() {
    if (this.username && this.password) {
      this.store.dispatch(new Login(this.username, this.password));
    }
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
