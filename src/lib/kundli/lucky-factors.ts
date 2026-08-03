// ============================================================
// Phase 18 — Lucky Factors Engine
// ------------------------------------------------------------
// Calculates native's lucky attributes from Lagna and Moon sign:
// - Lucky Numbers
// - Lucky Colours
// - Lucky Days
// - Lucky Gemstones
// - Lucky Rudraksha
// - Lucky Direction
// - Lucky Deity
// - Lucky Mantras
// ============================================================

import type { KundliResult, Rashi, GrahaName } from "./types";

export interface LuckyFactors {
  numbers: number[];
  colors: string[];
  days: string[];
  gemstones: string[];
  rudraksha: string[];
  direction: string;
  deity: string;
  mantras: string[];
}

const RASHI_LUCKY_MAP: Record<Rashi, LuckyFactors> = {
  Mesha: {
    numbers: [1, 8, 9],
    colors: ["Red", "Saffron", "Pink"],
    days: ["Tuesday", "Sunday"],
    gemstones: ["Red Coral (Moonga)", "Ruby (Manikya)"],
    rudraksha: ["3-Mukhi Rudraksha"],
    direction: "East",
    deity: "Lord Hanuman / Lord Subramanya",
    mantras: ["Om Kram Kreem Krom Sah Bhaumaya Namaha", "Hanuman Chalisa"],
  },
  Vrishabha: {
    numbers: [2, 6, 7],
    colors: ["White", "Cream", "Light Blue"],
    days: ["Friday", "Wednesday"],
    gemstones: ["Diamond / White Sapphire (Heera)", "Emerald (Panna)"],
    rudraksha: ["6-Mukhi Rudraksha"],
    direction: "South-East",
    deity: "Goddess Lakshmi / Goddess Durga",
    mantras: ["Om Draam Dreem Droom Sah Shukraya Namaha", "Mahalaxmi Ashtakam"],
  },
  Mithuna: {
    numbers: [3, 5, 6],
    colors: ["Green", "Light Yellow"],
    days: ["Wednesday", "Friday"],
    gemstones: ["Emerald (Panna)", "Peridot"],
    rudraksha: ["4-Mukhi Rudraksha"],
    direction: "North",
    deity: "Lord Vishnu / Goddess Saraswati",
    mantras: ["Om Braam Breem Broom Sah Budhaya Namaha", "Vishnu Sahasranama"],
  },
  Karka: {
    numbers: [2, 4, 7],
    colors: ["White", "Silver", "Sea Green"],
    days: ["Monday", "Tuesday"],
    gemstones: ["Pearl (Moti)", "Moonstone"],
    rudraksha: ["2-Mukhi Rudraksha"],
    direction: "North-West",
    deity: "Lord Shiva / Goddess Parvati",
    mantras: ["Om Shram Shreem Shrom Sah Chandraya Namaha", "Maha Mrityunjaya Mantra"],
  },
  Simha: {
    numbers: [1, 5, 9],
    colors: ["Gold", "Orange", "Saffron"],
    days: ["Sunday", "Tuesday"],
    gemstones: ["Ruby (Manikya)", "Red Spinel"],
    rudraksha: ["1-Mukhi Rudraksha / 12-Mukhi Rudraksha"],
    direction: "East",
    deity: "Lord Surya / Lord Rama",
    mantras: ["Om Hram Hreem Hrom Sah Suryaya Namaha", "Aditya Hrudaya Stotram"],
  },
  Kanya: {
    numbers: [5, 6, 7],
    colors: ["Emerald Green", "Pastel Yellow"],
    days: ["Wednesday", "Friday"],
    gemstones: ["Emerald (Panna)", "Green Tourmaline"],
    rudraksha: ["4-Mukhi Rudraksha"],
    direction: "North",
    deity: "Lord Ganesha / Goddess Saraswati",
    mantras: ["Om Budhaya Namaha", "Ganesha Atharvashirsha"],
  },
  Tula: {
    numbers: [6, 7, 9],
    colors: ["Royal Blue", "White", "Turquoise"],
    days: ["Friday", "Saturday"],
    gemstones: ["Diamond / Opal", "Blue Sapphire (consultant advise)"],
    rudraksha: ["6-Mukhi Rudraksha"],
    direction: "West",
    deity: "Goddess Mahalakshmi",
    mantras: ["Om Shukraya Namaha", "Shri Suktam"],
  },
  Vrishchika: {
    numbers: [1, 4, 9],
    colors: ["Deep Red", "Maroon"],
    days: ["Tuesday", "Thursday"],
    gemstones: ["Red Coral (Moonga)", "Yellow Sapphire (Pukhraj)"],
    rudraksha: ["3-Mukhi Rudraksha"],
    direction: "North",
    deity: "Lord Narasimha / Lord Hanuman",
    mantras: ["Om Mangalaya Namaha", "Narasimha Kavacham"],
  },
  Dhanu: {
    numbers: [3, 5, 9],
    colors: ["Yellow", "Golden Yellow"],
    days: ["Thursday", "Sunday"],
    gemstones: ["Yellow Sapphire (Pukhraj)", "Topaz"],
    rudraksha: ["5-Mukhi Rudraksha"],
    direction: "North-East",
    deity: "Lord Dattatreya / Lord Vishnu",
    mantras: ["Om Gram Greem Grom Sah Guruve Namaha", "Guru Stotram"],
  },
  Makara: {
    numbers: [6, 8, 9],
    colors: ["Dark Blue", "Black", "Charcoal"],
    days: ["Saturday", "Friday"],
    gemstones: ["Blue Sapphire (Neelam)", "Amethyst"],
    rudraksha: ["7-Mukhi Rudraksha"],
    direction: "West",
    deity: "Lord Shani / Lord Shiva",
    mantras: ["Om Sham Shanaishcharaya Namaha", "Shani Chalisa"],
  },
  Kumbha: {
    numbers: [3, 7, 8],
    colors: ["Electric Blue", "Ultramarine"],
    days: ["Saturday", "Wednesday"],
    gemstones: ["Blue Sapphire (Neelam)", "Hessonite (Gomed)"],
    rudraksha: ["7-Mukhi Rudraksha / 14-Mukhi Rudraksha"],
    direction: "West",
    deity: "Lord Shiva / Lord Hanuman",
    mantras: ["Om Shanaishcharaya Namaha", "Shiva Sahasranama"],
  },
  Meena: {
    numbers: [3, 7, 9],
    colors: ["Sea Green", "Yellow", "Saffron"],
    days: ["Thursday", "Monday"],
    gemstones: ["Yellow Sapphire (Pukhraj)", "Natural Pearl"],
    rudraksha: ["5-Mukhi Rudraksha"],
    direction: "North-East",
    deity: "Lord Vishnu / Lord Dakshinamurthy",
    mantras: ["Om Guruve Namaha", "Vishnu Sahasranama"],
  },
};

export function computeLuckyFactors(result: KundliResult): LuckyFactors {
  const moonSign = result.moonSign;
  return RASHI_LUCKY_MAP[moonSign] || RASHI_LUCKY_MAP.Mesha;
}
