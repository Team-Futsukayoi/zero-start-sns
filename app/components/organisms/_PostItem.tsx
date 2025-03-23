import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Database } from '../../../types/supabase';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import PersonalityRating from '../molecules/PersonalityRating';
import { PERSONALITY_TRAITS } from '../../../types/evaluation';
import { usePersonality } from '../../../hooks/usePersonality';

/**
 * 投稿アイテムのプロパティ
 *
 * @param post - 投稿データ
 * @param likesCount - いいね数
 * @param commentsCount - コメント数
 * @param onPress - 投稿タップ時のコールバック
 * @param onLikePress - いいねボタンタップ時のコールバック
 * @param onCommentPress - コメントボタンタップ時のコールバック
 * @param onSharePress - シェアボタンタップ時のコールバック
 */

export interface PostItemProps {
  post: Database['public']['Tables']['posts']['Row'];
  likesCount?: number;
  commentsCount?: number;
  onPress?: (post: Database['public']['Tables']['posts']['Row']) => void;
  onLikePress?: (post: Database['public']['Tables']['posts']['Row']) => void;
  onCommentPress?: (post: Database['public']['Tables']['posts']['Row']) => void;
  onSharePress?: (post: Database['public']['Tables']['posts']['Row']) => void;
}

/**
 * 投稿アイテムコンポーネント
 * フィード内の単一の投稿を表示する
 * @param props コンポーネントのプロパティ
 * @returns 投稿アイテムのJSXエレメント
 */
export const PostItem: React.FC<PostItemProps> = ({
  post,
  likesCount = 0,
  commentsCount = 0,
  onPress,
  onLikePress,
  onCommentPress,
  onSharePress,
}) => {
  /** ローカルのいいね状態 */
  const [isLiked, setIsLiked] = useState<boolean>(false);
  /** ローカルのいいね数 */
  const [localLikesCount, setLocalLikesCount] = useState<number>(likesCount);
  const [showEvaluation, setShowEvaluation] = useState<boolean>(false);
  const { ratings, updateRating, submitRating, isSubmitting, isLoading } =
    usePersonality(post.id);

  // 評価済みかどうかをチェック（いずれかの特性が評価されているか）
  const hasEvaluations = Object.keys(ratings).length > 0;

  /**
   * 投稿が作成されてからの経過時間を表示用にフォーマットする
   * @returns フォーマットされた時間文字列
   */
  const formatTimeAgo = (): string => {
    try {
      return formatDistanceToNow(new Date(post.created_at), {
        addSuffix: true,
        locale: ja,
      });
    } catch (error) {
      console.error('日付のフォーマットエラー:', error);
      return '不明な日時';
    }
  };

  /**
   * いいねボタンタップ時の処理
   */
  const handleLikePress = (): void => {
    // トグルのローカル状態（実際のAPIリクエストは親コンポーネントで実装する）
    setIsLiked(!isLiked);
    setLocalLikesCount(isLiked ? localLikesCount - 1 : localLikesCount + 1);

    if (onLikePress) {
      onLikePress(post);
    }
  };

  /**
   * 投稿全体をタップしたときの処理
   */
  const handlePress = (): void => {
    if (onPress) {
      onPress(post);
    }
  };

  const handleTraitChange = async (trait: string, value: number) => {
    try {
      await submitRating(trait, value);
    } catch (error) {
      console.error('評価の保存に失敗しました:', error);
    }
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
      android_ripple={{ color: '#f0f0f0' }}
    >
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop',
          }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.username}>
            ユーザー {post.user_id.substring(0, 6)}
          </Text>
          <Text style={styles.time}>{formatTimeAgo()}</Text>
        </View>
      </View>

      <Text style={styles.text}>{post.text}</Text>

      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={handleLikePress}>
          <Heart
            size={18}
            color={isLiked ? '#ff3b30' : '#666'}
            fill={isLiked ? '#ff3b30' : 'transparent'}
          />
          <Text style={styles.actionText}>{localLikesCount}</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => onCommentPress && onCommentPress(post)}
        >
          <MessageCircle size={18} color="#666" />
          <Text style={styles.actionText}>{commentsCount}</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => onSharePress && onSharePress(post)}
        >
          <Share2 size={18} color="#666" />
        </Pressable>

        <Pressable
          style={[
            styles.actionButton,
            hasEvaluations && styles.disabledActionButton,
          ]}
          onPress={() => {
            if (!hasEvaluations) {
              setShowEvaluation(!showEvaluation);
            }
          }}
        >
          <Text
            style={[
              styles.actionText,
              hasEvaluations && styles.disabledActionText,
            ]}
          >
            {hasEvaluations ? '評価済み' : '評価'}
          </Text>
        </Pressable>
      </View>

      {showEvaluation && !hasEvaluations && !isLoading && (
        <View style={styles.evaluationContainer}>
          {PERSONALITY_TRAITS.map((trait) => (
            <PersonalityRating
              key={trait.name}
              trait={trait}
              value={ratings[trait.name] || 0}
              onValueChange={(value) => handleTraitChange(trait.name, value)}
              disabled={!!ratings[trait.name]}
            />
          ))}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  username: {
    fontWeight: '600',
    fontSize: 15,
  },
  time: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  evaluationContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  disabledActionButton: {
    opacity: 0.5,
  },
  disabledActionText: {
    color: '#999',
  },
});

export default PostItem;
