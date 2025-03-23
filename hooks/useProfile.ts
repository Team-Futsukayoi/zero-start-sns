import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ProfileData } from '../types/profile';
import { User } from '@supabase/supabase-js';

/**
 * プロフィールフックの戻り値の型
 * @param {ProfileData | null} profileData - プロフィールデータ
 * @param {boolean} isLoading - ローディング状態
 * @param {Error | null} error - エラー
 * @param {() => Promise<void>} fetchProfileData - プロフィールデータを再取得する関数
 * @param {boolean} refreshing - リフレッシュ中かどうか
 * @param {() => Promise<void>} onRefresh - リフレッシュする関数
 */
interface UseProfileReturn {
  profileData: ProfileData | null;
  isLoading: boolean;
  error: Error | null;
  fetchProfileData: () => Promise<void>;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
}

/**
 * ユーザーのプロフィールデータを取得・管理するカスタムフック
 *
 * @param user 認証済みユーザー情報
 * @returns プロフィール関連の状態と操作
 */
export const useProfile = (user: User | null): UseProfileReturn => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * プロフィールデータを取得する
   */
  const fetchProfileData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);

      // プロフィール情報を取得
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url, bio')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // プロフィールが存在しない場合は新しく作成
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                user_id: user.id,
                username: '匿名ユーザー',
                bio: 'あなたの個性は、他者との関わりの中で見つかる',
              },
            ])
            .select()
            .single();

          if (createError) {
            throw createError;
          }

          // 新しいプロフィールをセット
          const profileObj = {
            username: newProfile.username,
            avatar_url: newProfile.avatar_url,
            bio: newProfile.bio,
            stats: {
              posts: 0,
              evaluations: 0,
              received: 0,
            },
          };

          setProfileData(profileObj);
          // 新規作成したので、この時点で処理を終了
          return;
        } else {
          throw profileError;
        }
      }

      // 投稿数を取得
      const { count: postsCount, error: postsError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (postsError) throw postsError;

      // 行った評価の数を取得
      const { count: evaluationsCount, error: evalError } = await supabase
        .from('evaluations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (evalError) throw evalError;

      // 受けた評価の数を取得
      const { count: receivedCount, error: recError } = await supabase
        .from('personality_ratings')
        .select('*', { count: 'exact', head: true })
        .eq('target_user_id', user.id);

      if (recError) throw recError;

      setProfileData({
        username: profileData.username || '匿名ユーザー',
        avatar_url: profileData.avatar_url,
        bio: profileData.bio || 'あなたの個性は、他者との関わりの中で見つかる',
        stats: {
          posts: postsCount || 0,
          evaluations: evaluationsCount || 0,
          received: receivedCount || 0,
        },
      });
    } catch (err) {
      console.error('プロフィールデータの取得エラー:', err);
      setError(
        err instanceof Error
          ? err
          : new Error('プロフィールデータの取得に失敗しました')
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * プルトゥリフレッシュ
   */
  const onRefresh = useCallback(async () => {
    if (!user) return;

    setRefreshing(true);
    try {
      await fetchProfileData();
    } finally {
      setRefreshing(false);
    }
  }, [user, fetchProfileData]);

  // 初回マウント時にデータを取得
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return {
    profileData,
    isLoading,
    error,
    fetchProfileData,
    refreshing,
    onRefresh,
  };
};
