// صِلِ — live prayer times widget.
// Same engine as the app: adhan + Umm al-Qura, computed in the browser.

const CITIES = [
  { id: 'jazan', nameAr: 'جازان', lat: 16.8892, lng: 42.5511 },
  { id: 'makkah', nameAr: 'مكة المكرمة', lat: 21.4225, lng: 39.8262 },
  { id: 'madinah', nameAr: 'المدينة المنورة', lat: 24.4672, lng: 39.6111 },
  { id: 'riyadh', nameAr: 'الرياض', lat: 24.7136, lng: 46.6753 },
  { id: 'jeddah', nameAr: 'جدة', lat: 21.4858, lng: 39.1925 },
  { id: 'dammam', nameAr: 'الدمام', lat: 26.3927, lng: 49.9777 },
  { id: 'abha', nameAr: 'أبها', lat: 18.2465, lng: 42.5117 },
  { id: 'tabuk', nameAr: 'تبوك', lat: 28.3835, lng: 36.5662 },
];
const KSA_OFFSET = 180; // Saudi Arabia is UTC+3 year-round
const STORAGE_KEY = 'sil-city';

const $ = (id) => document.getElementById(id);
const widget = $('timesWidget');

const toArabicDigits = (s) => String(s).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

// Wall-clock time in KSA regardless of the visitor's timezone.
function ksaNow(now = new Date()) {
  return new Date(now.getTime() + (KSA_OFFSET + now.getTimezoneOffset()) * 60000);
}

function formatTime(date) {
  const d = ksaNow(date);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? 'م' : 'ص';
  h = h % 12 || 12;
  return `${toArabicDigits(`${h}:${m}`)} ${period}`;
}

function countdownText(target, now) {
  let diff = Math.max(0, Math.floor((target - now) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  const txt = h > 0 ? `${h} س ${m} د ${s} ث` : m > 0 ? `${m} د ${s} ث` : `${s} ث`;
  return toArabicDigits(txt);
}

function distanceToMakkah({ lat, lng }) {
  const kaaba = { lat: 21.4225, lng: 39.8262 };
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(kaaba.lat - lat);
  const dLng = toRad(kaaba.lng - lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat)) * Math.cos(toRad(kaaba.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

async function init() {
  if (!widget) return;
  let Adhan;
  try {
    Adhan = await import('https://cdn.jsdelivr.net/npm/adhan@4.4.4/+esm');
  } catch {
    return; // CDN unreachable → the section quietly stays hidden
  }
  const { Coordinates, CalculationMethod, PrayerTimes, Prayer, Qibla } = Adhan;

  const PRAYER_META = [
    { key: Prayer.Fajr, nameAr: 'الفجر' },
    { key: Prayer.Dhuhr, nameAr: 'الظهر' },
    { key: Prayer.Asr, nameAr: 'العصر' },
    { key: Prayer.Maghrib, nameAr: 'المغرب' },
    { key: Prayer.Isha, nameAr: 'العشاء' },
  ];

  let city = CITIES.find((c) => c.id === localStorage.getItem(STORAGE_KEY)) || CITIES[0];
  let nextTime = null;

  function getDayPrayers(now = new Date()) {
    const coords = new Coordinates(city.lat, city.lng);
    const params = CalculationMethod.UmmAlQura();
    const times = new PrayerTimes(coords, ksaNow(now), params);

    let nextKey = times.nextPrayer(now);
    let next = nextKey === Prayer.None ? null : times.timeForPrayer(nextKey);
    let nextLabel = '';

    if (nextKey === Prayer.Sunrise) {
      // Sunrise isn't one of the five prayers → the next real one is Dhuhr.
      nextKey = Prayer.Dhuhr;
      next = times.timeForPrayer(Prayer.Dhuhr);
    } else if (nextKey === Prayer.None) {
      // After Isha → tomorrow's Fajr.
      const tomorrow = ksaNow(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tTimes = new PrayerTimes(coords, tomorrow, params);
      nextKey = Prayer.Fajr;
      next = tTimes.timeForPrayer(Prayer.Fajr);
      nextLabel = 'فجر الغد';
    }

    const prayers = PRAYER_META.map((meta) => ({
      ...meta,
      time: formatTime(times.timeForPrayer(meta.key)),
      isNext: meta.key === nextKey,
    }));
    const nextMeta = PRAYER_META.find((m) => m.key === nextKey);
    return { prayers, nextName: nextLabel || (nextMeta ? nextMeta.nameAr : ''), nextTime: next };
  }

  function renderChips() {
    $('cityChips').innerHTML = CITIES.map(
      (c) =>
        `<button type="button" aria-pressed="${c.id === city.id}" class="chip${c.id === city.id ? ' active' : ''}" data-id="${c.id}">${c.nameAr}</button>`
    ).join('');
  }

  function render() {
    const now = new Date();
    const { prayers, nextName, nextTime: nt } = getDayPrayers(now);
    nextTime = nt;

    $('nextName').textContent = nextName;
    $('nextCountdown').textContent = nextTime ? countdownText(nextTime, now) : '';
    $('timesGrid').innerHTML = prayers
      .map(
        (p) =>
          `<div class="time-card${p.isNext ? ' next' : ''}"><span class="time-name">${p.nameAr}</span><span class="time-val">${p.time}</span></div>`
      )
      .join('');

    const km = distanceToMakkah(city);
    if (km < 5) {
      $('qiblaLine').innerHTML = 'أنت في رحاب <strong>مكة المكرمة</strong> — قِبلتك حيث أنت 🕋';
    } else {
      const bearing = Math.round(Qibla(new Coordinates(city.lat, city.lng)));
      $('qiblaLine').innerHTML =
        `اتجاه القبلة من ${city.nameAr}: <strong>${toArabicDigits(bearing)}°</strong> · المسافة إلى مكة: <strong>${toArabicDigits(km.toLocaleString('en-US'))} كم</strong>`;
    }

    $('hijriDate').textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Riyadh',
    }).format(now);
  }

  function tick() {
    const now = new Date();
    if (!nextTime || now >= nextTime) {
      render(); // a prayer just came in (or first run) → recompute the day
    } else {
      $('nextCountdown').textContent = countdownText(nextTime, now);
    }
  }

  renderChips();
  render();
  widget.hidden = false;
  setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => {
    // Catch up immediately when the tab becomes visible again.
    if (!document.hidden) tick();
  });

  $('cityChips').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    city = CITIES.find((c) => c.id === btn.dataset.id) || city;
    try { localStorage.setItem(STORAGE_KEY, city.id); } catch {}
    renderChips();
    render();
  });
}

init();
