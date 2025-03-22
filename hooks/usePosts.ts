import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/** 投稿データの型 */
export type Post = Database['public']['Tables']['posts']['Row'];

/** 投稿フックの戻り値の型
 * @param posts - 投稿一覧
 * @param loading - 読み込み中か
 * @param error - エラー情報
 * @param refreshPosts - 投稿一覧を更新する関数
 * @param createPost - 投稿を作成する関数
 * @param deletePost - 投稿を削除する関数
 * @param latestNewPost - 最後に受信した新規投稿
 * @param clearLatestNewPost - 新しい投稿通知をクリアする関数
 */

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: Error | null;
  refreshPosts: () => Promise<void>;
  createPost: (text: string, userId: string) => Promise<Post | null>;
  deletePost: (postId: string) => Promise<boolean>;
  latestNewPost: Post | null;
  clearLatestNewPost: () => void;
}

/**
 * 投稿データを管理するカスタムフック
 *
 * @returns 投稿データとそれを操作する関数
 */
export const usePosts = (): UsePostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [latestNewPost, setLatestNewPost] = useState<Post | null>(null);
  const myPostIds = useRef<Set<string>>(new Set());

  const fetchPosts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setPosts(data || []);
    } catch (err) {
      console.error('投稿取得エラー:', err);
      setError(
        err instanceof Error ? err : new Error('投稿の取得に失敗しました')
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * リアルタイムの変更を処理する関数
   *
   * @param payload Supabaseから受け取った変更データ
   */
  const handleRealtimeChanges = useCallback(
    (payload: RealtimePostgresChangesPayload<Post>) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      console.log(`リアルタイム更新: ${eventType}`, newRecord || oldRecord);

      switch (eventType) {
        case 'INSERT':
          if (newRecord) {
            const isMyPost = myPostIds.current.has(newRecord.id);
            setPosts((currentPosts) => [newRecord, ...currentPosts]);
            if (!isMyPost) {
              setLatestNewPost(newRecord);
            }

            if (isMyPost) {
              setTimeout(() => {
                myPostIds.current.delete(newRecord.id);
              }, 10000);
            }
          }
          break;
        case 'UPDATE':
          if (newRecord) {
            setPosts((currentPosts) =>
              currentPosts.map((post) =>
                post.id === newRecord.id ? newRecord : post
              )
            );
          }
          break;
        case 'DELETE':
          if (oldRecord) {
            setPosts((currentPosts) =>
              currentPosts.filter((post) => post.id !== oldRecord.id)
            );
          }
          break;
      }
    },
    []
  );

  /**
   * 最後に受信した新規投稿をクリアする
   */
  const clearLatestNewPost = useCallback(() => {
    setLatestNewPost(null);
  }, []);

  /**
   * 投稿を作成する関数
   *
   * @param text 投稿テキスト
   * @param userId ユーザーID
   * @returns 作成された投稿データ、エラー時はnull
   */
  const createPost = async (
    text: string,
    userId: string
  ): Promise<Post | null> => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          text: text.trim(),
          user_id: userId,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.id) {
        myPostIds.current.add(data.id);
      }

      setPosts((prevPosts) => [data, ...prevPosts]);
      return data;
    } catch (err) {
      console.error('投稿作成エラー:', err);
      setError(
        err instanceof Error ? err : new Error('投稿の作成に失敗しました')
      );
      return null;
    }
  };

  /**
   * 投稿を削除する関数
   *
   * @param postId 削除する投稿のID
   * @returns 削除に成功したかどうか
   */
  const deletePost = async (postId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .match({ id: postId });

      if (error) {
        throw new Error(error.message);
      }

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      return true;
    } catch (err) {
      console.error('投稿削除エラー:', err);
      setError(
        err instanceof Error ? err : new Error('投稿の削除に失敗しました')
      );
      return false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const subscription = supabase
      .channel('posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETEの全てのイベントを見る
          schema: 'public',
          table: 'posts',
        },
        handleRealtimeChanges
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [handleRealtimeChanges]);

  return {
    posts,
    loading,
    error,
    refreshPosts: fetchPosts,
    createPost,
    deletePost,
    latestNewPost,
    clearLatestNewPost,
  };
};
