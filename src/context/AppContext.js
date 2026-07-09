import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cities, defaultCity } from '../data/cities';

const STORAGE_KEY = 'zikra:settings';

const AppContext = createContext(null);

// App-wide user settings: selected city (drives prayer times + qibla)
// and preference toggles. Persisted with AsyncStorage.
export function AppProvider({ children }) {
  const [city, setCity] = useState(defaultCity);
  const [notifications, setNotifications] = useState(true);
  const [adhanSound, setAdhanSound] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.city) {
            // Re-resolve by id so stored cities pick up data changes
            // (e.g. newly added fields) instead of a stale snapshot.
            setCity(cities.find((c) => c.id === saved.city.id) || defaultCity);
          }
          if (typeof saved.notifications === 'boolean') setNotifications(saved.notifications);
          if (typeof saved.adhanSound === 'boolean') setAdhanSound(saved.adhanSound);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ city, notifications, adhanSound })
    ).catch(() => {});
  }, [city, notifications, adhanSound, loaded]);

  return (
    <AppContext.Provider
      value={{ city, setCity, notifications, setNotifications, adhanSound, setAdhanSound }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
