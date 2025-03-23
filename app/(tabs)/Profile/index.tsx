import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';
import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import { useProfile } from '../../../hooks/useProfile';

interface PersonalityTraitProps {
  title: string;
  description: string;
  value: number;
}

export default function ProfileScreen() {
  const { signOut, loading: authLoading, user } = useAuth();
  const { profile, stats, loading: profileLoading, error } = useProfile(user?.id || '');

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>エラーが発生しました</Text>
          <Text style={styles.errorDetail}>{error.message}</Text>
        </View>
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

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop',
            }}
            style={styles.avatar}
          />
          <Text style={styles.username}>匿名ユーザー</Text>
          <Text style={styles.bio}>
            あなたの個性は、他者との関わりの中で見つかる
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.posts}</Text>
            <Text style={styles.statLabel}>投稿</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.evaluations}</Text>
            <Text style={styles.statLabel}>評価</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.received}</Text>
            <Text style={styles.statLabel}>受けた評価</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>性格分析</Text>
          <View style={styles.personalityContainer}>
            <PersonalityTrait
              title="外向性"
              description="内向的 / 社交的"
              value={profile?.extroversion || 0}
            />
            <PersonalityTrait
              title="開放性"
              description="保守的 / 創造的"
              value={profile?.openness || 0}
            />
            <PersonalityTrait
              title="誠実性"
              description="大雑把 / 几帳面"
              value={profile?.conscientiousness || 0}
            />
            <PersonalityTrait
              title="楽観性"
              description="悲観的 / 楽観的"
              value={profile?.optimism || 0}
            />
            <PersonalityTrait
              title="独立性"
              description="依存性 / 独立性"
              value={profile?.independence || 0}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={signOut}
          disabled={authLoading}
        >
          {authLoading ? (
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

function PersonalityTrait({
  title,
  description,
  value,
}: PersonalityTraitProps) {
  // 値を-1から1の範囲に正規化
  const normalizedValue = Math.max(-1, Math.min(1, value / 100));
  
  return (
    <View style={styles.traitContainer}>
      <View style={styles.traitHeader}>
        <Text style={styles.traitTitle}>{title}</Text>
        <Text style={styles.traitDescription}>{description}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(normalizedValue + 1) * 50}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
  traitContainer: {
    gap: 10,
  },
  traitHeader: {
    gap: 4,
  },
  traitTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  traitDescription: {
    fontSize: 12,
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 3,
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
    gap: 8,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
