# صِلِ (Sil)

An Islamic companion app built with React Native and Expo.

> ذَكِّرْ فَإِنَّ الذِّكْرَى تَنْفَعُ الْمُؤْمِنِينَ

## Features

- **Prayer times (المواقيت)** — calculated on the device with the Umm al-Qura method using the `adhan` library, no internet needed. Live countdown to the next prayer and Hijri date.
- **Qibla compass (القبلة)** — rotates with the phone's magnetometer and points toward Makkah, with the bearing in degrees and distance in km.
- **Adhkar (أذكار)** — morning and evening adhkar with a tap counter for repetitions.
- **La Tahjur (لا تهجر)** — short Quranic verses with a verse of the day and sharing.
- **Settings (الإعدادات)** — city picker (8 Saudi cities) that updates prayer times and qibla everywhere, saved with AsyncStorage.

The design uses a dark navy and gold theme with the Amiri typeface for a classic Arabic feel.

## Tech

- React Native + Expo SDK 57
- @react-navigation/bottom-tabs (with a custom floating center tab button)
- adhan (astronomical prayer time calculation)
- expo-sensors, expo-font, @react-native-async-storage/async-storage

## Running the app

```bash
npm install
npx expo start
```

Then scan the QR code with the Expo Go app on your phone, or press `a` to open the Android emulator.

## Project structure

```
src/
├── theme/        colors and typography
├── data/         cities, adhkar, verses
├── lib/          prayer time calculation, hijri date
├── context/      app settings (city, preferences)
├── components/   shared UI components
├── screens/      one screen per tab
└── navigation/   bottom tab navigator
```
