import { User } from 'firebase/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SigninCredentials {
  email: string;
  password: string;
}

export interface AuthReslut {
  user: User;
  token: string;
}
