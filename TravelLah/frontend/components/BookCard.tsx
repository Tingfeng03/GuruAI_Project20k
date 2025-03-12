import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { CounterGroup } from './Counter';
import { useCounter } from '../hooks/useCounter';

interface BookingCardProps {
  onSearch: (guestsData: { adults: number; children: number; rooms: number }) => void;
}

export const BookCard: React.FC<BookingCardProps> = ({ onSearch }) => {
  const adults = useCounter({ initialValue: 1, min: 1, max: 6 });
  const children = useCounter({ initialValue: 0, min: 0, max: 4 });
  const rooms = useCounter({ initialValue: 1, min: 1, max: 3 });

  const handleDone = () => {
    onSearch({
      adults: adults.value,
      children: children.value,
      rooms: rooms.value,
    });
  };

  return (
    <Surface style={styles.card} elevation={4}>
      <Text variant="headlineMedium" style={styles.title}>
        BOOK
      </Text>

      <CounterGroup
        iconName="account"
        label="Adults"
        value={adults.value}
        onIncrement={adults.increment}
        onDecrement={adults.decrement}
        min={1}
        max={6}
      />

      <CounterGroup
        iconName="child"
        label="Children"
        iconFamily="FontAwesome6"
        value={children.value}
        onIncrement={children.increment}
        onDecrement={children.decrement}
        min={0}
        max={4}
      />

      <CounterGroup
        iconName="bed"
        label="Rooms"
        value={rooms.value}
        onIncrement={rooms.increment}
        onDecrement={rooms.decrement}
        min={1}
        max={3}
      />

      <Button
        mode="contained"
        onPress={handleDone}
        style={styles.searchButton}
        contentStyle={styles.searchButtonContent}
      >
        Done
      </Button>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    marginTop: 50,
    borderTopEndRadius: 40,
    borderBottomEndRadius: 40,
    borderBottomStartRadius: 40,
    borderTopStartRadius: 40,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  searchButton: {
    marginTop: 30,
  },
  searchButtonContent: {
    paddingVertical: 5,
  },
});
