'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './common/button';
import Link from 'next/link';
import { signupWithEmail } from '@/lib/firebase/auth/email-auth';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signupWithEmail({ email, password });

      console.log('サインアップ開始...:', { email, password });
      router.push('/role');
    } catch (_err) {
      setError('サインアップに失敗しました');
    } finally {
      setIsLoading(false);
    }
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
          <circle cx="12" cy="28" r="5" stroke="#4F46E5" stroke-width="2.5" />
          <circle cx="28" cy="12" r="5" stroke="#4F46E5" stroke-width="2.5" />
          <line
            x1="16"
            y1="24"
            x2="24"
            y2="16"
            stroke="#4F46E5"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>

        <span className="text-3xl font-normal">Logddy</span>
      </div>
      <h2 className="text-center text-lg mb-6">Welcome!</h2>
      <h1 className="text-center text-xl font-medium mb-8">新規登録</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-5">
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
            {isLoading ? '新規登録中...' : '新規登録'}
          </Button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        アカウントを既にお持ちですか？{' '}
        <Link href="/" className="text-[#4F46E5] font-medium hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
