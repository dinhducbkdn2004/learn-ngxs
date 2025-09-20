import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Login, Logout } from './auth.actions';
import {
  AuthStateModel,
  AuthResponse,
  User,
} from '../../core/models/auth.model';
import { UserService } from '../../core/services/api.service';
import { tap } from 'rxjs';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  },
})
@Injectable()
export class AuthState {
  private userService = inject(UserService);
  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Selector()
  static user(state: AuthStateModel): User | null {
    return state.user;
  }

  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.accessToken;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    return this.userService.login(action.username, action.password).pipe(
      tap((response: AuthResponse) => {
        ctx.patchState({
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
          isAuthenticated: true,
        });
      })
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  }
}
