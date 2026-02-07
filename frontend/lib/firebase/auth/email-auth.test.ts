import { vi, expect, describe, it, beforeEach, afterEach, Mock } from 'vitest';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type UserCredential,
  type User,
} from 'firebase/auth';
import { LoginWithEmail, signupWithEmail } from './email-auth';
import { handleError } from './errors';
import { LoginCredentials, SignupCredentials, AuthError } from '@/types/auth';
import { FirebaseError } from 'firebase/app';

vi.mock('firebase/auth');
vi.mock('@/lib/firebase/auth/errors');
vi.mock('@/lib/firebase/config', () => ({
  auth: {},
}));

describe('email-auth', () => {
  const mockToken = 'mock-firebase-token';
  const mockGetIdToken = vi.fn();

  //　テストユーザー
  const mockUser: Partial<User> = {
    uid: 'test-uid-123',
    email: 'test@example.com',
    getIdToken: mockGetIdToken,
  };

  const mockUserCredential = {
    user: mockUser,
  } as unknown as UserCredential;

  //
  beforeEach(() => {
    //状態を初期化（モック関数の呼び出し履歴をリセット）
    vi.clearAllMocks();
    //getIdTokenが呼ばれたら、mockTokenを返す
    (mockUser.getIdToken as Mock).mockResolvedValue(mockToken);
  });

  afterEach(() => {
    //状態を完全に戻す（モックの解除）
    vi.restoreAllMocks();
  });

  describe('LoginWithEmail', () => {
    // =====　正常系　=====
    it('正しいメールアドレスとパスワードで正常にログインできる', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      //戻り値'mockUserCredential'が返る
      vi.mocked(signInWithEmailAndPassword).mockResolvedValue(mockUserCredential);

      //テスト実行
      const result = await LoginWithEmail(credentials);

      //toHaveBeenCalledWith(): どんな引数で呼ばれたか
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), //何かしら入っていればOK
        credentials.email,
        credentials.password
      );
      //toHaveBeenCalled():引数が呼ばれたかどうか
      expect(mockUser.getIdToken).toHaveBeenCalled();
      //toEqual(): 値が同じか
      expect(result).toEqual({
        user: mockUser,
        token: mockToken,
      });
    });

    it('トークンが正しく取得される', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      const testToken = 'test-token-xyz';
      (mockUser.getIdToken as Mock).mockResolvedValue(testToken);

      vi.mocked(signInWithEmailAndPassword).mockResolvedValue(mockUserCredential);

      const result = await LoginWithEmail(credentials);
      expect(result.token).toBe(testToken);
      expect(mockUser.getIdToken).toHaveBeenCalledTimes(1);
    });

    it('ユーザー情報が正しく返される', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      vi.mocked(signInWithEmailAndPassword).mockResolvedValue(mockUserCredential);

      const result = await LoginWithEmail(credentials);
      expect(result.user.uid).toBe('test-uid-123');
      expect(result.user.email).toBe('test@example.com');
    });

    //=====異常系=====
    it('誤ったパスワードでログインできない', async () => {
      const credentials: LoginCredentials = {
        email: 'test@exmple.com',
        password: 'password0000',
      };

      const firebaseError = new FirebaseError('auth/wrong-password', 'error');

      const handledError: AuthError = {
        code: 'auth/wrong-password',
        message: 'パスワードが間違っています',
        originalError: FirebaseError,
      };

      vi.mocked(signInWithEmailAndPassword).mockRejectedValue(firebaseError);
      vi.mocked(handleError).mockImplementation(() => handledError);

      await expect(LoginWithEmail(credentials)).rejects.toMatchObject({
        code: 'auth/wrong-password',
        message: 'パスワードが間違っています',
      });
    });

    it('存在しないメールアドレスでログインできない', async () => {
      const credentials: LoginCredentials = {
        email: 'notexist@.exaple.com',
        password: 'password1234',
      };

      const handledError: AuthError = {
        code: 'auth/user-not-found',
        message: 'ユーザーが見つかりません',
        originalError: FirebaseError,
      };

      const firebaseError = new FirebaseError('auth/wrong-password', 'error');

      vi.mocked(signInWithEmailAndPassword).mockRejectedValue(firebaseError);
      vi.mocked(handleError).mockImplementation(() => handledError);

      await expect(LoginWithEmail(credentials)).rejects.toMatchObject({
        code: 'auth/user-not-found',
        message: 'ユーザーが見つかりません',
      });
    });
  });

  describe('signupWithEmail', async () => {
    //=====正常系=====
    it('正しい形式のメールアドレスとパスワードでサインアップできる', async () => {
      const credentials: SignupCredentials = {
        email: 'signup-test@example',
        password: 'Password123',
      };
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(mockUserCredential);

      const result = await signupWithEmail(credentials);

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        credentials.email,
        credentials.password
      );
      expect(mockUser.getIdToken).toHaveBeenCalled();
      expect(result).toEqual({
        user: mockUser,
        token: mockToken,
      });
    });
    it('トークンが正しく取得される', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      const testToken = 'test-token-xyz';
      (mockUser.getIdToken as Mock).mockResolvedValue(testToken);

      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(mockUserCredential);

      const result = await signupWithEmail(credentials);
      expect(result.token).toBe(testToken);
      expect(mockUser.getIdToken).toHaveBeenCalledTimes(1);
    });

    //=====異常系=====
    it('パスワードが弱い時、エラーが返ること', async () => {
      const credentials: SignupCredentials = {
        email: 'signup-test@example.com',
        password: '000',
      };
      const handledError: AuthError = {
        code: 'auth/weak-password',
        message: 'パスワードが弱すぎます',
        originalError: FirebaseError,
      };
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(FirebaseError);
      vi.mocked(handleError).mockReturnValue(handledError);

      await expect(signupWithEmail(credentials)).rejects.toThrow('パスワードが弱すぎます');
    });
  });
});
