import Loading from '@/components/Loading';
import { useFontsHook } from '@/hooks/useFontHook';
import { persistor, store } from '@/redux/store';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useNetInfo } from '@react-native-community/netinfo';
import Nointernet from './nointernet';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFontsHook();

  const { isConnected } = useNetInfo();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  if (!isConnected) {
    return (
      <View style={{ flex: 1 }}>
        <Nointernet />
        <StatusBar style="dark" translucent={true} />
      </View>
    );
  }
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <Loading />
        <FlashMessage position="top" />
        <StatusBar style="dark" translucent={true} />
      </PersistGate>
    </Provider>
  );
}
