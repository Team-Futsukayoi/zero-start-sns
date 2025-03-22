import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LOGIN_STYLE_CONSTANTS } from '../../../types/screens';

const { BORDER_RADIUS, SPACING, FONT_SIZE } = LOGIN_STYLE_CONSTANTS;

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  icon?: keyof typeof MaterialIcons.glyphMap;
  children: string;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  icon,
  children,
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : '#000'} />
      ) : (
        <>
          {icon && (
            <MaterialIcons
              name={icon}
              size={24}
              color={isPrimary ? '#fff' : '#000'}
            />
          )}
          <Text
            style={[
              styles.buttonText,
              isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
            ]}
          >
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.BUTTON_VERTICAL,
    paddingHorizontal: SPACING.BUTTON_HORIZONTAL,
    borderRadius: BORDER_RADIUS.BUTTON,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#000',
    marginBottom: SPACING.BUTTON_BOTTOM,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonText: {
    fontSize: FONT_SIZE.BUTTON,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#000',
  },
});
