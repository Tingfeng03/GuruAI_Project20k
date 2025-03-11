import React from "react";
import { View, StyleSheet } from "react-native";
import { Surface, Text, IconButton, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from '@expo/vector-icons';

interface CounterGroupProps {
    iconName: string;
    iconFamily?: 'MaterialCommunityIcons' | 'FontAwesome6';  // Add this
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    min: number;
    max: number;
  }
  
  export const CounterGroup: React.FC<CounterGroupProps> = ({
    iconName,
    iconFamily = 'MaterialCommunityIcons',  // Default value
    label,
    value,
    onIncrement,
    onDecrement,
    min,
    max,
  }) => {
    const theme = useTheme();
  
    // Render icon based on family
    const renderIcon = () => {
        if (iconFamily === 'FontAwesome6') {
          return (
            <View style={{ height: 22, justifyContent: 'center', marginLeft: 2 }}>  {/* Add this wrapper */}
              <FontAwesome6
                name={iconName as any}
                size={22}
                color={theme.colors.primary}
              />
            </View>
          );
        }
        return (
          <View style={{ height: 22, justifyContent: 'center' }}>  {/* Add this wrapper */}
            <MaterialCommunityIcons
              name={iconName as any}
              size={22}
              color={theme.colors.primary}
            />
          </View>
        );
      };  

  return (
    <Surface style={styles.counterContainer} elevation={3}>
      <View style={styles.labelContainer}>
        {renderIcon()}
        <Text 
          variant="titleMedium" 
          style={[
            styles.label,
            iconFamily === 'FontAwesome6' && { marginLeft: 15 }
          ]}
        >
          {label}
        </Text>
      </View>
      <View style={styles.controlsContainer}>
        <IconButton
          icon="minus"
          mode="contained-tonal"
          onPress={onDecrement}
          disabled={value <= min}
          size={20}
        />
        <Text variant="titleLarge" style={styles.counterValue}>
          {value}
        </Text>
        <IconButton
          icon="plus"
          mode="contained-tonal"
          onPress={onIncrement}
          disabled={value >= max}
          size={20}
        />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
    counterContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",  // This is good
      marginBottom: 15,
      padding: 6,
      borderRadius: 35,
      paddingHorizontal: 5,
    },
    labelContainer: {
      flexDirection: "row",
      alignItems: "center",  // This is good
      // Remove gap as it might cause alignment issues
      // gap: 5,  // Remove this
      minWidth: 120,  // Increased for better spacing
      paddingLeft: 15,  // Adjusted padding
    },
    label: {
      marginLeft: 10,
      fontSize: 16,
      fontWeight: '500',
      // Add lineHeight to match icon height
      lineHeight: 22,  // Add this to match icon size
    },
    controlsContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 0,
      paddingRight: 2,
    },
    counterValue: {
      minWidth: 25,
      textAlign: "center",
      fontSize: 20,
    },
  });