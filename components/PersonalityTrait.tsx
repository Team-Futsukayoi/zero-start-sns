import { View, Text, StyleSheet } from 'react-native';
import { PersonalityTraitProps } from '../types/profile';

/**
 * パーソナリティ特性を表示するコンポーネント
 * @param trait 特性
 * @param label 特性名
 * @param description 特性の説明
 * @param value 特性の値
 * @param count 評価数
 * @param positiveCount ポジティブ評価数
 * @param negativeCount ネガティブ評価数
 */
export function PersonalityTrait({
  trait,
  label,
  description,
  value,
  count = 0,
  positiveCount: propPositiveCount,
  negativeCount: propNegativeCount,
}: PersonalityTraitProps) {
  // 値の正負を取得
  const isPositive = value >= 0;

  // 値を整数に丸める
  const roundedValue = Math.round(Math.abs(value));
  const displayValue = isPositive ? roundedValue : -roundedValue;

  // バー表示用の計算
  const maxValue = 5;
  const positiveWidth =
    Math.abs(value) > 0 && isPositive
      ? Math.min((Math.abs(value) / maxValue) * 50, 50)
      : 0;

  const negativeWidth =
    Math.abs(value) > 0 && !isPositive
      ? Math.min((Math.abs(value) / maxValue) * 50, 50)
      : 0;

  // 特性の説明を分割
  const [positiveDesc, negativeDesc] = description.split(' / ');

  // ポジティブとネガティブの評価数
  const positiveCount =
    propPositiveCount !== undefined
      ? propPositiveCount
      : isPositive && count > 0
      ? count
      : 0;

  const negativeCount =
    propNegativeCount !== undefined
      ? propNegativeCount
      : !isPositive && count > 0
      ? count
      : 0;

  // 総評価ユーザー数
  const totalUserCount = positiveCount + negativeCount;

  return (
    <View style={styles.traitContainer}>
      {/* 特性名と評価値 */}
      <View style={styles.traitHeader}>
        <View style={styles.traitTitleContainer}>
          <Text style={styles.traitTitle}>{label}</Text>
          <Text
            style={[
              styles.traitValue,
              isPositive ? styles.positiveValue : styles.negativeValue,
            ]}
          >
            {displayValue}
          </Text>
        </View>
        <Text style={styles.traitDescription}>{description}</Text>
      </View>

      {/* 評価ユーザー数の表示 */}
      {totalUserCount > 0 && (
        <View style={styles.userCountContainer}>
          <Text style={styles.userCountText}>
            合計<Text style={styles.userCountValue}>{totalUserCount}</Text>
            人のユーザーが評価:
            <Text style={styles.positiveCount}>
              {' '}
              {positiveDesc}({positiveCount}人)
            </Text>
            ・
            <Text style={styles.negativeCount}>
              {negativeDesc}({negativeCount}人)
            </Text>
          </Text>
        </View>
      )}

      {/* 評価値のバー表示 */}
      <View style={styles.progressBarContainer}>
        {/* 左側（ネガティブ）のバー */}
        <View style={styles.negativeProgressBar}>
          {Math.abs(value) > 0 && !isPositive && (
            <View
              style={[
                styles.negativeProgressFill,
                { width: `${negativeWidth}%` },
              ]}
            />
          )}
        </View>
        {/* 中央の区切り線 */}
        <View style={styles.progressCenterLine} />
        {/* 右側（ポジティブ）のバー */}
        <View style={styles.positiveProgressBar}>
          {Math.abs(value) > 0 && isPositive && (
            <View
              style={[
                styles.positiveProgressFill,
                { width: `${positiveWidth}%` },
              ]}
            />
          )}
        </View>
      </View>

      {/* バーの下のラベル */}
      <View style={styles.traitLabels}>
        <Text style={[styles.traitLabelText, styles.negativeLabel]}>
          {negativeDesc}
        </Text>
        <Text style={[styles.traitLabelText, styles.positiveLabel]}>
          {positiveDesc}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  traitContainer: {
    gap: 10,
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  traitHeader: {
    gap: 4,
  },
  traitTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  traitTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  traitValue: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  traitDescription: {
    fontSize: 12,
    color: '#666',
  },
  userCountContainer: {
    marginVertical: 8,
    paddingHorizontal: 2,
  },
  userCountText: {
    fontSize: 13,
    color: '#555',
  },
  userCountValue: {
    fontWeight: '600',
    color: '#333',
  },
  positiveCount: {
    color: '#26a69a',
    fontWeight: '500',
  },
  negativeCount: {
    color: '#ff5252',
    fontWeight: '500',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#f3f3f3',
  },
  negativeProgressBar: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  positiveProgressBar: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  progressCenterLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#ddd',
  },
  negativeProgressFill: {
    height: '100%',
    backgroundColor: '#ff5252',
    alignSelf: 'flex-end',
  },
  positiveProgressFill: {
    height: '100%',
    backgroundColor: '#26a69a',
    alignSelf: 'flex-start',
  },
  positiveValue: {
    color: '#4ecdc4',
  },
  negativeValue: {
    color: '#ff6b6b',
  },
  traitLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  traitLabelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  negativeLabel: {
    color: '#ff6b6b',
  },
  positiveLabel: {
    color: '#4ecdc4',
  },
});
