import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AuthState } from '../../store/auth/auth.state';
import { Store } from '@ngxs/store';
import { Login, Logout } from '../../store/auth/auth.actions';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  loginForm = this.fb.group({
    username: ['', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}],
    password: ['', {nonNullable: true, validators: [Validators.required, Validators.minLength(6)]}],
  });

  isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
  user$ = this.store.select(AuthState.user);
  error = signal<string | null>(null);

  isLoading = signal<boolean>(false);

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      const formValue = this.loginForm.value;
      const username = formValue.username as string;
      const password = formValue.password as string;

      this.store.dispatch(new Login(username, password)).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/posts']);
        },
        error: (error) => {
          this.isLoading.set(false);

          if (error?.error?.message) {
            this.error.set(error.error.message);
          } else {
            this.error.set('Login failed. Please try again.');
          }
        },
      });
    }
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
