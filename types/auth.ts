import { Session } from '@supabase/supabase-js';

/**
 * 認証エラーの型定義
 *
 * @param field - エラーが発生したフィールド
 * @param message - エラーメッセージ
 */
export type AuthError = {
  field: 'email' | 'password' | 'general';
  message: string;
} | null;

/**
 * 認証フックの戻り値の型定義
 *
 * @param loading - ローディング状態
 * @param error - エラー情報
 * @param session - セッション情報
 * @param signUp - サインアップ関数
 * @param signIn - サインイン関数
 * @param signOut - サインアウト関数
 */
export interface AuthHookReturn {
  loading: boolean;
  error: AuthError;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * バリデーション結果の型定義
 *
 * @param isValid - バリデーション結果
 * @param error - エラー情報
 */
export interface ValidationResult {
  isValid: boolean;
  error?: AuthError;
}
