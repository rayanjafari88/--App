import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import TabNavigator from './src/navigation/TabNavigator';
import { AppProvider } from './src/context/AppContext';
import { colors } from './src/theme/colors';


const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.tabBar,
    primary: colors.gold,
    text: colors.textPrimary,
    border: colors.border,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({ Amiri_400Regular, Amiri_700Bold });

  // Hold on a plain navy view until the classic Arabic font is ready,
  // so text never flashes in the wrong typeface.
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" />
          <TabNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
