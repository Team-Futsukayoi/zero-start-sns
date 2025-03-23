import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PersonalityStatData } from '../types/profile';
import { User } from '@supabase/supabase-js';

/**
 * パーソナリティ統計フックの戻り値の型
 * @param {PersonalityStatData[]} stats - パーソナリティ統計データ
 * @param {boolean} isLoading - データロード中かどうか
 * @param {Error | null} error - エラー情報
 * @param {() => Promise<void>} fetchStats - 統計データを更新する関数
 */
interface UsePersonalityStatsReturn {
  stats: PersonalityStatData[];
  isLoading: boolean;
  error: Error | null;
  fetchStats: () => Promise<void>;
}

/**
 * ビューからのデータを処理するヘルパー関数
 *
 * @param data 生データ
 * @returns 処理済みの統計データ
 */
const processViewData = (data: any[]): PersonalityStatData[] => {
  return data.map((item) => ({
    target_user_id: item.target_user_id,
    trait: item.trait,
    average_rating:
      typeof item.average_rating === 'number' ? item.average_rating : 0,
    total_rating: typeof item.total_rating === 'number' ? item.total_rating : 0,
    ratings_count:
      typeof item.ratings_count === 'string'
        ? parseInt(item.ratings_count, 10)
        : item.ratings_count || 0,
    positive_count:
      typeof item.positive_count === 'string'
        ? parseInt(item.positive_count, 10)
        : item.positive_count || 0,
    negative_count:
      typeof item.negative_count === 'string'
        ? parseInt(item.negative_count, 10)
        : item.negative_count || 0,
  }));
};

/**
 * ユーザーのパーソナリティ統計を取得するカスタムフック
 *
 * @param user ユーザー情報
 * @returns パーソナリティ統計と関連状態
 */
export const usePersonalityStats = (
  user: User | null
): UsePersonalityStatsReturn => {
  const [stats, setStats] = useState<PersonalityStatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const userId = user.id;

    try {
      setIsLoading(true);
      setError(null);

      console.log('パーソナリティ統計取得開始 - ユーザーID:', userId);

      // まずRPC関数を試す
      try {
        const { data, error } = await supabase.rpc('get_personality_stats', {
          user_id_param: userId,
        });

        if (error) throw error;

        console.log('RPC経由でデータ取得成功:', data);
        setStats(processViewData(data || []));
        return;
      } catch (rpcError) {
        console.warn('RPC呼び出しに失敗、直接クエリを実行します:', rpcError);
      }

      // RPC失敗した場合はビューを直接クエリ
      try {
        const { data, error } = await supabase
          .from('user_personality_stats')
          .select('*')
          .eq('target_user_id', userId);

        if (error) throw error;

        console.log('ビュー経由でデータ取得成功:', data);
        setStats(processViewData(data || []));
        return;
      } catch (viewError) {
        console.warn(
          'ビューのクエリに失敗、rawデータから集計します:',
          viewError
        );
      }

      // 直接personality_ratingsテーブルから集計
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('personality_ratings')
        .select('trait, value')
        .eq('target_user_id', userId);

      if (ratingsError) throw ratingsError;

      if (ratingsData && ratingsData.length > 0) {
        // データを手動で集計(ビューから取得できない場合)
        const traitMap = new Map<
          string,
          {
            sum: number;
            count: number;
            positiveCount: number;
            negativeCount: number;
          }
        >();

        ratingsData.forEach((item) => {
          const existing = traitMap.get(item.trait) || {
            sum: 0,
            count: 0,
            positiveCount: 0,
            negativeCount: 0,
          };
          existing.sum += item.value;
          existing.count += 1;

          if (item.value > 0) {
            existing.positiveCount += 1;
          } else if (item.value < 0) {
            existing.negativeCount += 1;
          }

          traitMap.set(item.trait, existing);
        });

        const processedData: PersonalityStatData[] = Array.from(
          traitMap.entries()
        ).map(([trait, stats]) => ({
          target_user_id: userId,
          trait,
          total_rating: stats.sum,
          average_rating: stats.sum / stats.count,
          ratings_count: stats.count,
          positive_count: stats.positiveCount,
          negative_count: stats.negativeCount,
        }));

        console.log('手動集計からデータ取得成功:', processedData);
        setStats(processedData);
      } else {
        console.log('評価データがありません');
        setStats([]);
      }
    } catch (err) {
      console.error('パーソナリティ統計の取得エラー:', err);
      setError(
        err instanceof Error
          ? err
          : new Error('パーソナリティ統計の取得に失敗しました')
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return {
    stats,
    isLoading,
    error,
    fetchStats,
  };
};
