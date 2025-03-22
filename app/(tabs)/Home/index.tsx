import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThumbsUp, ThumbsDown, Plus, ArrowUp } from 'lucide-react-native';
import { PostItem } from '../../components/organisms/_PostItem';
import { usePosts } from '../../../hooks/usePosts';
import { useSession } from '../../../hooks/useSession';
import { Post } from '../../../hooks/usePosts';

/**
 * ホーム画面コンポーネント
 * 投稿一覧を表示し、投稿の評価などが行える画面
 * @returns ホーム画面のJSXエレメント
 */
export default function HomeScreen() {
  /** 投稿データとそれを操作する関数 */
  const {
    posts,
    loading,
    error,
    refreshPosts,
    latestNewPost,
    clearLatestNewPost,
  } = usePosts();
  const { session } = useSession();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<Post>>(null);
  const newPostNotificationAnim = useRef(new Animated.Value(0)).current;
  const [isNewPostNotificationVisible, setIsNewPostNotificationVisible] =
    useState<boolean>(false);

  /**
   * 投稿一覧を手動で更新する
   */
  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    try {
      await refreshPosts();
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * 投稿をタップしたときの処理
   * @param post タップされた投稿
   */
  const handlePostPress = (post: Post): void => {
    // 投稿詳細画面への遷移（まだ実装されていない場合はコメントアウト）
    // router.push(`/post/${post.id}`);
    console.log('投稿がタップされました:', post.id);
  };

  /**
   * いいねボタンをタップしたときの処理
   * @param post いいねされた投稿
   */
  const handleLikePress = (post: Post): void => {
    console.log('いいねされました:', post.id);
    // TODO: いいね機能の実装必要！
  };

  /**
   * 投稿作成画面に遷移する
   */
  const navigateToCreatePost = (): void => {
    router.push('/(tabs)/Post');
  };

  /**
   * リストの一番上にスクロールする
   */
  const scrollToTop = (): void => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
    hideNewPostNotification();
  };

  /**
   * 新着投稿通知を表示する
   */
  const displayNewPostNotification = (): void => {
    setIsNewPostNotificationVisible(true);
    Animated.timing(newPostNotificationAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(hideNewPostNotification, 5000);
  };

  /**
   * 新着投稿通知を非表示にする
   */
  const hideNewPostNotification = (): void => {
    Animated.timing(newPostNotificationAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsNewPostNotificationVisible(false);
      clearLatestNewPost();
    });
  };

  useEffect(() => {
    if (latestNewPost) {
      displayNewPostNotification();
    }
  }, [latestNewPost]);

  /**
   * 投稿アイテムをレンダリングする関数
   * FlatListのrenderItemプロパティに渡す
   */
  const renderPost = ({ item }: { item: Post }): React.ReactElement => (
    <PostItem
      post={item}
      likesCount={0} // 仮の値。実際にはいいね数を取得する処理が必要
      commentsCount={0} // 仮の値。実際にはコメント数を取得する処理が必要
      onPress={handlePostPress}
      onLikePress={handleLikePress}
    />
  );

  /**
   * 評価ボタンコンポーネント
   * 投稿の性格特性を評価するためのボタン
   */
  const EvaluationButton = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }): React.ReactElement => {
    return (
      <View style={styles.evaluationButton}>
        <View style={styles.evaluationInfo}>
          <Text style={styles.evaluationName}>{title}</Text>
          <Text style={styles.evaluationDesc}>{description}</Text>
        </View>
        <View style={styles.evaluationActions}>
          <Pressable style={styles.actionButton}>
            <ThumbsUp size={16} color="#666" />
          </Pressable>
          <Pressable style={styles.actionButton}>
            <ThumbsDown size={16} color="#666" />
          </Pressable>
        </View>
      </View>
    );
  };

  // 新着通知のアニメーションスタイル
  const notificationAnimStyle = {
    transform: [
      {
        translateY: newPostNotificationAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      },
    ],
    opacity: newPostNotificationAnim,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>みんなの投稿</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>投稿を読み込み中...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            エラーが発生しました。下にスワイプして再読み込みしてください。
          </Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>まだ投稿がありません。</Text>
          <Text style={styles.emptySubtext}>最初の投稿をしてみましょう！</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#000']}
              tintColor="#000"
            />
          }
        />
      )}

      {isNewPostNotificationVisible && (
        <Animated.View
          style={[styles.newPostNotification, notificationAnimStyle]}
        >
          <Pressable
            style={styles.newPostNotificationContent}
            onPress={scrollToTop}
          >
            <ArrowUp size={16} color="#fff" />
            <Text style={styles.newPostNotificationText}>
              新しい投稿があります
            </Text>
          </Pressable>
        </Animated.View>
      )}

      {session && (
        <Pressable style={styles.fabButton} onPress={navigateToCreatePost}>
          <Plus size={24} color="#fff" />
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  postUserInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  newPostNotification: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 8,
    zIndex: 999,
  },
  newPostNotificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    alignSelf: 'center',
  },
  newPostNotificationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 110,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  evaluationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  evaluationInfo: {
    flex: 1,
  },
  evaluationName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  evaluationDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  evaluationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
});
