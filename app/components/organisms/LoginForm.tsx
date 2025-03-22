import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { Divider } from '../molecules/Divider';
import {
  LoginMode,
  LOGIN_MESSAGES,
  LOGIN_STYLE_CONSTANTS,
} from '../../../types/screens';

const { MAX_FORM_WIDTH } = LOGIN_STYLE_CONSTANTS;

interface LoginFormProps {
  email: string;
  password: string;
  mode: LoginMode;
  loading: boolean;
  error?: { message: string } | null;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  mode,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onToggleMode,
}) => {
  return (
    <View style={styles.form}>
      <Input
        value={email}
        onChangeText={onEmailChange}
        placeholder={LOGIN_MESSAGES.EMAIL_PLACEHOLDER}
        icon="email"
        keyboardType="email-address"
      />

      <Input
        value={password}
        onChangeText={onPasswordChange}
        placeholder={LOGIN_MESSAGES.PASSWORD_PLACEHOLDER}
        icon="lock"
        secureTextEntry
      />

      {error && <Text variant="error">{error.message}</Text>}

      <Button
        onPress={onSubmit}
        loading={loading}
        icon={mode === 'signIn' ? 'login' : 'person-add'}
      >
        {mode === 'signIn'
          ? LOGIN_MESSAGES.SIGN_IN_BUTTON
          : LOGIN_MESSAGES.SIGN_UP_BUTTON}
      </Button>

      <Button variant="secondary" onPress={onToggleMode}>
        {mode === 'signIn'
          ? LOGIN_MESSAGES.SWITCH_TO_SIGN_UP
          : LOGIN_MESSAGES.SWITCH_TO_SIGN_IN}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
    maxWidth: MAX_FORM_WIDTH,
  },
});
