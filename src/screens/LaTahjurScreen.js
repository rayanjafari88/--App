import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { shortVerses, verseOfTheDay } from '../data/verses';
import Ornament from '../components/Ornament';

function shareVerse(verse) {
  Share.share({ message: `${verse.text}\n﴿ ${verse.reference} ﴾` }).catch(() => {});
}

function VerseCard({ verse, featured }) {
  return (
    <View style={[styles.card, featured && styles.cardFeatured]}>
      {featured && <Text style={styles.featuredLabel}>آية اليوم</Text>}
      <Text style={[styles.verseText, featured && styles.verseTextFeatured]}>{verse.text}</Text>
      <View style={styles.cardFooter}>
        <TouchableOpacity onPress={() => shareVerse(verse)} hitSlop={10}>
          <Ionicons name="share-social-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.reference}>﴿ {verse.reference} ﴾</Text>
      </View>
    </View>
  );
}

// "La Tahjur" (لا تهجر): short verses to keep a daily connection with the Quran.
export default function LaTahjurScreen() {
  const daily = verseOfTheDay();
  const rest = shortVerses.filter((v) => v.id !== daily.id);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>لا تهجر</Text>
      <Ornament />
      <Text style={styles.subtitle}>آيات قصيرة تُنير يومك</Text>

      <FlatList
        data={rest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<VerseCard verse={daily} featured />}
        renderItem={({ item }) => <VerseCard verse={item} />}
      />
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
  subtitle: {
    fontFamily: fonts.arabic,
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardFeatured: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.goldBorder,
  },
  featuredLabel: {
    fontFamily: fonts.arabicBold,
    color: colors.gold,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 6,
  },
  verseText: {
    fontFamily: fonts.arabic,
    color: colors.textPrimary,
    fontSize: 20,
    lineHeight: 42,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  verseTextFeatured: {
    fontSize: 22,
    lineHeight: 46,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reference: {
    fontFamily: fonts.arabic,
    color: colors.gold,
    fontSize: 14,
  },
});
