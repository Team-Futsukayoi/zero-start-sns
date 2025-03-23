import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';
import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import { useProfile } from '../../../hooks/useProfile';
import { usePersonalityTraits } from '../../../hooks/usePersonalityTraits';
import { PersonalityTrait } from '../../../components/PersonalityTrait';

/**
 * プロフィール画面コンポーネント
 * ユーザーのプロフィール情報と性格特性を表示する
 *
 * @returns プロフィール画面
 */
export default function ProfileScreen() {
  const { user, signOut, loading } = useAuth();

  // プロフィールデータを取得
  const {
    profileData,
    isLoading,
    refreshing,
    onRefresh: handleProfileRefresh,
  } = useProfile(user);

  // パーソナリティ特性データを取得
  const {
    traits: personalityTraits,
    isLoading: traitsLoading,
    refetchStats,
  } = usePersonalityTraits(user);

  // プルトゥリフレッシュのハンドラー
  const onRefresh = React.useCallback(async () => {
    if (!user) return;

    try {
      // プロフィールデータを再取得
      await handleProfileRefresh();
      // パーソナリティ統計を再取得
      await refetchStats();
      console.log('プロフィールデータを更新しました');
    } catch (error) {
      console.error('データ更新エラー:', error);
    }
  }, [user, handleProfileRefresh, refetchStats]);

  if (isLoading || !user) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>プロフィール</Text>
        <Pressable style={styles.settingsButton}>
          <Settings size={20} color="#000" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4ecdc4']}
            tintColor="#4ecdc4"
          />
        }
      >
        <View style={styles.profileHeader}>
          <Image
            source={
              profileData?.avatar_url
                ? { uri: profileData.avatar_url }
                : require('../../../assets/images/icon.png')
            }
            style={styles.avatar}
          />
          <Text style={styles.username}>
            {profileData?.username || '匿名ユーザー'}
          </Text>
          <Text style={styles.bio}>
            {profileData?.bio || 'あなたの個性は、他者との関わりの中で見つかる'}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {profileData?.stats.posts || 0}
            </Text>
            <Text style={styles.statLabel}>投稿</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {profileData?.stats.evaluations || 0}
            </Text>
            <Text style={styles.statLabel}>評価</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {profileData?.stats.received || 0}
            </Text>
            <Text style={styles.statLabel}>受けた評価</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>性格分析</Text>
          {traitsLoading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <View style={styles.personalityContainer}>
              {personalityTraits.map((trait) => (
                <PersonalityTrait
                  key={trait.trait}
                  trait={trait.trait}
                  label={trait.label}
                  description={trait.description}
                  value={trait.value}
                  count={trait.count}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={signOut}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <MaterialIcons name="logout" size={24} color="#000" />
              <Text style={styles.logoutButtonText}>ログアウト</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  personalityContainer: {
    gap: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 70,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
});
