import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

// Custom center tab button: larger than the others and floating
// above the tab bar so it stands out.
export default function QiblaTabButton(props) {
  const { onPress } = props;
  // React Navigation v7 exposes the selected state as `aria-selected`
  // on web and `accessibilityState` on native — support both.
  const focused = props.accessibilityState?.selected ?? props['aria-selected'] ?? false;

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="القبلة"
    >
      <View style={[styles.ring, focused && styles.ringFocused]}>
        <View style={[styles.button, focused && styles.buttonFocused]}>
          <MaterialCommunityIcons name="compass-rose" size={32} color={colors.background} />
        </View>
      </View>
      <Text style={[styles.label, focused && styles.labelFocused]}>القبلة</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  // Thin gold halo around the button — gives it a crafted, medallion feel.
  ring: {
    width: 74,
    height: 74,
    borderRadius: 37,
    marginTop: -36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  ringFocused: {
    borderColor: colors.gold,
  },
  button: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonFocused: {
    backgroundColor: colors.teal,
    shadowColor: colors.teal,
  },
  label: {
    fontFamily: fonts.arabic,
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
    marginBottom: 8,
  },
  labelFocused: {
    color: colors.teal,
  },
});
