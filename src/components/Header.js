import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { hijriDateString } from '../lib/hijri';
import Ornament from './Ornament';

export default function Header() {
  return (
    <View style={styles.container}>
      <Ornament />
      <Text style={styles.verse}>ذَكِّرْ فَإِنَّ الذِّكْرَى تَنْفَعُ الْمُؤْمِنِينَ</Text>
      <Text style={styles.reference}>﴿ الذاريات ٥٥ ﴾</Text>
      <Text style={styles.date}>{hijriDateString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 24,
  },
  verse: {
    fontFamily: fonts.arabicBold,
    color: colors.textPrimary,
    fontSize: 26,
    textAlign: 'center',
    lineHeight: 52,
    marginTop: 14,
    writingDirection: 'rtl',
    alignSelf: 'stretch',
  },
  reference: {
    fontFamily: fonts.arabic,
    color: colors.gold,
    fontSize: 14,
    marginTop: 2,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  date: {
    fontFamily: fonts.arabic,
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 10,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});
