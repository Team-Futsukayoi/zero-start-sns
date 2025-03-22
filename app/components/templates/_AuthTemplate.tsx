import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../atoms/_Text';
import { LOGIN_STYLE_CONSTANTS } from '../../../types/screens';

const { SPACING } = LOGIN_STYLE_CONSTANTS;

interface AuthTemplateProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="title" style={{ marginBottom: SPACING.TITLE_BOTTOM }}>
          {title}
        </Text>
        <Text
          variant="subtitle"
          style={{ marginBottom: SPACING.SUBTITLE_BOTTOM }}
        >
          {subtitle}
        </Text>
        {children}
      </View>
    </View>
  );
};

export default AuthTemplate;

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
});
