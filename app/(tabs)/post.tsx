import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Send, Image as ImageIcon } from 'lucide-react-native';

export default function PostScreen() {
  const [text, setText] = useState('');

  const handlePost = () => {
    // TODO: Implement post creation with Supabase
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>新規投稿</Text>
        <Pressable 
          style={[styles.postButton, !text && styles.postButtonDisabled]}
          onPress={handlePost}
          disabled={!text}
        >
          <Text style={styles.postButtonText}>投稿</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>匿名ユーザー</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="今何を考えていますか？"
          placeholderTextColor="#999"
          multiline
          value={text}
          onChangeText={setText}
        />

        <View style={styles.toolbar}>
          <Pressable style={styles.toolbarButton}>
            <ImageIcon size={24} color="#666" />
            <Text style={styles.toolbarButtonText}>画像を追加</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
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
  content: {
    flex: 1,
    padding: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    height: 150,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  toolbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  toolbarButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#000',
    borderRadius: 20,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});