import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { morningAdhkar, eveningAdhkar } from '../data/adhkar';

// One dhikr card with a tap counter: tap anywhere on the card to count a
// repetition; it fills toward the recommended count and turns gold when done.
function DhikrCard({ item }) {
  const [done, setDone] = useState(0);
  const complete = done >= item.count;

  return (
    <TouchableOpacity
      style={[styles.dhikrCard, complete && styles.dhikrCardDone]}
      activeOpacity={0.7}
      onPress={() => !complete && setDone(done + 1)}
    >
      <Text style={styles.dhikrText}>{item.text}</Text>
      {item.note ? <Text style={styles.dhikrNote}>{item.note}</Text> : null}
      <View style={styles.dhikrFooter}>
        <View style={[styles.counterPill, complete && styles.counterPillDone]}>
          {complete ? (
            <>
              <Ionicons name="checkmark" size={14} color={colors.background} />
              <Text style={styles.counterTextDone}>تم</Text>
            </>
          ) : (
            <Text style={styles.counterText}>
              {done} / {item.count}
            </Text>
          )}
        </View>
        {!complete && <Text style={styles.tapHint}>اضغط للعدّ</Text>}
      </View>
    </TouchableOpacity>
  );
}

// Two-step modal: first pick Morning / Evening, then read and count.
export default function AdhkarModal({ visible, onClose }) {
  const [selection, setSelection] = useState(null); // null | 'morning' | 'evening'

  const close = () => {
    setSelection(null);
    onClose();
  };

  const adhkar = selection === 'morning' ? morningAdhkar : eveningAdhkar;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {selection === null ? (
            <>
              <Text style={styles.title}>الأذكار</Text>
              <Text style={styles.subtitle}>اختر الأذكار التي تريد قراءتها</Text>

              <View style={styles.choicesRow}>
                <TouchableOpacity
                  style={styles.choice}
                  onPress={() => setSelection('morning')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="sunny-outline" size={34} color={colors.gold} />
                  <Text style={styles.choiceText}>أذكار الصباح</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.choice}
                  onPress={() => setSelection('evening')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="moon-outline" size={34} color={colors.teal} />
                  <Text style={styles.choiceText}>أذكار المساء</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.listHeader}>
                <TouchableOpacity onPress={() => setSelection(null)} hitSlop={12}>
                  <Ionicons name="arrow-back" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
                <Text style={styles.title}>
                  {selection === 'morning' ? 'أذكار الصباح' : 'أذكار المساء'}
                </Text>
                <View style={{ width: 22 }} />
              </View>

              <FlatList
                data={adhkar}
                keyExtractor={(item) => item.id}
                style={styles.list}
                renderItem={({ item }) => <DhikrCard item={item} />}
              />
            </>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={close}>
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
    padding: 22,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 22,
    maxHeight: '82%',
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  title: {
    fontFamily: fonts.arabicBold,
    color: colors.gold,
    fontSize: 22,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.arabic,
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  choicesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  choice: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 18,
    paddingVertical: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  choiceText: {
    fontFamily: fonts.arabicBold,
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: 10,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  list: {
    flexGrow: 0,
  },
  dhikrCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dhikrCardDone: {
    borderColor: colors.goldBorder,
    backgroundColor: colors.goldSoft,
  },
  dhikrText: {
    fontFamily: fonts.arabic,
    color: colors.textPrimary,
    fontSize: 17,
    lineHeight: 34,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  dhikrNote: {
    fontFamily: fonts.arabic,
    color: colors.teal,
    fontSize: 13,
    textAlign: 'right',
    marginTop: 4,
  },
  dhikrFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  counterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  counterPillDone: {
    backgroundColor: colors.gold,
  },
  counterText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  counterTextDone: {
    fontFamily: fonts.arabicBold,
    color: colors.background,
    fontSize: 13,
  },
  tapHint: {
    fontFamily: fonts.arabic,
    color: colors.textMuted,
    fontSize: 12,
  },
  closeButton: {
    marginTop: 16,
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
