import { AuthError, ValidationResult } from '../types/auth';

/**
 * メールアドレスのバリデーション
 * @param email - 検証するメールアドレス
 * @returns バリデーション結果
 */
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  if (!isValid) {
    return {
      isValid: false,
      error: {
        field: 'email',
        message: '有効なメールアドレスを入力してください',
      },
    };
  }

  return { isValid: true };
};

/**
 * パスワードのバリデーション
 * @param password - 検証するパスワード
 * @returns バリデーション結果
 */
export const validatePassword = (password: string): ValidationResult => {
  const isValid = password.length >= 6;

  if (!isValid) {
    return {
      isValid: false,
      error: {
        field: 'password',
        message: 'パスワードは6文字以上である必要があります',
      },
    };
  }

  return { isValid: true };
};

/**
 * 認証エラーメッセージのハンドリング
 * @param error - エラーメッセージ
 * @returns 適切なAuthErrorオブジェクト
 */
export const handleAuthError = (error: Error): AuthError => {
  const message = error.message;

  if (message.includes('email')) {
    return {
      field: 'email',
      message: 'このメールアドレスは既に使用されています',
    };
  }

  if (message.includes('Email not confirmed')) {
    return {
      field: 'email',
      message:
        'メールアドレスの確認が完了していません。メールをご確認ください。',
    };
  }

  if (message.includes('Invalid login credentials')) {
    return {
      field: 'general',
      message: 'メールアドレスまたはパスワードが正しくありません',
    };
  }

  return {
    field: 'general',
    message: message,
  };
};
