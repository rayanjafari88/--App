// Hijri (Umm al-Qura) date string in Arabic. Uses Intl when the JS engine
// supports the islamic-umalqura calendar; otherwise falls back to the
// Gregorian date in Arabic so the header never breaks.
export function hijriDateString(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    try {
      return new Intl.DateTimeFormat('ar', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    } catch (e2) {
      return date.toDateString();
    }
  }
}
