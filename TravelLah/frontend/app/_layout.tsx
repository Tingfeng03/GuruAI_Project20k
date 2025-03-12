import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import HeaderNav from '@/components/HeaderNav';
import { CustomDrawerContent } from '@/components/CustomDrawerContent';
import { drawerRoutes } from '@/config/drawerRoutes';

// Import Redux
import { Provider } from 'react-redux';
import store from '../reducers/store';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  // ✅ Wrap entire app inside Redux Provider
  return (
    <Provider store={store}>
      <LayoutContent />
    </Provider>
  );
};

// ✅ Move all logic into a separate component inside <Provider>
const LayoutContent = () => {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch(); // ✅ Now inside Provider

  // ✅ Load fonts
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
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
    </Provider>
  );
};

export default RootLayout;
