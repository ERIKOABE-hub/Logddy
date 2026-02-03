'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/common/button';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // todo: ログイン処理をここに実装
      console.log('アドレスとパスワードでのログイン開始...:', { email, password });
      // router.push('/dashboard');
    } catch (err) {
      setError('ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // todo: Google OAuth処理
    console.log('Googleでのログイン開始...');
  };

  return (
    <div className="bg-white rounded-3xl p-12 w-full max-w-md shadow-sm">
      <div className="flex items-center justify-center gap-3 mb-6">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="4" fill="#4F46E5" />
          <circle cx="28" cy="28" r="4" fill="#4F46E5" />
          <line
            x1="15"
            y1="15"
            x2="25"
            y2="25"
            stroke="#4F46E5"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-3xl font-normal">Logddy</span>
      </div>
      <h2 className="text-center text-lg mb-6">Welcome back!</h2>
      <h1 className="text-center text-xl font-medium mb-8">ログイン</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-3 py-2 text-gray-700 placeholder-gray-400 bg-[#F0EEEE] border border-[#F0EEEE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
            placeholder="logddy@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-3 py-2 text-gray-700 placeholder-gray-400 bg-[#F0EEEE] border border-[#F0EEEE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
            placeholder="password"
            required
            disabled={isLoading}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" color="black" fullWidth disabled={isLoading}>
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </Button>
        </div>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">またはGoogleでログイン</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-3 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z"
            fill="#4285F4"
          />
          <path
            d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z"
            fill="#34A853"
          />
          <path
            d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.82999 3.96409 7.28999V4.95818H0.957275C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
            fill="#EA4335"
          />
        </svg>
        <span className="text-sm text-gray-700">Sign in with Google</span>
      </button>

      <p className="mt-6 text-center text-sm text-gray-600">
        アカウントをお持ちではありませんか？{' '}
        <a href="/signup" className="text-[#4F46E5] font-medium hover:underline">
          新規登録
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
