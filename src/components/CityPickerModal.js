import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { cities } from '../data/cities';
import { useApp } from '../context/AppContext';

// City choice drives prayer times and the qibla bearing app-wide.
export default function CityPickerModal({ visible, onClose }) {
  const { city, setCity } = useApp();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>اختر مدينتك</Text>

          <FlatList
            data={cities}
            keyExtractor={(item) => item.id}
            style={styles.list}
            renderItem={({ item }) => {
              const selected = item.id === city.id;
              return (
                <TouchableOpacity
                  style={[styles.row, selected && styles.rowSelected]}
                  activeOpacity={0.7}
                  onPress={() => {
                    setCity(item);
                    onClose();
                  }}
                >
                  <Ionicons
                    name={selected ? 'location' : 'location-outline'}
                    size={18}
                    color={selected ? colors.gold : colors.textMuted}
                  />
                  <Text style={[styles.cityName, selected && styles.cityNameSelected]}>
                    {item.nameAr}
                  </Text>
                  {selected && <Ionicons name="checkmark" size={18} color={colors.gold} />}
                </TouchableOpacity>
              );
            }}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>إغلاق</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    justifyContent: 'center',
    padding: 28,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 22,
    maxHeight: '72%',
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  title: {
    fontFamily: fonts.arabicBold,
    color: colors.gold,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 14,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowSelected: {
    borderColor: colors.goldBorder,
    backgroundColor: colors.goldSoft,
  },
  cityName: {
    fontFamily: fonts.arabic,
    color: colors.textPrimary,
    fontSize: 16,
    flex: 1,
  },
  cityNameSelected: {
    fontFamily: fonts.arabicBold,
    color: colors.gold,
  },
  closeButton: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
  },
  closeText: {
    fontFamily: fonts.arabicBold,
    color: colors.textPrimary,
    fontSize: 15,
  },
});
