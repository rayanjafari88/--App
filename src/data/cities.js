// Cities for prayer-time calculation. `utcOffsetMinutes` makes displayed
// times correct even when the device clock is in another timezone.
// Saudi Arabia is UTC+3 year-round (no daylight saving).
const KSA_OFFSET = 180;

export const cities = [
  { id: 'jazan', nameAr: 'جازان', lat: 16.8892, lng: 42.5511, utcOffsetMinutes: KSA_OFFSET },
  { id: 'makkah', nameAr: 'مكة المكرمة', lat: 21.4225, lng: 39.8262, utcOffsetMinutes: KSA_OFFSET },
  { id: 'madinah', nameAr: 'المدينة المنورة', lat: 24.4672, lng: 39.6111, utcOffsetMinutes: KSA_OFFSET },
  { id: 'riyadh', nameAr: 'الرياض', lat: 24.7136, lng: 46.6753, utcOffsetMinutes: KSA_OFFSET },
  { id: 'jeddah', nameAr: 'جدة', lat: 21.4858, lng: 39.1925, utcOffsetMinutes: KSA_OFFSET },
  { id: 'dammam', nameAr: 'الدمام', lat: 26.3927, lng: 49.9777, utcOffsetMinutes: KSA_OFFSET },
  { id: 'abha', nameAr: 'أبها', lat: 18.2465, lng: 42.5117, utcOffsetMinutes: KSA_OFFSET },
  { id: 'tabuk', nameAr: 'تبوك', lat: 28.3835, lng: 36.5662, utcOffsetMinutes: KSA_OFFSET },
];

export const defaultCity = cities[0]; // جازان
