import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError,
} from 'firebase/auth';
import { auth } from '../config';
import { AuthResult, LoginCredentials, SignupCredentials } from '@/types/auth';
import { handleError } from './errors';

export async function LoginWithEmail(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    console.log('Start the login process....', credentials.email);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    const token = await userCredential.user.getIdToken();

    console.log('Login success!!', {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
    });

    return {
      user: userCredential.user,
      token,
    };
  } catch (err) {
    throw handleError(err);
  }
}

export async function signupWithEmail(credentials: SignupCredentials): Promise<AuthResult> {
  try {
    console.log('Start the signup process...');

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    const token = await userCredential.user.getIdToken();

    console.log('Signup success!!!', {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
    });

    return {
      user: userCredential.user,
      token,
    };
  } catch (err) {
    throw handleError(err);
  }
}
