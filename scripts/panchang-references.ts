// Curated reference dataset for Panchang validation.
// Sources: DrikPanchang.com, timeanddate.com, MyPanchang.com (public data).
// All times are LOCAL for the given city on the given date.

export interface SunTimeRef {
  city: string;
  lat: number;
  lon: number;
  tz: string;
  date: string; // YYYY-MM-DD (local)
  sunrise: string; // HH:MM (local, 24h) — tolerance ±3 min
  sunset: string; // HH:MM (local, 24h) — tolerance ±3 min
  source: string;
}

// Sunrise/Sunset reference points — solstices/equinoxes across cities & years.
export const SUN_REFERENCES: SunTimeRef[] = [
  // Delhi
  {
    city: "New Delhi",
    lat: 28.6139,
    lon: 77.209,
    tz: "Asia/Kolkata",
    date: "2024-06-21",
    sunrise: "05:23",
    sunset: "19:22",
    source: "timeanddate",
  },
  {
    city: "New Delhi",
    lat: 28.6139,
    lon: 77.209,
    tz: "Asia/Kolkata",
    date: "2024-12-21",
    sunrise: "07:10",
    sunset: "17:29",
    source: "timeanddate",
  },
  {
    city: "New Delhi",
    lat: 28.6139,
    lon: 77.209,
    tz: "Asia/Kolkata",
    date: "2024-03-20",
    sunrise: "06:26",
    sunset: "18:34",
    source: "timeanddate",
  },
  {
    city: "New Delhi",
    lat: 28.6139,
    lon: 77.209,
    tz: "Asia/Kolkata",
    date: "2025-01-01",
    sunrise: "07:14",
    sunset: "17:35",
    source: "timeanddate",
  },
  {
    city: "New Delhi",
    lat: 28.6139,
    lon: 77.209,
    tz: "Asia/Kolkata",
    date: "2020-02-29",
    sunrise: "06:52",
    sunset: "18:22",
    source: "timeanddate",
  },
  // Mumbai
  {
    city: "Mumbai",
    lat: 19.076,
    lon: 72.8777,
    tz: "Asia/Kolkata",
    date: "2024-06-21",
    sunrise: "06:02",
    sunset: "19:19",
    source: "timeanddate",
  },
  {
    city: "Mumbai",
    lat: 19.076,
    lon: 72.8777,
    tz: "Asia/Kolkata",
    date: "2024-12-21",
    sunrise: "07:07",
    sunset: "18:04",
    source: "timeanddate",
  },
  // Bengaluru
  {
    city: "Bengaluru",
    lat: 12.9716,
    lon: 77.5946,
    tz: "Asia/Kolkata",
    date: "2024-06-21",
    sunrise: "05:59",
    sunset: "18:47",
    source: "timeanddate",
  },
  {
    city: "Bengaluru",
    lat: 12.9716,
    lon: 77.5946,
    tz: "Asia/Kolkata",
    date: "2024-12-21",
    sunrise: "06:38",
    sunset: "17:57",
    source: "timeanddate",
  },
  // Chennai
  {
    city: "Chennai",
    lat: 13.0827,
    lon: 80.2707,
    tz: "Asia/Kolkata",
    date: "2024-06-21",
    sunrise: "05:43",
    sunset: "18:32",
    source: "timeanddate",
  },
  {
    city: "Chennai",
    lat: 13.0827,
    lon: 80.2707,
    tz: "Asia/Kolkata",
    date: "2024-12-21",
    sunrise: "06:23",
    sunset: "17:41",
    source: "timeanddate",
  },
  // Kolkata
  {
    city: "Kolkata",
    lat: 22.5726,
    lon: 88.3639,
    tz: "Asia/Kolkata",
    date: "2024-06-21",
    sunrise: "04:55",
    sunset: "18:22",
    source: "timeanddate",
  },
  {
    city: "Kolkata",
    lat: 22.5726,
    lon: 88.3639,
    tz: "Asia/Kolkata",
    date: "2024-12-21",
    sunrise: "06:19",
    sunset: "16:57",
    source: "timeanddate",
  },
  // Varanasi
  {
    city: "Varanasi",
    lat: 25.3176,
    lon: 82.9739,
    tz: "Asia/Kolkata",
    date: "2024-06-21",
    sunrise: "05:04",
    sunset: "18:47",
    source: "timeanddate",
  },
  // Non-India / DST edges
  {
    city: "New York",
    lat: 40.7128,
    lon: -74.006,
    tz: "America/New_York",
    date: "2024-06-21",
    sunrise: "05:24",
    sunset: "20:30",
    source: "timeanddate",
  },
  {
    city: "New York",
    lat: 40.7128,
    lon: -74.006,
    tz: "America/New_York",
    date: "2024-12-21",
    sunrise: "07:16",
    sunset: "16:32",
    source: "timeanddate",
  },
  {
    city: "New York",
    lat: 40.7128,
    lon: -74.006,
    tz: "America/New_York",
    date: "2024-03-10",
    sunrise: "07:20",
    sunset: "19:04",
    source: "timeanddate-DST-start",
  },
  {
    city: "London",
    lat: 51.5074,
    lon: -0.1278,
    tz: "Europe/London",
    date: "2024-06-21",
    sunrise: "04:43",
    sunset: "21:22",
    source: "timeanddate",
  },
  {
    city: "London",
    lat: 51.5074,
    lon: -0.1278,
    tz: "Europe/London",
    date: "2024-12-21",
    sunrise: "08:04",
    sunset: "15:54",
    source: "timeanddate",
  },
  {
    city: "Singapore",
    lat: 1.3521,
    lon: 103.8198,
    tz: "Asia/Singapore",
    date: "2024-06-21",
    sunrise: "07:00",
    sunset: "19:12",
    source: "timeanddate",
  },
  {
    city: "Sydney",
    lat: -33.8688,
    lon: 151.2093,
    tz: "Australia/Sydney",
    date: "2024-06-21",
    sunrise: "07:01",
    sunset: "16:53",
    source: "timeanddate",
  },
  {
    city: "Sydney",
    lat: -33.8688,
    lon: 151.2093,
    tz: "Australia/Sydney",
    date: "2024-12-21",
    sunrise: "05:41",
    sunset: "20:07",
    source: "timeanddate",
  },
];

