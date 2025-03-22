/**
 * ログイン画面のモード
 */
export type LoginMode = 'signIn' | 'signUp';

/**
 * ログイン画面のメッセージ定数
 */
export const LOGIN_MESSAGES = {
  SIGN_IN_TITLE: '無からスタートするSNS',
  SIGN_UP_TITLE: '無からスタートするSNS',
  SIGN_IN_SUBTITLE: 'あなたの個性は、他者との関わりの中で見つかる',
  SIGN_UP_SUBTITLE: 'あなたの個性は、他者との関わりの中で見つかる',
  SIGN_IN_BUTTON: 'ログイン',
  SIGN_UP_BUTTON: 'アカウント作成',
  LOADING: 'お待ちください...',
  SWITCH_TO_SIGN_IN: 'すでにアカウントをお持ちの方はこちら',
  SWITCH_TO_SIGN_UP: 'アカウントをお持ちでない方はこちら',
  OR: 'または',
  ANONYMOUS_SIGN_IN: '匿名でログイン',
  EMAIL_PLACEHOLDER: 'メールアドレス',
  PASSWORD_PLACEHOLDER: 'パスワード',
} as const;

/**
 * ログイン画面のスタイル定数
 */
export const LOGIN_STYLE_CONSTANTS = {
  ICON_SIZE: 20,
  ICON_COLOR: '#666',
  LOADING_ICON_SIZE: 24,
  MAX_FORM_WIDTH: 400,
  BORDER_RADIUS: {
    INPUT: 12,
    BUTTON: 25,
  },
  SPACING: {
    TITLE_BOTTOM: 10,
    SUBTITLE_BOTTOM: 40,
    INPUT_HORIZONTAL: 16,
    INPUT_BOTTOM: 12,
    BUTTON_VERTICAL: 15,
    BUTTON_HORIZONTAL: 30,
    BUTTON_BOTTOM: 12,
    SWITCH_BUTTON_BOTTOM: 24,
    DIVIDER_BOTTOM: 24,
    DIVIDER_HORIZONTAL: 12,
  },
  FONT_SIZE: {
    TITLE: 24,
    SUBTITLE: 16,
    INPUT: 16,
    BUTTON: 16,
    SWITCH_BUTTON: 14,
    DIVIDER: 14,
  },
} as const;
