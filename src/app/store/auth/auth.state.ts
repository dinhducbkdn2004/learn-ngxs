import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Login, Logout } from './auth.actions';
import {
  AuthResponse,
  User,
  AuthStateModel,
  AuthData,
} from '../../core/models/auth.model';
import { ApiService } from '../../core/services/api.service';
import { tap, catchError, throwError } from 'rxjs';
import {
  initialState,
  setLoading,
  setSuccess,
  setError,
} from '../../core/models/base-state.model';
import { ToastrService } from 'ngx-toastr';
@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    auth: initialState<AuthData>(),
    isAuthenticated: false,
  },
})
@Injectable()
export class AuthState {
  private readonly apiService = inject(ApiService);
  private toastr = inject(ToastrService);

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Selector()
  static user(state: AuthStateModel): User | null {
    return state.auth.data?.user ?? null;
  }

  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.auth.data?.accessToken ?? null;
  }

  @Selector()
  static authLoading(state: AuthStateModel): boolean {
    return state.auth.loading;
  }

  @Selector()
  static authError(state: AuthStateModel): string | undefined {
    return state.auth.error;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    ctx.patchState({
      auth: setLoading<AuthData>(),
      isAuthenticated: false,
    });

    return this.apiService.login(action.username, action.password).pipe(
      tap((response: AuthResponse) => {
        const authData: AuthData = {
          user: {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            gender: response.gender,
            image: response.image,
          },
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        };

        ctx.patchState({
          auth: setSuccess(authData),
          isAuthenticated: true,
        });

        this.toastr.success(
          'Login successful',
          `Welcome ${response.firstName} ${response.lastName}!`
        );
      }),
      catchError((error) => {
        const errorMessage =
          error?.error?.message || error?.message || 'Login failed';

        ctx.patchState({
          auth: setError<AuthData>(errorMessage),
          isAuthenticated: false,
        });

        this.toastr.error('Login failed', errorMessage);

        return throwError(() => error);
      })
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    const currentUser = ctx.getState().auth.data?.user;
    ctx.setState({
      auth: initialState<AuthData>(),
      isAuthenticated: false,
    });

    this.toastr.info(
      'Logout successful',
      currentUser ? `Goodbye ${currentUser.firstName}!` : 'See you next time!'
    );
  }
}
