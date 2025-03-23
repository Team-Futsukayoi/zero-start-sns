import { useMemo } from 'react';
import { usePersonalityStats } from './usePersonalityStats';
import {
  PersonalityTrait,
  PERSONALITY_TRAITS,
  PersonalityTraitData,
} from '../types/profile';
import { User } from '@supabase/supabase-js';

/**
 * パーソナリティ特性フックの戻り値の型
 * @param {PersonalityTrait[]} traits - パーソナリティ特性の一覧
 * @param {boolean} isLoading - データロード中かどうか
 * @param {Error | null} error - エラー情報
 * @param {() => Promise<void>} refetchStats - 統計データを更新する関数
 */
interface UsePersonalityTraitsReturn {
  traits: PersonalityTrait[];
  isLoading: boolean;
  error: Error | null;
  refetchStats: () => Promise<void>;
}

/**
 * ユーザーのパーソナリティ特性を取得・処理するカスタムフック
 *
 * @param user ユーザー情報
 * @returns パーソナリティ特性の一覧と関連状態
 */
export const usePersonalityTraits = (
  user: User | null
): UsePersonalityTraitsReturn => {
  const { stats, isLoading, error, fetchStats } = usePersonalityStats(user);

  /**
   * パーソナリティ特性の値を取得
   *
   * @param trait 特性名
   * @returns 該当する特性の平均値
   */
  const getPersonalityValue = (trait: string): number => {
    if (!stats || stats.length === 0) return 0;

    const traitData = stats.find((item) => item.trait === trait);
    return traitData ? Number(traitData.average_rating) || 0 : 0;
  };

  /**
   * 各特性の評価数を取得
   *
   * @param trait 特性名
   * @returns 該当する特性の評価数
   */
  const getPersonalityCount = (trait: string): number => {
    if (!stats || stats.length === 0) return 0;

    const traitData = stats.find((item) => item.trait === trait);
    return traitData ? Number(traitData.ratings_count) || 0 : 0;
  };

  /**
   * 特性のポジティブ評価数を取得
   *
   * @param trait 特性名
   * @returns 該当する特性のポジティブ評価数
   */
  const getPositiveCount = (trait: string): number => {
    if (!stats || stats.length === 0) return 0;

    const traitData = stats.find((item) => item.trait === trait);
    return traitData ? Number(traitData.positive_count) || 0 : 0;
  };

  /**
   * 特性のネガティブ評価数を取得
   *
   * @param trait 特性名
   * @returns 該当する特性のネガティブ評価数
   */
  const getNegativeCount = (trait: string): number => {
    if (!stats || stats.length === 0) return 0;

    const traitData = stats.find((item) => item.trait === trait);
    return traitData ? Number(traitData.negative_count) || 0 : 0;
  };

  /**
   * フォーマット済みのパーソナリティ特性一覧
   */
  const traits = useMemo(() => {
    return PERSONALITY_TRAITS.map((trait: PersonalityTraitData) => {
      const traitValue = getPersonalityValue(trait.trait);
      return {
        trait: trait.trait,
        label: trait.label,
        description: trait.description,
        value: traitValue,
        count: getPersonalityCount(trait.trait),
        positiveCount: getPositiveCount(trait.trait),
        negativeCount: getNegativeCount(trait.trait),
      };
    });
  }, [stats]);

  return {
    traits,
    isLoading,
    error,
    refetchStats: fetchStats,
  };
};
