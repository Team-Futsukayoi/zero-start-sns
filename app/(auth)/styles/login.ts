import { StyleSheet } from 'react-native';
import { LOGIN_STYLE_CONSTANTS } from '../../../types/screens';

const { MAX_FORM_WIDTH, BORDER_RADIUS, SPACING, FONT_SIZE } =
  LOGIN_STYLE_CONSTANTS;

export const styles = StyleSheet.create({
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
    fontSize: FONT_SIZE.TITLE,
    fontWeight: 'bold',
    marginBottom: SPACING.TITLE_BOTTOM,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.SUBTITLE,
    color: '#666',
    textAlign: 'center',
    marginBottom: SPACING.SUBTITLE_BOTTOM,
  },
  form: {
    width: '100%',
    maxWidth: MAX_FORM_WIDTH,
  },
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
  errorText: {
    color: '#ff4444',
    marginBottom: SPACING.INPUT_BOTTOM,
    marginLeft: SPACING.INPUT_HORIZONTAL,
  },
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
    color: '#fff',
    fontSize: FONT_SIZE.BUTTON,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: FONT_SIZE.BUTTON,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    marginBottom: SPACING.SWITCH_BUTTON_BOTTOM,
  },
  switchButtonText: {
    color: '#666',
    fontSize: FONT_SIZE.SWITCH_BUTTON,
  },
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
