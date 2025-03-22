import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { LOGIN_STYLE_CONSTANTS } from '../../../types/screens';

const { FONT_SIZE } = LOGIN_STYLE_CONSTANTS;

type TextVariant = 'title' | 'subtitle' | 'error' | 'body';

interface TextProps {
  variant?: TextVariant;
  style?: TextStyle;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  style,
  children,
}) => {
  return <RNText style={[styles[variant], style]}>{children}</RNText>;
};

export default Text;

const styles = StyleSheet.create({
  title: {
    fontSize: FONT_SIZE.TITLE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.SUBTITLE,
    color: '#666',
    textAlign: 'center',
  },
  error: {
    color: '#ff4444',
    fontSize: FONT_SIZE.SUBTITLE,
  },
  body: {
    fontSize: FONT_SIZE.SUBTITLE,
  },
});
