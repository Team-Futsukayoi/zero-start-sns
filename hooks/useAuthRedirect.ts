import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useSession } from './useSession';

// 認証必須のルートグループ
const PROTECTED_ROUTES = ['(tabs)'];
// 認証関連のルート
const AUTH_ROUTES = ['(auth)'];

/**
 * 認証状態に基づいて適切なルートにリダイレクトするためのカスタムフック
 * @returns セッションローディング状態
 */
export function useAuthRedirect() {
  const { session, loading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const firstSegment = segments.length > 0 ? segments[0] : null;

    const isProtectedRoute =
      firstSegment !== null && PROTECTED_ROUTES.includes(firstSegment);
    const isAuthRoute =
      firstSegment !== null && AUTH_ROUTES.includes(firstSegment);
    const isRootOrEmpty = firstSegment === null;

    if (!session && isProtectedRoute) {
      router.replace('/(auth)/login');
    } else if (session && (isAuthRoute || isRootOrEmpty)) {
      router.replace('/(tabs)/Home');
    } else if (!session && isRootOrEmpty) {
      router.replace('/(auth)/login');
    }
  }, [session, loading, segments, router]);

  return { loading };
}
