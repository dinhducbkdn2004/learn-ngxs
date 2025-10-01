import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthState } from '../../store/auth/auth.state';
import { Store, select } from '@ngxs/store';
import { Login, Logout } from '../../store/auth/auth.actions';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
    username: [
      '',
      {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      },
    ],
    password: [
      '',
      {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      },
    ],
  });

  isAuthenticated = select(AuthState.isAuthenticated);
  user = select(AuthState.user);

  authLoading = select(AuthState.authLoading);
  authError = select(AuthState.authError);

  onSubmit() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      const username = formValue.username as string;
      const password = formValue.password as string;

      this.store.dispatch(new Login(username, password)).subscribe({
        next: () => {
          this.router.navigate(['/posts']);
        },
      });
    }
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
