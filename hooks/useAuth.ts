import { useState } from 'react';
import { AuthError, AuthHookReturn } from '../types/auth';
import {
  validateEmail,
  validatePassword,
  handleAuthError,
} from '../utils/auth';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

/**
 * 認証機能を提供するカスタムフック
 * @returns 認証関連の状態と関数を含むオブジェクト
 */
export const useAuth = (): AuthHookReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AuthError>(null);

  /**
   * サインアップ処理
   * @param email - メールアドレス
   * @param password - パスワード
   */
  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setError(emailValidation.error!);
        return;
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.error!);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(handleAuthError(signUpError));
        return;
      }

      if (data?.user?.identities?.length === 0) {
        setError({
          field: 'email',
          message: 'このメールアドレスは既に使用されています',
        });
        return;
      }

      router.replace('/(tabs)/Home');
    } catch (error) {
      console.error('SignUp Error:', error);
      setError({
        field: 'general',
        message: 'アカウント作成に失敗しました',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * サインイン処理
   * @param email - メールアドレス
   * @param password - パスワード
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setError(emailValidation.error!);
        return;
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.error!);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(handleAuthError(signInError));
        return;
      }

      router.replace('/(tabs)/Home');
    } catch (error) {
      console.error('SignIn Error:', error);
      setError({
        field: 'general',
        message: 'ログインに失敗しました',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * サインアウト処理
   * @returns サインアウト処理の結果
   */
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError(handleAuthError(signOutError));
        return;
      }

      router.replace('/(auth)/login');
    } catch (error) {
      console.error('SignOut Error:', error);
      setError({
        field: 'general',
        message: 'ログアウトに失敗しました',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    signUp,
    signIn,
    signOut,
  };
};