// Festival reference dataset — verified via DrikPanchang (Delhi tithi at sunrise).
// Format: date (local Delhi) → expected tithi index + paksha.
export interface FestivalRef {
  name: string;
  date: string; // YYYY-MM-DD (Delhi local)
  expectedTithiIndex: number; // 1..30
  expectedPaksha: "Shukla" | "Krishna";
  source: string;
}

export const FESTIVAL_REFERENCES: FestivalRef[] = [
  {
    name: "Diwali 2024",
    date: "2024-11-01",
    expectedTithiIndex: 30,
    expectedPaksha: "Krishna",
    source: "DrikPanchang",
  }, // Amavasya
  {
    name: "Diwali 2023",
    date: "2023-11-12",
    expectedTithiIndex: 30,
    expectedPaksha: "Krishna",
    source: "DrikPanchang",
  },
  {
    name: "Holi 2024",
    date: "2024-03-25",
    expectedTithiIndex: 15,
    expectedPaksha: "Shukla",
    source: "DrikPanchang",
  }, // Purnima
  {
    name: "Holi 2025",
    date: "2025-03-14",
    expectedTithiIndex: 15,
    expectedPaksha: "Shukla",
    source: "DrikPanchang",
  },
  {
    name: "Raksha Bandhan 2024",
    date: "2024-08-19",
    expectedTithiIndex: 15,
    expectedPaksha: "Shukla",
    source: "DrikPanchang",
  }, // Purnima
  {
    name: "Guru Purnima 2024",
    date: "2024-07-21",
    expectedTithiIndex: 15,
    expectedPaksha: "Shukla",
    source: "DrikPanchang",
  },
  {
    name: "Makar Sankranti 2024",
    date: "2024-01-15",
    expectedTithiIndex: 4,
    expectedPaksha: "Shukla",
    source: "DrikPanchang",
  },
  {
    name: "Ganesh Chaturthi 2024",
    date: "2024-09-07",
    expectedTithiIndex: 4,
    expectedPaksha: "Shukla",
    source: "DrikPanchang",
  },
  {
    name: "Janmashtami 2024",
    date: "2024-08-26",
    expectedTithiIndex: 23,
    expectedPaksha: "Krishna",
    source: "DrikPanchang",
  }, // Ashtami K
  {
    name: "Ram Navami 2024",
    date: "2024-04-17",
    expectedTithiIndex: 9,
    expectedPaksha: "Shukla",
    source: "DrikPanchang",
  },
];
