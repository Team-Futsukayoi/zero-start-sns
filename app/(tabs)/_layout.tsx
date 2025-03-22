import { Tabs } from 'expo-router';
import { Home, Search, Bookmark, User } from 'lucide-react-native';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';

interface TabRoute {
  key: string;
  name: string;
  params?: Record<string, string>;
}

interface TabBarProps {
  state: {
    index: number;
    routes: TabRoute[];
  };
  descriptors: Record<
    string,
    {
      options: {
        tabBarLabel?: string;
        title?: string;
        tabBarAccessibilityLabel?: string;
        tabBarTestID?: string;
      };
    }
  >;
  navigation: {
    emit: (event: {
      type: string;
      target: string;
      canPreventDefault: boolean;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

function CustomTabBar(props: any) {
  const { state, descriptors, navigation } = props;
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          if (route.name === 'index') return null;

          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // アイコンを選択する関数
          const getIcon = () => {
            const iconColor = isFocused ? '#000' : '#999';
            const iconSize = 24;

            if (route.name.includes('Home')) {
              return <Home size={iconSize} color={iconColor} />;
            } else if (route.name.includes('Post')) {
              return <Search size={iconSize} color={iconColor} />;
            } else if (route.name.includes('Profile')) {
              return <User size={iconSize} color={iconColor} />;
            }
            return null;
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
            >
              {getIcon()}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="Home/index"
        options={{
          title: 'ホーム',
          tabBarLabel: 'ホーム',
          href: '/(tabs)/Home',
        }}
      />
      <Tabs.Screen
        name="Post/index"
        options={{
          title: '投稿',
          tabBarLabel: '投稿',
          href: '/(tabs)/Post',
        }}
      />
      <Tabs.Screen
        name="Profile/index"
        options={{
          title: 'プロフィール',
          tabBarLabel: 'プロフィール',
          href: '/(tabs)/Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    height: 60,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
