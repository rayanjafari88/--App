import { Coordinates, CalculationMethod, PrayerTimes, Prayer, Qibla } from 'adhan';

const PRAYER_META = [
  { key: Prayer.Fajr, nameAr: 'الفجر', icon: 'cloudy-night-outline' },
  { key: Prayer.Dhuhr, nameAr: 'الظهر', icon: 'sunny-outline' },
  { key: Prayer.Asr, nameAr: 'العصر', icon: 'partly-sunny-outline' },
  { key: Prayer.Maghrib, nameAr: 'المغرب', icon: 'cloud-outline' },
  { key: Prayer.Isha, nameAr: 'العشاء', icon: 'moon-outline' },
];

function calculationParams() {
  // Umm al-Qura: the official method used in Saudi Arabia.
  return CalculationMethod.UmmAlQura();
}

export function formatTime(date, utcOffsetMinutes) {
  // Shift the instant so getHours()/getMinutes() read wall-clock time in
  // the city's timezone, independent of the device timezone setting.
  const display =
    typeof utcOffsetMinutes === 'number'
      ? new Date(date.getTime() + (utcOffsetMinutes + date.getTimezoneOffset()) * 60000)
      : date;
  let h = display.getHours();
  const m = display.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? 'م' : 'ص';
  h = h % 12 || 12;
  return { time: `${h}:${m}`, period };
}

// Returns the five prayers for `date` at the given coordinates, plus which
// one is next (rolling over to tomorrow's Fajr after Isha).
export function getDayPrayers({ lat, lng, utcOffsetMinutes }, date = new Date()) {
  const coords = new Coordinates(lat, lng);
  const times = new PrayerTimes(coords, date, calculationParams());

  let nextKey = times.nextPrayer(date);
  let nextTime = nextKey === Prayer.None ? null : times.timeForPrayer(nextKey);

  if (nextKey === Prayer.None || nextKey === Prayer.Sunrise) {
    // Sunrise isn't one of the five prayers → the next real one is Dhuhr.
    // After Isha, adhan reports None → roll over to tomorrow's Fajr.
    if (nextKey === Prayer.Sunrise) {
      nextKey = Prayer.Dhuhr;
      nextTime = times.timeForPrayer(Prayer.Dhuhr);
    } else {
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = new PrayerTimes(coords, tomorrow, calculationParams());
      nextKey = Prayer.Fajr;
      nextTime = tomorrowTimes.timeForPrayer(Prayer.Fajr);
    }
  }

  const prayers = PRAYER_META.map((meta) => {
    const t = times.timeForPrayer(meta.key);
    return { ...meta, date: t, ...formatTime(t, utcOffsetMinutes), isNext: meta.key === nextKey };
  });

  return { prayers, nextKey, nextTime };
}

// Bearing from north toward the Kaaba, in degrees.
export function qiblaBearing({ lat, lng }) {
  return Qibla(new Coordinates(lat, lng));
}

// Great-circle distance to Makkah in km.
export function distanceToMakkah({ lat, lng }) {
  const kaaba = { lat: 21.4225, lng: 39.8262 };
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(kaaba.lat - lat);
  const dLng = toRad(kaaba.lng - lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat)) * Math.cos(toRad(kaaba.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// "٢س ١٥د" style countdown text until `target`.
export function countdownText(target, now = new Date()) {
  if (!target) return '';
  let diff = Math.max(0, Math.floor((target - now) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  if (h > 0) return `${h} س ${m} د`;
  if (m > 0) return `${m} د ${s} ث`;
  return `${s} ث`;
}
