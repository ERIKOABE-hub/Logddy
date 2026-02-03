import { User } from 'firebase/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface AuthError {
  code: string;
  message: string;
  originalError?: unknown;
}
