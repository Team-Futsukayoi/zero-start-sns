import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';

export default function ProfileScreen() {
  // TODO: Implement profile data fetching from Supabase
  const profile = {
    evaluations: {
      extroversion: 0.3,
      openness: 0.7,
      conscientiousness: 0.5,
      optimism: 0.8,
      independence: 0.4,
    },
    stats: {
      posts: 24,
      evaluations: 156,
      received: 432,
    }
  };

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
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>匿名ユーザー</Text>
          <Text style={styles.bio}>あなたの個性は、他者との関わりの中で見つかる</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.stats.posts}</Text>
            <Text style={styles.statLabel}>投稿</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.stats.evaluations}</Text>
            <Text style={styles.statLabel}>評価</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.stats.received}</Text>
            <Text style={styles.statLabel}>受けた評価</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>性格分析</Text>
          <View style={styles.personalityContainer}>
            <PersonalityTrait 
              title="外向性" 
              description="社交的 / 内向的"
              value={profile.evaluations.extroversion} 
            />
            <PersonalityTrait 
              title="開放性" 
              description="創造的 / 保守的"
              value={profile.evaluations.openness} 
            />
            <PersonalityTrait 
              title="誠実性" 
              description="計画的 / 気分屋"
              value={profile.evaluations.conscientiousness} 
            />
            <PersonalityTrait 
              title="楽観性" 
              description="前向き / 慎重"
              value={profile.evaluations.optimism} 
            />
            <PersonalityTrait 
              title="独立性" 
              description="主体的 / 協調的"
              value={profile.evaluations.independence} 
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PersonalityTrait({ title, description, value }) {
  return (
    <View style={styles.traitContainer}>
      <View style={styles.traitHeader}>
        <Text style={styles.traitTitle}>{title}</Text>
        <Text style={styles.traitDescription}>{description}</Text>
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${value * 100}%` }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
});