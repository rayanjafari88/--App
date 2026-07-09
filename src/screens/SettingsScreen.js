import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { useApp } from '../context/AppContext';
import CityPickerModal from '../components/CityPickerModal';
import Ornament from '../components/Ornament';

function SettingRow({ icon, label, right, onPress }) {
  const content = (
    <>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color={colors.gold} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {right}
    </>
  );
  if (onPress) {
    return (
      <TouchableOpacity style={styles.row} activeOpacity={0.6} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }
  return <View style={styles.row}>{content}</View>;
}

export default function SettingsScreen() {
  const { city, notifications, setNotifications, adhanSound, setAdhanSound } = useApp();
  const [cityPickerVisible, setCityPickerVisible] = useState(false);

  const showAbout = () => {
    const message =
      'صِلِ — تطبيق للأذكار ومواقيت الصلاة واتجاه القبلة.\nالمواقيت محسوبة فلكياً بطريقة أم القرى.';
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('عن التطبيق', message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>الإعدادات</Text>
      <Ornament />

      <Text style={styles.sectionTitle}>الصلاة</Text>
      <View style={styles.group}>
        <SettingRow
          icon="location-outline"
          label="المدينة"
          onPress={() => setCityPickerVisible(true)}
          right={
            <View style={styles.valueButton}>
              <Text style={styles.valueText}>{city.nameAr}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          }
        />
        <SettingRow
          icon="notifications-outline"
          label="تنبيهات الصلاة"
          right={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.surfaceLight, true: colors.teal }}
              thumbColor={colors.white}
            />
          }
        />
        <SettingRow
          icon="volume-medium-outline"
          label="صوت الأذان"
          right={
            <Switch
              value={adhanSound}
              onValueChange={setAdhanSound}
              trackColor={{ false: colors.surfaceLight, true: colors.teal }}
              thumbColor={colors.white}
            />
          }
        />
      </View>

      <Text style={styles.sectionTitle}>عام</Text>
      <View style={styles.group}>
        <SettingRow
          icon="calculator-outline"
          label="طريقة الحساب"
          right={<Text style={styles.valueText}>أم القرى</Text>}
        />
        <SettingRow
          icon="information-circle-outline"
          label="عن التطبيق"
          onPress={showAbout}
          right={<Ionicons name="chevron-forward" size={16} color={colors.textMuted} />}
        />
      </View>

      <Text style={styles.footer}>صِلِ ١٫٠ — صُنع بمحبة</Text>

      <CityPickerModal visible={cityPickerVisible} onClose={() => setCityPickerVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 22,
  },
  title: {
    fontFamily: fonts.arabicBold,
    color: colors.gold,
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: fonts.arabicBold,
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'right',
    marginTop: 22,
    marginBottom: 8,
    marginHorizontal: 24,
  },
  group: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surfaceLight,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontFamily: fonts.arabic,
    color: colors.textPrimary,
    fontSize: 16,
    flex: 1,
  },
  valueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valueText: {
    fontFamily: fonts.arabic,
    color: colors.gold,
    fontSize: 15,
  },
  footer: {
    fontFamily: fonts.arabic,
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 'auto',
    // Keep clear of the floating Qibla button overlapping the tab bar.
    marginBottom: 52,
  },
});
