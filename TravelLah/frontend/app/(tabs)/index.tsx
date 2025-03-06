import React from 'react';
import {View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {Appbar, Searchbar, Text} from 'react-native-paper';
import CarouselItem from "../../components/CarouselItem";

export default function HomeScreen() {
    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = (query: string) => setSearchQuery(query);

    const renderCarouselItem = ({item}: {item: {title: string; url: string} }) => {
      return <CarouselItem title={item.title} url={item.url} />;
    }
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}> 
                <Searchbar 
                    placeholder='Where would you like to go?'
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={styles.searchbar}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    searchbar: {
      marginBottom: 16,
    },
});

