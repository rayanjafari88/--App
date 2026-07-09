import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

// A classic divider: two thin gold rules around a small rosette.
export default function Ornament({ symbol = '❁' }) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.symbol}>{symbol}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: 54,
    height: 1,
    backgroundColor: colors.gold,
    opacity: 0.45,
  },
  symbol: {
    color: colors.gold,
    fontSize: 13,
    marginHorizontal: 10,
  },
});
