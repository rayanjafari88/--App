import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { getDayPrayers, countdownText } from '../lib/prayers';

function PrayerRow({ prayer }) {
  return (
    <View style={[styles.row, prayer.isNext && styles.rowNext]}>
      <View style={[styles.iconWrap, prayer.isNext && styles.iconWrapNext]}>
        <Ionicons
          name={prayer.icon}
          size={20}
          color={prayer.isNext ? colors.background : colors.gold}
        />
      </View>
      <Text style={[styles.name, prayer.isNext && styles.nameNext]}>{prayer.nameAr}</Text>
      <View style={styles.timeWrap}>
        <Text style={[styles.time, prayer.isNext && styles.timeNext]}>{prayer.time}</Text>
        <Text style={styles.period}>{prayer.period}</Text>
      </View>
    </View>
  );
}

export default function PrayerList() {
  const { city } = useApp();
  const [now, setNow] = useState(new Date());

  // Tick every second so the countdown is live and the highlighted
  // prayer flips over the moment its time arrives.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const { prayers, nextTime } = useMemo(
    () => getDayPrayers(city, now),
    // Recompute when the minute (or city) changes — not every second.
    [city, now.getMinutes(), now.getDate()]
  );

  const next = prayers.find((p) => p.isNext);

  return (
    <View style={styles.container}>
      <View style={styles.countdownCard}>
        <Text style={styles.countdownLabel}>
          {next ? `المتبقي لصلاة ${next.nameAr}` : 'المتبقي لصلاة الفجر'}
        </Text>
        <Text style={styles.countdownValue}>{countdownText(nextTime, now)}</Text>
        <Text style={styles.cityLabel}>
          <Ionicons name="location-outline" size={13} color={colors.textSecondary} />{' '}
          {city.nameAr} — طريقة أم القرى
        </Text>
      </View>

      <Text style={styles.title}>مواقيت الصلاة</Text>
      {prayers.map((prayer) => (
        <PrayerRow key={prayer.key} prayer={prayer} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  countdownCard: {
    backgroundColor: colors.goldSoft,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  countdownLabel: {
    fontFamily: fonts.arabic,
    color: colors.textSecondary,
    fontSize: 15,
    // Full-width + centered: RN Android under-measures intrinsic width of
    // shaped Arabic text and clips the last word otherwise.
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  countdownValue: {
    color: colors.gold,
    fontSize: 34,
    fontWeight: '700',
    marginVertical: 4,
    fontVariant: ['tabular-nums'],
  },
  cityLabel: {
    fontFamily: fonts.arabic,
    color: colors.textSecondary,
    fontSize: 13,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  title: {
    fontFamily: fonts.arabicBold,
    color: colors.gold,
    fontSize: 17,
    textAlign: 'right',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowNext: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.goldBorder,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconWrapNext: {
    backgroundColor: colors.gold,
  },
  name: {
    fontFamily: fonts.arabicBold,
    color: colors.textPrimary,
    fontSize: 18,
    flex: 1,
    textAlign: 'left',
  },
  nameNext: {
    color: colors.gold,
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  time: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timeNext: {
    color: colors.gold,
  },
  period: {
    fontFamily: fonts.arabic,
    color: colors.textMuted,
    fontSize: 13,
  },
});
