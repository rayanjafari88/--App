import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

import HomeScreen from '../screens/HomeScreen';
import QiblaScreen from '../screens/QiblaScreen';
import LaTahjurScreen from '../screens/LaTahjurScreen';
import SettingsScreen from '../screens/SettingsScreen';
import QiblaTabButton from '../components/QiblaTabButton';
import AdhkarModal from '../components/AdhkarModal';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [adhkarVisible, setAdhkarVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        initialRouteName="Prayers"
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.gold,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        {/* Far left: prayer times — the app's home screen. */}
        <Tab.Screen
          name="Prayers"
          component={HomeScreen}
          options={{
            tabBarLabel: 'المواقيت',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Opens the Adhkar modal instead of navigating. */}
        <Tab.Screen
          name="Adhkar"
          component={HomeScreen}
          options={{
            tabBarLabel: 'أذكار',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setAdhkarVisible(true);
            },
          }}
        />

        {/* Center: large floating custom button. */}
        <Tab.Screen
          name="Qibla"
          component={QiblaScreen}
          options={{
            tabBarButton: (props) => <QiblaTabButton {...props} />,
          }}
        />

        {/* Short Quranic verses. */}
        <Tab.Screen
          name="LaTahjur"
          component={LaTahjurScreen}
          options={{
            tabBarLabel: 'لا تهجر',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Far right. */}
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'الإعدادات',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>

      <AdhkarModal visible={adhkarVisible} onClose={() => setAdhkarVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBar,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.goldBorder,
    height: 74,
    paddingTop: 8,
    paddingBottom: 12,
    elevation: 0,
  },
  tabLabel: {
    fontFamily: fonts.arabic,
    fontSize: 12,
  },
});
