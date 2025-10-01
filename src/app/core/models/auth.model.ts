import { ApiState } from './base-state.model';

// ============================================
// 🔐 AUTH DOMAIN MODELS
// ============================================

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

// ============================================
// 🏪 AUTH STATE MODEL - Using ApiState<T>
// ============================================

export interface AuthStateModel {
  /** Auth data với ApiState wrapper */
  auth: ApiState<AuthData>;

  /** Flag để check authenticated nhanh */
  isAuthenticated: boolean;
}
