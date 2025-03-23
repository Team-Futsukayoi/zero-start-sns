import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PersonalityTrait } from '../../../types/evaluation';

type PersonalityRatingProps = {
  trait: PersonalityTrait;
  value: number;
  onValueChange: (value: number) => void;
};

const PersonalityRating: React.FC<PersonalityRatingProps> = ({
  trait,
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.traitName}>{trait.name}</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.button,
            value === -1 && styles.selectedButton,
            styles.negativeButton,
          ]}
          onPress={() => onValueChange(-1)}
        >
          <Text style={[styles.buttonText, value === -1 && styles.selectedButtonText]}>
            {trait.negative}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            value === 1 && styles.selectedButton,
            styles.positiveButton,
          ]}
          onPress={() => onValueChange(1)}
        >
          <Text style={[styles.buttonText, value === 1 && styles.selectedButtonText]}>
            {trait.positive}
          </Text>
        </Pressable>
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
    marginBottom: 12,
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  negativeButton: {
    backgroundColor: '#F5F5F5',
  },
  positiveButton: {
    backgroundColor: '#F5F5F5',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default PersonalityRating; 