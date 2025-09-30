import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../store/auth/auth.state';
import { Logout } from '../../../store/auth/auth.actions';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
  currentUser$ = this.store.select(AuthState.user);

  login() {
    this.router.navigate(['/auth']);
  }

  logout() {
    this.store.dispatch(new Logout());
    this.router.navigate(['/auth']);
  }
}
