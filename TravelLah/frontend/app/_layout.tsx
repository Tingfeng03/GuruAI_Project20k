import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import HeaderNav from '@/components/HeaderNav';
import { CustomDrawerContent } from '@/components/CustomDrawerContent';
import { drawerRoutes } from '@/config/drawerRoutes';
import { PaperProvider } from 'react-native-paper';
import { TripProvider } from '@/Provider/TripContext';

// import { Provider } from 'react-redux';
// import store from '.';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Fetch Itinerary Data
    const fetchItinerary = async () => {
      try {
        // Change it with .env ig
        const response = await fetch('http://localhost:8080/api/itineraries'); // Change this if API is deployed
        const data = await response.json();
        console.log(data);
        setItineraries(data);
      } catch (error) {
        console.error('Error fetching itinerary:', error);
      }
    };

    fetchItinerary();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    // <Provider store={store}>
    <TripProvider>
      <PaperProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} itineraries={itineraries} />}
            screenOptions={{
              header: () => <HeaderNav />,
              drawerPosition: 'left',
              drawerType: 'slide',
            }}
          >
                {drawerRoutes.map((route) => (
              <Drawer.Screen key={route.name} name={route.name} options={{ title: route.label }} />
            ))}
          </Drawer>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PaperProvider>
    </TripProvider>
    // </Provider>

  );
}
