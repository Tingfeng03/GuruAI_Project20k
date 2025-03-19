import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Avatar, Title, Caption } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { drawerRoutes } from '@/config/drawerRoutes';
import { List } from 'react-native-paper';

export function CustomDrawerContent({ navigation }: DrawerContentComponentProps) {
    const { colors } = useTheme();

    return (
        <DrawerContentScrollView contentContainerStyle={{ flex: 1 }}>
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <Avatar.Text
                    label="NM"
                    size={80}
                />
                <Title style={[styles.title, { color: colors.text }]}>User</Title>
                <Caption style={[styles.caption, { color: colors.text }]}>@user1</Caption>
            </View>
            {/* Register the screens you want in the drawer in /frontend/config/drawerRoutes.ts */}
            <View style={[styles.menu, styles.title]}>


                {drawerRoutes.map((item) => (
                    // use List.Item, because Drawer.Item cannot fucking change the font color
                    <List.Item
                        key={item.name}
                        title={item.label}
                        titleStyle={{ color: colors.text, fontSize: 16 }}
                        onPress={() => navigation.navigate(item.route)}
                        style={{ backgroundColor: 'transparent' }}
                    />
                ))}

            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        marginTop: 10,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
    },
    menu: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
});
