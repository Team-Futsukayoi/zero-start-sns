import React from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSession } from '../hooks/useSession';

/**
 * アプリケーションのルートコンポーネント
 * セッション状態に基づいて適切なルートにリダイレクト
 *
 * @return {React.ReactElement} リダイレクト先のルートコンポーネント
 */
export default function Index(): React.ReactElement {
  const { session, loading } = useSession();

  // ローディング中はローディングインジケーターを表示
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return session ? (
    <Redirect href="/(tabs)/Home" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
