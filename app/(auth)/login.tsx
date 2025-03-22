import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { LogIn } from 'lucide-react-native';

export default function LoginScreen() {
  const handleAnonymousLogin = () => {
    // TODO: Implement anonymous login with Supabase
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>無からスタートするSNS</Text>
        <Text style={styles.subtitle}>
          あなたの個性は、他者との関わりの中で見つかる
        </Text>
        
        <Pressable 
          style={styles.loginButton} 
          onPress={handleAnonymousLogin}
        >
          <LogIn size={24} color="#fff" />
          <Text style={styles.loginButtonText}>匿名でログイン</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    gap: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});