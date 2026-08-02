// ============================================================
// Service — Panchang & Muhurat
// ------------------------------------------------------------
// Pure orchestration over src/lib/panchang.ts. No new astronomy.
// ============================================================

import {
  getTithi,
  getNakshatra,
  getYoga,
  getKarana,
  getSunTimes,
  getMoonTimes,
  getKaalWindow,
  getChoghadiya,
  getAbhijitMuhurat,
  getMoonRashi,
  getLocalWeekday,
  getLuckyForDay,
  getFastingInfo,
  getDeityOfDay,
  getAlmanac,
  getUpcomingEclipses,
  getTransits,
  startOfLocalDay,
  WEEKDAYS,
  type LatLon,
} from "@/lib/panchang";

export interface PanchangQuery {
  date: string;
  latitude: number;
  longitude: number;
  timezone: string;
  place?: string;
}

function refDate(date: string, tz: string): Date {
  const noonLocal = new Date(`${date}T12:00:00Z`);
  return startOfLocalDay(noonLocal, tz);
}

function loc(q: PanchangQuery): LatLon {
  return { label: q.place ?? "Custom", lat: q.latitude, lon: q.longitude, tz: q.timezone };
}

export function panchangForDay(q: PanchangQuery) {
  const d = refDate(q.date, q.timezone);
  const place = loc(q);
  const tithi = getTithi(d);
  const weekday = getLocalWeekday(d, q.timezone);
  const nakshatra = getNakshatra(d);

  return {
    date: q.date,
    location: {
      place: q.place ?? "Custom",
      latitude: q.latitude,
      longitude: q.longitude,
      timezone: q.timezone,
    },
    weekday: { index: weekday, name: WEEKDAYS[weekday] },
    tithi,
    nakshatra,
    yoga: getYoga(d),
    karana: getKarana(d),
    moonRashi: getMoonRashi(d),
    sun: getSunTimes(d, place),
    moon: getMoonTimes(d, place),
    inauspicious: {
      rahuKaal: getKaalWindow("rahu", d, place),
      yamaganda: getKaalWindow("yama", d, place),
      gulikaKaal: getKaalWindow("gulika", d, place),
    },
    auspicious: { abhijit: getAbhijitMuhurat(d, place) },
    lucky: getLuckyForDay(weekday, nakshatra.lord),
    fasting: getFastingInfo(tithi, weekday),
    deity: getDeityOfDay(weekday),
  };
}

export function muhuratForDay(q: PanchangQuery) {
  const d = refDate(q.date, q.timezone);
  const place = loc(q);
  return {
    date: q.date,
    choghadiya: getChoghadiya(d, place),
    abhijit: getAbhijitMuhurat(d, place),
    avoid: {
      rahuKaal: getKaalWindow("rahu", d, place),
      yamaganda: getKaalWindow("yama", d, place),
      gulikaKaal: getKaalWindow("gulika", d, place),
    },
    sun: getSunTimes(d, place),
  };
}

export function almanacForDay(q: PanchangQuery) {
  const d = refDate(q.date, q.timezone);
  return {
    date: q.date,
    almanac: getAlmanac(d),
    transits: getTransits(d),
    eclipses: getUpcomingEclipses(d, 4),
  };
}
