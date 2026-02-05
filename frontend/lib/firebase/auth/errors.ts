import { FirebaseError } from 'firebase/app';
import { AuthError } from '@/types/auth';

const ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
  'auth/invalid-email': 'メールアドレスの形式が正しくありません',
  'auth/weak-password': 'パスワードが弱すぎます',
  'auth/user-disabled': 'このアカウントは無効化されています',
  'auth/user-not-found': 'ユーザーが見つかりません',
  'auth/wrong-password': 'パスワードが正しくありません',
  'auth/invalid-credential': 'メールアドレスまたはパスワードが正しくありません',
  'auth/id-token-expired': 'Firebase ID トークンが期限切れです',
};

export function handleError(error: unknown): AuthError {
  if (error instanceof FirebaseError) {
    const message = ERROR_MESSAGES[error.code] || 'エラーが発生しました';

    console.error('Firebase error:', {
      code: error.code,
      message: error.message,
    });

    return {
      code: error.code,
      message: message,
      originalError: error,
    };
  }
  console.error('予期しないエラー', error);
  return {
    code: 'unknown',
    message: '予期しないエラーが発生しました',
    originalError: error,
  };
}

export function getErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    return ERROR_MESSAGES[error.code] || 'エラーが発生しました';
  }
  return '予期しないエラーが発生しました';
}
