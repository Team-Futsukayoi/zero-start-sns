/**
 * ユーザープロフィールデータの型
 * @param {string} username - ユーザー名
 * @param {string | null} avatar_url - アバターURL
 * @param {string} bio - 自己紹介文
 * @param {Object} stats - 統計情報
 * @param {number} stats.posts - 投稿数
 * @param {number} stats.evaluations - 行った評価数
 * @param {number} stats.received - 受けた評価数
 */
export interface ProfileData {
  username: string;
  avatar_url: string | null;
  bio: string;
  stats: {
    posts: number;
    evaluations: number;
    received: number;
  };
}

/**
 * パーソナリティ特性の表示用プロパティ
 * @param {string} trait - 特性の識別子
 * @param {string} label - 表示用ラベル
 * @param {string} description - 特性の説明
 * @param {number} value - 特性の評価値
 * @param {number} count - 評価数
 * @param {number} positiveCount - ポジティブ評価の数（オプション）
 * @param {number} negativeCount - ネガティブ評価の数（オプション）
 */
export interface PersonalityTraitProps {
  trait: string;
  label: string;
  description: string;
  value: number;
  count: number;
  positiveCount?: number;
  negativeCount?: number;
}

/**
 * パーソナリティ特性の定義
 * @param {string} trait - 特性の識別子
 * @param {string} label - 表示用ラベル
 * @param {string} description - 特性の説明
 */
export interface PersonalityTraitData {
  trait: string;
  label: string;
  description: string;
}

/**
 * パーソナリティ特性（値を含む）
 * @param {number} value - 特性の評価値
 * @param {number} count - 評価数
 */
export interface PersonalityTrait extends PersonalityTraitData {
  value: number;
  count: number;
}

/**
 * パーソナリティ統計データの型
 * @param {string} target_user_id - ターゲットユーザーID
 * @param {string} trait - 特性識別子
 * @param {number} average_rating - 平均評価値
 * @param {number} total_rating - 合計評価値
 * @param {number} ratings_count - 評価数
 * @param {number} positive_count - 肯定的評価数
 * @param {number} negative_count - 否定的評価数
 */
export interface PersonalityStatData {
  target_user_id: string;
  trait: string;
  average_rating: number | string;
  total_rating: number | string;
  ratings_count: number | string;
  positive_count: number | string;
  negative_count: number | string;
}

/**
 * 事前定義されたパーソナリティ特性一覧
 * @param {string} trait - 特性の識別子
 * @param {string} label - 表示用ラベル
 * @param {string} description - 特性の説明
 */
export const PERSONALITY_TRAITS: PersonalityTraitData[] = [
  {
    trait: 'extroversion',
    label: '社交性',
    description: '外向的 / 内向的',
  },
  {
    trait: 'openness',
    label: '開放性',
    description: 'クリエイティブ / 保守的',
  },
  {
    trait: 'conscientiousness',
    label: '誠実性',
    description: '計画的 / 気分屋',
  },
  {
    trait: 'optimism',
    label: '楽観性',
    description: 'ポジティブ / ネガティブ',
  },
  {
    trait: 'independence',
    label: '独立性',
    description: '自己主張 / 協調性',
  },
];
