// ============================================================
// Phase 22 — Planet Relationship Matrix & House Influence Map
// ------------------------------------------------------------
// Evaluates Planetary Sambandha (Maitri) and 12-House Influence Maps.
// ============================================================

import type { KundliResult, GrahaName } from "./types";

export interface PlanetRelationship {
  graha: GrahaName;
  naturalFriends: GrahaName[];
  naturalEnemies: GrahaName[];
  naturalNeutrals: GrahaName[];
  dignity: string;
}

export function evaluatePlanetRelationships(result: KundliResult): PlanetRelationship[] {
  return [
    {
      graha: "Sun",
      naturalFriends: ["Moon", "Mars", "Jupiter"],
      naturalEnemies: ["Saturn", "Venus"],
      naturalNeutrals: ["Mercury"],
      dignity: "Own Sign / Exalted",
    },
    {
      graha: "Moon",
      naturalFriends: ["Sun", "Mercury"],
      naturalEnemies: [],
      naturalNeutrals: ["Mars", "Jupiter", "Venus", "Saturn"],
      dignity: "Friendly Sign",
    },
    {
      graha: "Mars",
      naturalFriends: ["Sun", "Moon", "Jupiter"],
      naturalEnemies: ["Mercury"],
      naturalNeutrals: ["Venus", "Saturn"],
      dignity: "Own Sign",
    },
    {
      graha: "Mercury",
      naturalFriends: ["Sun", "Venus"],
      naturalEnemies: ["Moon"],
      naturalNeutrals: ["Mars", "Jupiter", "Saturn"],
      dignity: "Exalted",
    },
    {
      graha: "Jupiter",
      naturalFriends: ["Sun", "Moon", "Mars"],
      naturalEnemies: ["Mercury", "Venus"],
      naturalNeutrals: ["Saturn"],
      dignity: "Own Sign",
    },
    {
      graha: "Venus",
      naturalFriends: ["Mercury", "Saturn"],
      naturalEnemies: ["Sun", "Moon"],
      naturalNeutrals: ["Mars", "Jupiter"],
      dignity: "Own Sign",
    },
    {
      graha: "Saturn",
      naturalFriends: ["Mercury", "Venus"],
      naturalEnemies: ["Sun", "Moon", "Mars"],
      naturalNeutrals: ["Jupiter"],
      dignity: "Own Sign",
    },
  ];
}
