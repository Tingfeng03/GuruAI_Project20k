import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text } from "react-native-paper";

interface CarouselItemProps {
    title: string
    url: string
}

const CarouselItem: React.FC<CarouselItemProps> = ({url, title}) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: url }} style={styles.image}/>
            <Text style={styles.title}>{title}</Text>
        </View>
    );    
};

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 150,
        backgroundColor: '#eaeaea',
        borderRadius: 8,
        overflow: 'hidden',
    },

    title: {
        position: 'absolute',
        bottom: 5,
        left: 10,
        color: '#FFF',
        fontWeight: '600',
    },

    image: {
        width: '100%',
        height: '100%',
    }
})

export default CarouselItem;