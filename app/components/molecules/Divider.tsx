import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';
import { LOGIN_STYLE_CONSTANTS } from '../../../types/screens';

const { SPACING, FONT_SIZE } = LOGIN_STYLE_CONSTANTS;

interface DividerProps {
  text: string;
}

export const Divider: React.FC<DividerProps> = ({ text }) => {
  return (
    <View style={styles.divider}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{text}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.DIVIDER_BOTTOM,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    color: '#666',
    marginHorizontal: SPACING.DIVIDER_HORIZONTAL,
    fontSize: FONT_SIZE.DIVIDER,
  },
});
