import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import HeaderNav from "@/components/HeaderNav";
import { CustomDrawerContent } from "@/components/CustomDrawerContent";
import { drawerRoutes } from "@/config/drawerRoutes";

import { Provider } from "react-redux";
import store from "../redux/store"; 
import { useAppDispatch } from "../redux/hooks";
// import { setWeather } from "../redux/slices/weatherSlice";
import { setItineraries } from "../redux/slices/itinerarySlice";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  // PROOF THAT I USE PROVIDERRRRR
  return (
    <Provider store={store}>
      <LayoutContent />
    </Provider>
  );
};

const LayoutContent = () => {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/itineraries");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Fetched Itineraries:", data);
        dispatch(setItineraries(data));
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    };

    // const fetchWeather = async (latitude:string, longtitude:string) => {
    //   try {
    //     // const latitude = process.env.EXPO_PUBLIC_LATITUDE || "52.52";
    //     // const longitude = process.env.EXPO_PUBLIC_LONGITUDE || "13.41";
    //     const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longtitude}&hourly=weather_code&current_weather=true&forecast_days=1`;

    //     const response = await fetch(weatherURL);
    //     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    //     const data = await response.json();
    //     console.log("Fetched Weather:", data);
    //     dispatch(setWeather(data));
    //   } catch (error) {
    //     console.error("Error fetching weather:", error);
    //   }
    // };

    fetchItinerary();
    // fetchWeather();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          header: () => <HeaderNav />,
          drawerPosition: "left",
          drawerType: "slide",
        }}
      >
        {drawerRoutes.map((route) => (
          <Drawer.Screen key={route.name} name={route.name} options={{ title: route.label }} />
        ))}
      </Drawer>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
};

export default RootLayout;
