import React, { useEffect } from 'react';
import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useSession } from '../hooks/useSession';

const AUTH_GROUPS = ['(tabs)'];

export default function RootLayout() {
  const { session, loading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useFrameworkReady();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] && AUTH_GROUPS.includes(segments[0]);

    if (!session && inAuthGroup) {
      router.replace('/login');
    } else if (session && !inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  if (loading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
