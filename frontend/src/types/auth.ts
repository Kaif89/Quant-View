export interface AuthUser {
  id: string;
  name?: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  acceptUpdates?: boolean;
}
