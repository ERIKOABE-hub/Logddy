import { AuthResult } from '@/types/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config';
import { handleError } from './errors';

export async function LoginWithGoogle(): Promise<AuthResult> {
  try {
    console.log('Start the login process with Google...');
    console.log('🔧 Firebase auth config:', {
      apiKey: auth.app.options.apiKey,
      authDomain: auth.app.options.authDomain,
      projectId: auth.app.options.projectId,
    });

    //Googleプロバイダーのインスタンスを作成
    const provider = new GoogleAuthProvider();
    //ポップアップでGoogleログイン画面を表示
    const userCredential = await signInWithPopup(auth, provider);

    const token = await userCredential.user.getIdToken();

    console.log('Login successed!!', {
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
