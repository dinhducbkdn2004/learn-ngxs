import { ApiState } from './base-state.model';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}


export interface AuthStateModel {
  auth: ApiState<AuthData>;
  isAuthenticated: boolean;
}
