import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Magnetometer } from 'expo-sensors';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { qiblaBearing, distanceToMakkah } from '../lib/prayers';
import Ornament from '../components/Ornament';

const CARDINALS = [
  { label: 'ش', deg: 0 }, // شمال
  { label: 'ق', deg: 90 }, // شرق
  { label: 'ج', deg: 180 }, // جنوب
  { label: 'غ', deg: 270 }, // غرب
];

export default function QiblaScreen() {
  const { city } = useApp();
  const [heading, setHeading] = useState(null); // null = no magnetometer

  const bearing = qiblaBearing(city);
  const distance = distanceToMakkah(city);

  useEffect(() => {
    let sub;
    let mounted = true;
    Magnetometer.isAvailableAsync()
      .then((available) => {
        if (!available || !mounted) return;
        Magnetometer.setUpdateInterval(120);
        sub = Magnetometer.addListener(({ x, y }) => {
          // Device heading from magnetic field vector (0° = north).
          let angle = Math.atan2(y, x) * (180 / Math.PI);
          angle = (angle + 360 + 90) % 360;
          setHeading(angle);
        });
      })
      .catch(() => {});
    return () => {
      mounted = false;
      sub?.remove();
    };
  }, []);

  // Where the needle should point on screen: qibla bearing relative to
  // where the phone is facing. Without a sensor, show it from north.
  const needleAngle = heading === null ? bearing : (bearing - heading + 360) % 360;
  const dialAngle = heading === null ? 0 : -heading;
  const aligned = heading !== null && (needleAngle < 8 || needleAngle > 352);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>اتجاه القبلة</Text>
      <Ornament symbol="✦" />
      <Text style={styles.subtitle}>
        {heading === null
          ? 'البوصلة غير متوفرة — الاتجاه معروض من الشمال'
          : aligned
            ? 'أنت الآن باتجاه القبلة'
            : 'أدر هاتفك حتى يتوهج السهم'}
      </Text>

      <View style={[styles.compassOuter, aligned && styles.compassAligned]}>
        {/* Rotating dial with Arabic cardinal points */}
        <View style={[styles.dial, { transform: [{ rotate: `${dialAngle}deg` }] }]}>
          {CARDINALS.map((c) => (
            <View key={c.label} style={[styles.cardinalArm, { transform: [{ rotate: `${c.deg}deg` }] }]}>
              <Text style={[styles.cardinal, c.deg === 0 && styles.cardinalNorth]}>{c.label}</Text>
            </View>
          ))}
        </View>

        {/* Qibla needle with the Kaaba marker at its tip */}
        <View style={[styles.needleArm, { transform: [{ rotate: `${needleAngle}deg` }] }]}>
          <MaterialCommunityIcons
            name="mosque"
            size={26}
            color={aligned ? colors.gold : colors.textSecondary}
          />
          <View style={[styles.needle, aligned && styles.needleAligned]} />
        </View>

        <View style={[styles.hub, aligned && styles.hubAligned]} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="compass-outline" size={18} color={colors.gold} />
          <Text style={styles.statValue}>{Math.round(bearing)}°</Text>
          <Text style={styles.statLabel}>من الشمال</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="navigate-outline" size={18} color={colors.gold} />
          <Text style={styles.statValue}>{distance.toLocaleString('en')} كم</Text>
          <Text style={styles.statLabel}>إلى مكة المكرمة</Text>
        </View>
      </View>

      <Text style={styles.cityNote}>محسوب لمدينة {city.nameAr}</Text>
    </SafeAreaView>
  );
}

const DIAL = 270;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 28,
  },
  title: {
    fontFamily: fonts.arabicBold,
    color: colors.gold,
    fontSize: 26,
    marginBottom: 10,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.arabic,
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 26,
    textAlign: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 30,
  },
  compassOuter: {
    width: DIAL,
    height: DIAL,
    borderRadius: DIAL / 2,
    borderWidth: 1.5,
    borderColor: colors.goldBorder,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassAligned: {
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 12,
  },
  dial: {
    position: 'absolute',
    width: DIAL,
    height: DIAL,
    alignItems: 'center',
  },
  cardinalArm: {
    position: 'absolute',
    width: DIAL,
    height: DIAL,
    alignItems: 'center',
    paddingTop: 12,
  },
  cardinal: {
    fontFamily: fonts.arabicBold,
    color: colors.textMuted,
    fontSize: 17,
  },
  cardinalNorth: {
    color: colors.danger,
  },
  needleArm: {
    position: 'absolute',
    width: DIAL,
    height: DIAL,
    alignItems: 'center',
    paddingTop: 40,
  },
  needle: {
    width: 3,
    height: DIAL / 2 - 78,
    borderRadius: 2,
    marginTop: 6,
    backgroundColor: colors.textSecondary,
  },
  needleAligned: {
    backgroundColor: colors.gold,
  },
  hub: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    borderWidth: 2,
    borderColor: colors.textSecondary,
  },
  hubAligned: {
    borderColor: colors.gold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
    paddingHorizontal: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    alignItems: 'center',
    paddingVertical: 14,
    gap: 2,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: fonts.arabic,
    color: colors.textSecondary,
    fontSize: 13,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  cityNote: {
    fontFamily: fonts.arabic,
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 18,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});
