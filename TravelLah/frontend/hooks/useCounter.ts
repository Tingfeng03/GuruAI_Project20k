import { useState } from 'react';

interface UseCounterProps {
  initialValue: number;
  min: number;
  max: number;
}

export const useCounter = ({ initialValue, min, max }: UseCounterProps) => {
  const [value, setValue] = useState(initialValue);

  const increment = () => {
    setValue((prev) => Math.min(prev + 1, max));
  };

  const decrement = () => {
    setValue((prev) => Math.max(prev - 1, min));
  };

  return {
    value,
    increment,
    decrement,
  };
};
