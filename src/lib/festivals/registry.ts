// ============================================================
// Registry of every festival rule module.
// Adding a new festival = one file under ./rules and one import here.
// ============================================================
import type { FestivalRule } from "./types";

import { diwali } from "./rules/diwali";
import { holi } from "./rules/holi";
import { rakshaBandhan } from "./rules/raksha-bandhan";
import { janmashtami } from "./rules/janmashtami";
import { mahaShivaratri } from "./rules/maha-shivaratri";
import { ganeshChaturthi } from "./rules/ganesh-chaturthi";
import { navratri } from "./rules/navratri";
import { makarSankranti } from "./rules/makar-sankranti";
import { karvaChauth } from "./rules/karva-chauth";
import { ekadashi } from "./rules/ekadashi";
import { purnima } from "./rules/purnima";
import { amavasya } from "./rules/amavasya";

export const RULES: FestivalRule[] = [
  makarSankranti,
  mahaShivaratri,
  holi,
  navratri,
  rakshaBandhan,
  janmashtami,
  ganeshChaturthi,
  karvaChauth,
  diwali,
  ekadashi,
  purnima,
  amavasya,
];
