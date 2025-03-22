import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LOGIN_STYLE_CONSTANTS } from '../../../types/screens';

const { BORDER_RADIUS, SPACING, FONT_SIZE } = LOGIN_STYLE_CONSTANTS;

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  icon,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
}) => {
  return (
    <View style={styles.inputContainer}>
      <MaterialIcons name={icon} size={24} color="#666" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: BORDER_RADIUS.INPUT,
    paddingHorizontal: SPACING.INPUT_HORIZONTAL,
    marginBottom: SPACING.INPUT_BOTTOM,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 12,
    fontSize: FONT_SIZE.INPUT,
  },
});
