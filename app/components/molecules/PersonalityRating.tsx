import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { PersonalityTrait } from '../../../types/evaluation';

type PersonalityRatingProps = {
  trait: PersonalityTrait;
  value: number;
  onValueChange: (value: number) => void;
};

export const PersonalityRating: React.FC<PersonalityRatingProps> = ({
  trait,
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.traitName}>{trait.name}</Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>{trait.negative}</Text>
        <Slider
          style={styles.slider}
          minimumValue={-1}
          maximumValue={1}
          step={0.1}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#DEDEDE"
        />
        <Text style={styles.label}>{trait.positive}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  traitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    width: 80,
    textAlign: 'center',
  },
}); 