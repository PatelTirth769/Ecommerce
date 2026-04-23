export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  userId?: string | number;
  userData?: any;
}

export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  userId: string | number | null;
  email: string | null;
}
