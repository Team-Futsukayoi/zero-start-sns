import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThumbsUp, ThumbsDown, MessageCircle, Share2 } from 'lucide-react-native';

const DUMMY_POSTS = [
  {
    id: '1',
    text: '今日は晴れていて気持ちがいい',
    user: {
      name: '匿名ユーザー',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop',
    },
    createdAt: '2分前',
    stats: {
      comments: 3,
      shares: 1,
    },
    evaluations: {
      extroversion: 0,
      openness: 0,
      conscientiousness: 0,
      optimism: 0,
      independence: 0,
    },
  },
  {
    id: '2',
    text: '新しいプロジェクトを始めることにした。長期的な目標を立てて、一歩一歩進んでいきたい。みなさんはどうやってモチベーションを保っていますか？',
    user: {
      name: '匿名ユーザー',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop',
    },
    createdAt: '15分前',
    stats: {
      comments: 12,
      shares: 4,
    },
    evaluations: {
      extroversion: 0,
      openness: 0,
      conscientiousness: 0,
      optimism: 0,
      independence: 0,
    },
  },
];

export default function HomeScreen() {
  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <View style={styles.postHeaderText}>
          <Text style={styles.username}>{item.user.name}</Text>
          <Text style={styles.timestamp}>{item.createdAt}</Text>
        </View>
      </View>

      <Text style={styles.postText}>{item.text}</Text>

      <View style={styles.postStats}>
        <View style={styles.statItem}>
          <MessageCircle size={16} color="#666" />
          <Text style={styles.statText}>{item.stats.comments}</Text>
        </View>
        <View style={styles.statItem}>
          <Share2 size={16} color="#666" />
          <Text style={styles.statText}>{item.stats.shares}</Text>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.evaluationContainer}>
        <Text style={styles.evaluationTitle}>この投稿から感じる性格</Text>
        <EvaluationButton title="外向性" description="社交的 / 内向的" />
        <EvaluationButton title="開放性" description="創造的 / 保守的" />
        <EvaluationButton title="誠実性" description="計画的 / 気分屋" />
        <EvaluationButton title="楽観性" description="前向き / 慎重" />
        <EvaluationButton title="独立性" description="主体的 / 協調的" />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>みんなの投稿</Text>
      </View>
      <FlatList
        data={DUMMY_POSTS}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
      />
    </SafeAreaView>
  );
}

function EvaluationButton({ title, description }) {
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
  postCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  postHeader: {
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
  postHeaderText: {
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
  },
  postStats: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 15,
  },
  evaluationContainer: {
    gap: 12,
  },
  evaluationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
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
    borderWidth: 1,
    borderColor: '#eee',
  },
});