// components/HeaderNav.tsx
import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation, DrawerActions, useTheme } from '@react-navigation/native';

export default function HeaderNav() {
  const navigation = useNavigation();
  const { colors } = useTheme(); // use current theme colorrrr

  return (
    <View style={[styles.header, { backgroundColor: colors.card }]}>
      <Pressable onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        <Ionicons name="menu" size={28} color={colors.text} />
      </Pressable>
      <ThemedText type="default" style={{ color: colors.text }}>
        LOGO HERE LA CB
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
});
