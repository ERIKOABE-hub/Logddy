import { vi, expect, describe, it, beforeEach, afterEach } from 'vitest';
import { GoogleAuthProvider, signInWithPopup, type UserCredential, type User } from 'firebase/auth';
import { AuthError } from '@/types/auth';
import { handleError } from './errors';
import { LoginWithGoogle } from './google-auth';

vi.mock('firebase/auth', () => {
  return {
    GoogleAuthProvider: vi.fn().mockImplementation(function () {
      // constructor mock
      return {};
    }),
    signInWithPopup: vi.fn(),
  };
});

vi.mock('./errors');
vi.mock('../config', () => ({
  auth: {
    app: {
      options: {
        apiKey: 'test-api-key',
        authDomain: 'test-auth-domain',
        projectId: 'test-project-id',
      },
    },
  },
}));

describe('google-auth', () => {
  const mockToken = 'mock-firebase-token';
  const mockGetIdToken = vi.fn();

  const mockUser: Partial<User> = {
    uid: 'test-uid-123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
    getIdToken: mockGetIdToken,
  };

  const mockUserCredential: UserCredential = {
    user: mockUser as User,
    providerId: 'google.com',
    operationType: 'signIn',
  } as UserCredential;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetIdToken.mockResolvedValue(mockToken);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('LoginWithGoogle', () => {
    it('Googleアカウントで正常にログインできること', async () => {
      vi.mocked(signInWithPopup).mockResolvedValue(mockUserCredential);

      const result = await LoginWithGoogle();

      expect(GoogleAuthProvider).toHaveBeenCalledTimes(1);
      expect(signInWithPopup).toHaveBeenCalled();
      expect(result).toMatchObject({
        token: mockToken,
        user: {
          uid: 'test-uid-123',
          email: 'test@example.com',
          displayName: 'Test User',
          photoURL: 'https://example.com/photo.jpg',
        },
      });
    });

    it('トークンが正しく取得される', async () => {
      vi.mocked(signInWithPopup).mockResolvedValue(mockUserCredential);

      const result = await LoginWithGoogle();

      expect(result.user.uid).toBe('test-uid-123');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.displayName).toBe('Test User');
      expect(mockGetIdToken).toHaveBeenCalled();
    });

    it('GoogleAuthProviderが正しく作成される', async () => {
      vi.mocked(signInWithPopup).mockResolvedValue(mockUserCredential);

      await LoginWithGoogle();

      expect(GoogleAuthProvider).toHaveBeenCalled();
    });

    it('ユーザーポップアップがキャンセルされるとエラーになる', async () => {
      const firebaseError = new Error('auth/popup-closed-by-user');
      const handledError: AuthError = {
        code: 'auth/popup-closed-by-user',
        message: 'ログインがキャンセルされました',
        originalError: firebaseError,
      };

      vi.mocked(signInWithPopup).mockRejectedValue(firebaseError);
      vi.mocked(handleError).mockReturnValue(handledError);

      await expect(LoginWithGoogle()).rejects.toMatchObject({
        message: 'ログインがキャンセルされました',
      });
    });

    it('アカウントが存在しない場合、エラーになる', async () => {
      const firebaseError = new Error('auth/account-not-found');
      const handledError: AuthError = {
        code: 'auth/account-not-found',
        message: 'アカウントが見つかりません',
        originalError: firebaseError,
      };

      vi.mocked(signInWithPopup).mockRejectedValue(firebaseError);
      vi.mocked(handleError).mockReturnValue(handledError);

      await expect(LoginWithGoogle()).rejects.toMatchObject({
        message: 'アカウントが見つかりません',
      });
    });
  });
});
