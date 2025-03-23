import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  extroversion: number;
  openness: number;
  conscientiousness: number;
  optimism: number;
  independence: number;
}

interface ProfileStats {
  posts: number;
  evaluations: number;
  received: number;
}

const DEFAULT_PROFILE: Profile = {
  extroversion: 0,
  openness: 0,
  conscientiousness: 0,
  optimism: 0,
  independence: 0,
};

export const useProfile = (userId: string) => {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [stats, setStats] = useState<ProfileStats>({
    posts: 0,
    evaluations: 0,
    received: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // プロフィールデータを取得
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('extroversion, openness, conscientiousness, optimism, independence')
          .eq('user_id', userId)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // プロフィールが存在しない場合は新しく作成
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  user_id: userId,
                  ...DEFAULT_PROFILE,
                },
              ])
              .select()
              .single();

            if (createError) {
              throw createError;
            }

            setProfile(newProfile);
          } else {
            throw profileError;
          }
        } else {
          setProfile(profileData);
        }

        // 投稿数を取得
        const { count: postsCount, error: postsError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (postsError) {
          throw postsError;
        }

        // 評価数を取得
        const { count: evaluationsCount, error: evaluationsError } = await supabase
          .from('evaluations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (evaluationsError) {
          throw evaluationsError;
        }

        // 受けた評価数を取得
        const { data: userPosts, error: userPostsError } = await supabase
          .from('posts')
          .select('id')
          .eq('user_id', userId);

        if (userPostsError) {
          throw userPostsError;
        }

        const postIds = userPosts?.map(post => post.id) || [];
        const { count: receivedCount, error: receivedError } = await supabase
          .from('evaluations')
          .select('*', { count: 'exact', head: true })
          .in('post_id', postIds);

        if (receivedError) {
          throw receivedError;
        }

        setStats({
          posts: postsCount || 0,
          evaluations: evaluationsCount || 0,
          received: receivedCount || 0,
        });
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err instanceof Error ? err : new Error('プロフィールの取得に失敗しました'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return {
    profile,
    stats,
    loading,
    error,
  };
}; 