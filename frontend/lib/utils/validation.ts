export type ValidationResult = string | null;

export function isValidEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return 'メールアドレスを入力してください';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return 'メールアドレスの形式が正しくありません';
  }
  return null;
}

export function isValidPassword(password: string, minLength: number = 8): ValidationResult {
  if (!password || password.trim() === '') {
    return 'パスワードを入力してください';
  }
  if (password.length < minLength) {
    return `パスワードは${minLength}文字以上にしてください`;
  }
  return null;
}
