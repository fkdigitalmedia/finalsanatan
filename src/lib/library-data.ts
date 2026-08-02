// Reference datasets powering Phase 6 tools. Client-safe, tree-shakeable.

/* ─────────────── MANTRAS ─────────────── */
export interface MantraEntry {
  slug: string;
  title: string;
  devanagari: string;
  iast: string;
  meaning: string;
  deity: string;
  type:
    | "beej"
    | "invocation"
    | "gayatri"
    | "protection"
    | "healing"
    | "prosperity"
    | "wisdom"
    | "moksha";
  benefits: string;
  count?: number;
}

export const MANTRAS: MantraEntry[] = [
  {
    slug: "om",
    title: "Om (Pranava)",
    devanagari: "ॐ",
    iast: "oṁ",
    meaning: "The primordial sound; the essence of Brahman.",
    deity: "Brahman",
    type: "invocation",
    benefits: "Anchors awareness in the Self; the seed of all mantras.",
    count: 108,
  },
  {
    slug: "om-namah-shivaya",
    title: "Om Namah Shivaya",
    devanagari: "ॐ नमः शिवाय",
    iast: "oṁ namaḥ śivāya",
    meaning: "Salutations to Shiva.",
    deity: "Shiva",
    type: "invocation",
    benefits: "The five-syllable mantra; grants liberation from the ego.",
    count: 108,
  },
  {
    slug: "om-namo-narayanaya",
    title: "Om Namo Narayanaya",
    devanagari: "ॐ नमो नारायणाय",
    iast: "oṁ namo nārāyaṇāya",
    meaning: "Salutations to Narayana (Vishnu).",
    deity: "Vishnu",
    type: "invocation",
    benefits: "The Ashtakshara — brings peace, protection and prosperity.",
    count: 108,
  },
  {
    slug: "om-namo-bhagavate-vasudevaya",
    title: "Om Namo Bhagavate Vasudevaya",
    devanagari: "ॐ नमो भगवते वासुदेवाय",
    iast: "oṁ namo bhagavate vāsudevāya",
    meaning: "Salutations to Bhagavan Vasudeva (Krishna).",
    deity: "Krishna",
    type: "invocation",
    benefits: "The Dvadashakshara; awakens bhakti and dispels illusion.",
  },
  {
    slug: "gayatri",
    title: "Gayatri Mantra",
    devanagari: "ॐ भूर्भुवः स्वः। तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि। धियो यो नः प्रचोदयात्॥",
    iast: "oṁ bhūr bhuvaḥ svaḥ | tat savitur vareṇyaṁ bhargo devasya dhīmahi | dhiyo yo naḥ pracodayāt ||",
    meaning: "We meditate on the effulgent glory of Savitar; may He inspire our intellect.",
    deity: "Savitar (Sun)",
    type: "gayatri",
    benefits: "The mother of the Vedas; awakens the intellect and purifies.",
    count: 108,
  },
  {
    slug: "mahamrityunjaya",
    title: "Mahamrityunjaya Mantra",
    devanagari:
      "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥",
    iast: "oṁ tryambakaṁ yajāmahe sugandhiṁ puṣṭi-vardhanam | urvārukam iva bandhanān mṛtyor mukṣīya mā'mṛtāt ||",
    meaning: "We worship the three-eyed one; may He liberate us from the bondage of death.",
    deity: "Shiva",
    type: "healing",
    benefits: "Grants healing, longevity and freedom from fear of death.",
    count: 108,
  },
  {
    slug: "om-gam-ganapataye",
    title: "Ganesha Beej",
    devanagari: "ॐ गं गणपतये नमः",
    iast: "oṁ gaṁ gaṇapataye namaḥ",
    meaning: "Salutations to Ganapati.",
    deity: "Ganesha",
    type: "beej",
    benefits: "Removes obstacles; recite at the start of every new venture.",
    count: 108,
  },
  {
    slug: "om-shreem",
    title: "Lakshmi Beej",
    devanagari: "ॐ श्रीं महालक्ष्म्यै नमः",
    iast: "oṁ śrīṁ mahā-lakṣmyai namaḥ",
    meaning: "Salutations to Mahalakshmi.",
    deity: "Lakshmi",
    type: "prosperity",
    benefits: "Attracts abundance, harmony and grace.",
    count: 108,
  },
  {
    slug: "om-aim",
    title: "Saraswati Beej",
    devanagari: "ॐ ऐं सरस्वत्यै नमः",
    iast: "oṁ aiṁ sarasvatyai namaḥ",
    meaning: "Salutations to Saraswati.",
    deity: "Saraswati",
    type: "wisdom",
    benefits: "Awakens learning, speech and creative wisdom.",
  },
  {
    slug: "om-dum",
    title: "Durga Beej",
    devanagari: "ॐ दुं दुर्गायै नमः",
    iast: "oṁ duṁ durgāyai namaḥ",
    meaning: "Salutations to Durga.",
    deity: "Durga",
    type: "protection",
    benefits: "Removes danger; grants courage and protection.",
  },
  {
    slug: "om-kleem",
    title: "Krishna / Kama Beej",
    devanagari: "ॐ क्लीं कृष्णाय नमः",
    iast: "oṁ klīṁ kṛṣṇāya namaḥ",
    meaning: "Salutations to Krishna.",
    deity: "Krishna",
    type: "beej",
    benefits: "Awakens divine love and bhakti.",
  },
  {
    slug: "om-hreem",
    title: "Bhuvaneshwari Beej",
    devanagari: "ॐ ह्रीं",
    iast: "oṁ hrīṁ",
    meaning: "Bhuvaneshwari's seed sound.",
    deity: "Devi",
    type: "beej",
    benefits: "Awakens shakti; connects to Devi's cosmic form.",
  },
  {
    slug: "om-hraum",
    title: "Shiva Beej",
    devanagari: "ॐ ह्रौं नमः शिवाय",
    iast: "oṁ hrauṁ namaḥ śivāya",
    meaning: "Salutations to Shiva.",
    deity: "Shiva",
    type: "beej",
    benefits: "Kindles inner Shiva-consciousness.",
  },
  {
    slug: "om-hum",
    title: "Hanuman Beej",
    devanagari: "ॐ हं हनुमते नमः",
    iast: "oṁ haṁ hanumate namaḥ",
    meaning: "Salutations to Hanuman.",
    deity: "Hanuman",
    type: "protection",
    benefits: "Dispels fear; grants courage and vitality.",
  },
  {
    slug: "hare-krishna",
    title: "Hare Krishna Mahamantra",
    devanagari: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे॥",
    iast: "hare kṛṣṇa hare kṛṣṇa kṛṣṇa kṛṣṇa hare hare | hare rāma hare rāma rāma rāma hare hare ||",
    meaning: "O energy of Hari, O Krishna, O Rama — please engage me in Your service.",
    deity: "Krishna-Rama",
    type: "invocation",
    benefits: "The Kali-yuga mahamantra; awakens divine love.",
  },
  {
    slug: "om-shanti",
    title: "Shanti Path",
    devanagari: "ॐ शान्तिः शान्तिः शान्तिः॥",
    iast: "oṁ śāntiḥ śāntiḥ śāntiḥ ||",
    meaning: "Peace, peace, peace.",
    deity: "Universal",
    type: "invocation",
    benefits: "Invokes peace at all three levels — inner, outer and cosmic.",
  },
  {
    slug: "asato-ma",
    title: "Asato Ma",
    devanagari: "ॐ असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय॥",
    iast: "oṁ asato mā sad-gamaya | tamaso mā jyotir-gamaya | mṛtyor mā amṛtaṁ gamaya ||",
    meaning:
      "Lead me from the unreal to the real; from darkness to light; from death to immortality.",
    deity: "Brahman",
    type: "moksha",
    benefits: "The Pavamana mantra; awakens the yearning for the eternal.",
  },
  {
    slug: "om-namo-bhagavate-rudraya",
    title: "Rudra Invocation",
    devanagari: "ॐ नमो भगवते रुद्राय",
    iast: "oṁ namo bhagavate rudrāya",
    meaning: "Salutations to Bhagavan Rudra.",
    deity: "Rudra",
    type: "invocation",
    benefits: "Invokes Rudra's fierce grace; removes negativity.",
  },
  {
    slug: "om-tare-tuttare",
    title: "Tara Mantra",
    devanagari: "ॐ तारे तुत्तारे तुरे स्वाहा",
    iast: "oṁ tāre tuttāre ture svāhā",
    meaning: "Salutations to Tara, the swift liberator.",
    deity: "Tara",
    type: "protection",
    benefits: "Grants swift protection and liberation from suffering.",
  },
  {
    slug: "om-krim",
    title: "Kali Beej",
    devanagari: "ॐ क्रीं कालिकायै नमः",
    iast: "oṁ krīṁ kālikāyai namaḥ",
    meaning: "Salutations to Kali.",
    deity: "Kali",
    type: "beej",
    benefits: "Cuts through illusion; awakens fierce clarity.",
  },
  {
    slug: "om-namo-vishvakarmane",
    title: "Vishwakarma Mantra",
    devanagari: "ॐ आधार शक्तपे नमः",
    iast: "oṁ ādhāra śaktape namaḥ",
    meaning: "Salutations to the divine architect.",
    deity: "Vishwakarma",
    type: "prosperity",
    benefits: "Blesses tools, workplaces and craft.",
  },
  {
    slug: "om-namo-narayan",
    title: "Vishnu Sudarshan",
    devanagari: "ॐ सुदर्शनाय नमः",
    iast: "oṁ sudarśanāya namaḥ",
    meaning: "Salutations to the Sudarshana chakra.",
    deity: "Vishnu",
    type: "protection",
    benefits: "Cuts obstacles and negativity; protective shield.",
  },
  {
    slug: "om-surya",
    title: "Surya Mantra",
    devanagari: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
    iast: "oṁ hrāṁ hrīṁ hrauṁ saḥ sūryāya namaḥ",
    meaning: "Salutations to Surya.",
    deity: "Surya",
    type: "healing",
    benefits: "Brings vitality, confidence and clarity.",
  },
  {
    slug: "om-chandra",
    title: "Chandra Mantra",
    devanagari: "ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः",
    iast: "oṁ śrāṁ śrīṁ śrauṁ saḥ candrāya namaḥ",
    meaning: "Salutations to Chandra.",
    deity: "Chandra",
    type: "healing",
    benefits: "Calms the mind; soothes emotions.",
  },
  {
    slug: "om-mangalaya",
    title: "Mangal Mantra",
    devanagari: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    iast: "oṁ krāṁ krīṁ krauṁ saḥ bhaumāya namaḥ",
    meaning: "Salutations to Mangala.",
    deity: "Mangal",
    type: "protection",
    benefits: "Strength, courage and victory.",
  },
  {
    slug: "om-guru",
    title: "Guru Mantra",
    devanagari: "ॐ बृं बृहस्पतये नमः",
    iast: "oṁ bṛṁ bṛhaspataye namaḥ",
    meaning: "Salutations to Brihaspati.",
    deity: "Guru",
    type: "wisdom",
    benefits: "Wisdom, learning and dharmic guidance.",
  },
  {
    slug: "om-shukra",
    title: "Shukra Mantra",
    devanagari: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
    iast: "oṁ drāṁ drīṁ drauṁ saḥ śukrāya namaḥ",
    meaning: "Salutations to Shukra.",
    deity: "Shukra",
    type: "prosperity",
    benefits: "Love, harmony and material abundance.",
  },
  {
    slug: "om-shani",
    title: "Shani Mantra",
    devanagari: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
    iast: "oṁ prāṁ prīṁ prauṁ saḥ śanaiścarāya namaḥ",
    meaning: "Salutations to Shani.",
    deity: "Shani",
    type: "protection",
    benefits: "Pacifies karmic hardship; grants patience.",
  },
  {
    slug: "om-rahave",
    title: "Rahu Mantra",
    devanagari: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः",
    iast: "oṁ bhrāṁ bhrīṁ bhrauṁ saḥ rāhave namaḥ",
    meaning: "Salutations to Rahu.",
    deity: "Rahu",
    type: "protection",
    benefits: "Neutralizes Rahu's disruptive influence.",
  },
  {
    slug: "om-ketave",
    title: "Ketu Mantra",
    devanagari: "ॐ स्रां स्रीं स्रौं सः केतवे नमः",
    iast: "oṁ srāṁ srīṁ srauṁ saḥ ketave namaḥ",
    meaning: "Salutations to Ketu.",
    deity: "Ketu",
    type: "moksha",
    benefits: "Awakens spiritual insight; dissolves confusion.",
  },
];

/* ─────────────── DEITIES ─────────────── */
export interface Deity {
  slug: string;
  name: string;
  devanagari: string;
  domain: string;
  consort?: string;
  vehicle?: string;
  weapons?: string;
  scripture: string;
  significance: string;
  primary_mantra: string;
}

export const DEITIES: Deity[] = [
  {
    slug: "brahma",
    name: "Brahma",
    devanagari: "ब्रह्मा",
    domain: "Creator of the universe",
    consort: "Saraswati",
    vehicle: "Hamsa (swan)",
    weapons: "Kamandalu, akshamala",
    scripture: "Puranas",
    significance: "The first of the Trimurti; source of the Vedas.",
    primary_mantra: "ॐ ब्रह्मणे नमः",
  },
  {
    slug: "vishnu",
    name: "Vishnu",
    devanagari: "विष्णु",
    domain: "Preserver of the cosmos",
    consort: "Lakshmi",
    vehicle: "Garuda",
    weapons: "Sudarshan chakra, shankh, gada, padma",
    scripture: "Vishnu Purana, Bhagavata Purana",
    significance: "The sustainer; manifests as ten avatars.",
    primary_mantra: "ॐ नमो नारायणाय",
  },
  {
    slug: "shiva",
    name: "Shiva (Mahadev)",
    devanagari: "शिव",
    domain: "The transformer; adiyogi",
    consort: "Parvati",
    vehicle: "Nandi",
    weapons: "Trishul, damaru",
    scripture: "Shiva Purana, Linga Purana",
    significance: "The auspicious one; grants moksha.",
    primary_mantra: "ॐ नमः शिवाय",
  },
  {
    slug: "ganesha",
    name: "Ganesha",
    devanagari: "गणेश",
    domain: "Remover of obstacles; lord of beginnings",
    vehicle: "Mushak (mouse)",
    weapons: "Ankush, pasha, modak",
    scripture: "Ganesha Purana",
    significance: "Worshipped first before any deity.",
    primary_mantra: "ॐ गं गणपतये नमः",
  },
  {
    slug: "lakshmi",
    name: "Lakshmi",
    devanagari: "लक्ष्मी",
    domain: "Prosperity, abundance, grace",
    consort: "Vishnu",
    vehicle: "Ulook (owl)",
    scripture: "Sri Sukta, Lakshmi Tantra",
    significance: "Bestows wealth on all planes.",
    primary_mantra: "ॐ श्रीं महालक्ष्म्यै नमः",
  },
  {
    slug: "saraswati",
    name: "Saraswati",
    devanagari: "सरस्वती",
    domain: "Learning, arts, wisdom",
    consort: "Brahma",
    vehicle: "Hamsa (swan)",
    scripture: "Rigveda, Devi Bhagavata",
    significance: "Mother of the Vedas; goddess of speech.",
    primary_mantra: "ॐ ऐं सरस्वत्यै नमः",
  },
  {
    slug: "durga",
    name: "Durga",
    devanagari: "दुर्गा",
    domain: "Divine mother; slayer of evil",
    vehicle: "Simha (lion)",
    weapons: "Trishul, chakra, gada, khadga",
    scripture: "Devi Mahatmyam",
    significance: "Manifests as nine forms during Navratri.",
    primary_mantra: "ॐ दुं दुर्गायै नमः",
  },
  {
    slug: "kali",
    name: "Kali",
    devanagari: "काली",
    domain: "Time, transformation, destruction of ego",
    consort: "Shiva",
    weapons: "Khadga, severed head, lotus, abhaya",
    scripture: "Devi Bhagavata, Mahanirvana Tantra",
    significance: "The fierce mother; grants liberation.",
    primary_mantra: "ॐ क्रीं कालिकायै नमः",
  },
  {
    slug: "hanuman",
    name: "Hanuman",
    devanagari: "हनुमान",
    domain: "Devotion, strength, protection",
    scripture: "Ramayana, Hanuman Chalisa",
    significance: "Chiranjivi; the greatest bhakta of Rama.",
    primary_mantra: "ॐ हं हनुमते नमः",
  },
  {
    slug: "rama",
    name: "Rama",
    devanagari: "राम",
    domain: "Ideal king; dharma personified",
    consort: "Sita",
    weapons: "Kodanda (bow)",
    scripture: "Ramayana",
    significance: "Seventh avatar of Vishnu; maryada purushottama.",
    primary_mantra: "ॐ राम रामाय नमः",
  },
  {
    slug: "krishna",
    name: "Krishna",
    devanagari: "कृष्ण",
    domain: "Divine love, dharma, yoga",
    consort: "Radha, Rukmini",
    scripture: "Bhagavad Gita, Bhagavata Purana",
    significance: "Eighth avatar of Vishnu; complete purnavatar.",
    primary_mantra: "ॐ क्लीं कृष्णाय नमः",
  },
  {
    slug: "surya",
    name: "Surya",
    devanagari: "सूर्य",
    domain: "Sun; source of life and vitality",
    vehicle: "Chariot of seven horses",
    scripture: "Aditya Hridayam, Surya Purana",
    significance: "Visible form of the divine; father of Yama and Manu.",
    primary_mantra: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
  },
  {
    slug: "chandra",
    name: "Chandra",
    devanagari: "चन्द्र",
    domain: "Moon; mind and emotion",
    scripture: "Puranas",
    significance: "Governs the mind; consort of the 27 nakshatras.",
    primary_mantra: "ॐ सोम सोमाय नमः",
  },
  {
    slug: "kartikeya",
    name: "Kartikeya (Murugan)",
    devanagari: "कार्तिकेय",
    domain: "War, wisdom, youth",
    consort: "Valli, Devasena",
    vehicle: "Mayura (peacock)",
    weapons: "Vel (spear)",
    scripture: "Skanda Purana",
    significance: "Elder son of Shiva; commander of the devas.",
    primary_mantra: "ॐ शरवण भवाय नमः",
  },
  {
    slug: "parvati",
    name: "Parvati",
    devanagari: "पार्वती",
    domain: "Divine mother; shakti",
    consort: "Shiva",
    scripture: "Shiva Purana, Devi Bhagavata",
    significance: "Adi Shakti; expresses as Durga, Kali, Uma.",
    primary_mantra: "ॐ पार्वत्यै नमः",
  },
  {
    slug: "narasimha",
    name: "Narasimha",
    devanagari: "नरसिंह",
    domain: "Fierce protector; destroyer of evil",
    scripture: "Bhagavata Purana",
    significance: "Fourth avatar of Vishnu; protector of bhaktas.",
    primary_mantra: "ॐ नमो भगवते नरसिंहाय",
  },
  {
    slug: "vamana",
    name: "Vamana",
    devanagari: "वामन",
    domain: "Cosmic order; humility",
    scripture: "Bhagavata Purana",
    significance: "Fifth avatar of Vishnu; humbles Bali.",
    primary_mantra: "ॐ वामनाय नमः",
  },
  {
    slug: "parashurama",
    name: "Parashurama",
    devanagari: "परशुराम",
    domain: "Warrior sage; dharma warrior",
    scripture: "Puranas, Mahabharata",
    significance: "Sixth avatar; chiranjivi.",
    primary_mantra: "ॐ परशुरामाय नमः",
  },
  {
    slug: "buddha",
    name: "Buddha (as avatar)",
    devanagari: "बुद्ध",
    domain: "Compassion; awakening",
    scripture: "Bhagavata Purana",
    significance: "Ninth avatar in the Vaishnava lineage.",
    primary_mantra: "ॐ बुद्धाय नमः",
  },
  {
    slug: "kalki",
    name: "Kalki",
    devanagari: "कल्कि",
    domain: "Future avatar; end of Kali yuga",
    scripture: "Kalki Purana",
    significance: "The prophesied tenth avatar of Vishnu.",
    primary_mantra: "ॐ कल्किने नमः",
  },
  {
    slug: "radha",
    name: "Radha",
    devanagari: "राधा",
    domain: "Divine love; hladini shakti",
    consort: "Krishna",
    scripture: "Bhagavata Purana, Brahma Vaivarta",
    significance: "The soul of Krishna's love.",
    primary_mantra: "ॐ श्री राधायै नमः",
  },
  {
    slug: "sita",
    name: "Sita",
    devanagari: "सीता",
    domain: "Purity, devotion, patience",
    consort: "Rama",
    scripture: "Ramayana",
    significance: "Ayonija; incarnation of Lakshmi.",
    primary_mantra: "ॐ जानक्यै नमः",
  },
];

/* ─────────────── EKADASHI ─────────────── */
export interface EkadashiEntry {
  name: string;
  date: string;
  month: number;
  description: string;
}
export const EKADASHIS_2026: EkadashiEntry[] = [
  {
    name: "Pausha Putrada Ekadashi",
    date: "2026-01-08",
    month: 1,
    description: "Blessing for progeny; recite Vishnu Sahasranama.",
  },
  {
    name: "Shattila Ekadashi",
    date: "2026-01-24",
    month: 1,
    description: "Offer sesame (tila) in six forms; purifies past karma.",
  },
  {
    name: "Jaya Ekadashi",
    date: "2026-02-07",
    month: 2,
    description: "Frees from ghostly and karmic bondage.",
  },
  {
    name: "Vijaya Ekadashi",
    date: "2026-02-22",
    month: 2,
    description: "Grants victory in righteous endeavours.",
  },
  {
    name: "Amalaki Ekadashi",
    date: "2026-03-09",
    month: 3,
    description: "Worship of the amla tree; grants moksha.",
  },
  {
    name: "Papmochani Ekadashi",
    date: "2026-03-24",
    month: 3,
    description: "Frees from grievous sin; deep prayaschitta.",
  },
  {
    name: "Kamada Ekadashi",
    date: "2026-04-07",
    month: 4,
    description: "Fulfils righteous desires; first of the Chaitra year.",
  },
  {
    name: "Varuthini Ekadashi",
    date: "2026-04-23",
    month: 4,
    description: "Grants protection like divine armour.",
  },
  {
    name: "Mohini Ekadashi",
    date: "2026-05-07",
    month: 5,
    description: "Frees from moha (illusion) and worldly attachment.",
  },
  {
    name: "Apara Ekadashi",
    date: "2026-05-22",
    month: 5,
    description: "Grants boundless spiritual merit.",
  },
  {
    name: "Nirjala Ekadashi",
    date: "2026-06-06",
    month: 6,
    description: "Fasting without water; the most austere ekadashi.",
  },
  {
    name: "Yogini Ekadashi",
    date: "2026-06-21",
    month: 6,
    description: "Redeems the sins of past births.",
  },
  {
    name: "Devshayani Ekadashi",
    date: "2026-07-05",
    month: 7,
    description: "Vishnu enters yoga-nidra; start of Chaturmasya.",
  },
  {
    name: "Kamika Ekadashi",
    date: "2026-07-20",
    month: 7,
    description: "Fulfils sattvic desires; heals ancestral karma.",
  },
  {
    name: "Putrada Ekadashi (Shravana)",
    date: "2026-08-04",
    month: 8,
    description: "Blessing for children and family harmony.",
  },
  {
    name: "Aja Ekadashi",
    date: "2026-08-19",
    month: 8,
    description: "Removes deep-rooted sin; grants moksha.",
  },
  {
    name: "Parivartini Ekadashi",
    date: "2026-09-02",
    month: 9,
    description: "Vishnu turns in yoga-nidra; midpoint of Chaturmasya.",
  },
  {
    name: "Indira Ekadashi",
    date: "2026-09-17",
    month: 9,
    description: "Liberates ancestors from lower realms.",
  },
  {
    name: "Papankusha Ekadashi",
    date: "2026-10-01",
    month: 10,
    description: "Cuts down accumulated sin like an ankush.",
  },
  {
    name: "Rama Ekadashi",
    date: "2026-10-16",
    month: 10,
    description: "Precedes Diwali; grants Sri Rama's grace.",
  },
  {
    name: "Devutthana Ekadashi",
    date: "2026-11-01",
    month: 11,
    description: "Vishnu awakens from yoga-nidra; Tulsi Vivah begins.",
  },
  {
    name: "Utpanna Ekadashi",
    date: "2026-11-15",
    month: 11,
    description: "The birth of Ekadashi Devi; start of Ekadashi vrat.",
  },
  {
    name: "Mokshada Ekadashi",
    date: "2026-12-01",
    month: 12,
    description: "Grants moksha; day of Bhagavad Gita's revelation.",
  },
  {
    name: "Saphala Ekadashi",
    date: "2026-12-15",
    month: 12,
    description: "Makes all endeavours fruitful.",
  },
];

/* ─────────────── PURNIMA / AMAVASYA ─────────────── */
export interface LunarDay {
  name: string;
  date: string;
  month: number;
  kind: "Purnima" | "Amavasya";
  description: string;
}
export const LUNAR_DAYS_2026: LunarDay[] = [
  {
    name: "Paush Purnima",
    date: "2026-01-03",
    month: 1,
    kind: "Purnima",
    description: "Holy bathing at Prayag; start of Magh Mela.",
  },
  {
    name: "Magh Purnima",
    date: "2026-02-01",
    month: 2,
    kind: "Purnima",
    description: "Peak of Magh snana; grants great punya.",
  },
  {
    name: "Phalgun Purnima",
    date: "2026-03-03",
    month: 3,
    kind: "Purnima",
    description: "Holika Dahan; celebrates victory of devotion.",
  },
  {
    name: "Chaitra Purnima",
    date: "2026-04-01",
    month: 4,
    kind: "Purnima",
    description: "Hanuman Jayanti; celebrated across India.",
  },
  {
    name: "Vaishakh Purnima",
    date: "2026-04-30",
    month: 4,
    kind: "Purnima",
    description: "Buddha Purnima; day of Vishnu's Buddha avatar.",
  },
  {
    name: "Jyeshtha Purnima",
    date: "2026-05-30",
    month: 5,
    kind: "Purnima",
    description: "Vat Purnima; married women's vrat.",
  },
  {
    name: "Ashadha Purnima",
    date: "2026-06-29",
    month: 6,
    kind: "Purnima",
    description: "Guru Purnima; day to honour spiritual teachers.",
  },
  {
    name: "Shravan Purnima",
    date: "2026-07-28",
    month: 7,
    kind: "Purnima",
    description: "Raksha Bandhan; sacred thread of protection.",
  },
  {
    name: "Bhadrapada Purnima",
    date: "2026-08-27",
    month: 8,
    kind: "Purnima",
    description: "Onam nal; start of Pitru Paksha.",
  },
  {
    name: "Ashwin Purnima",
    date: "2026-09-26",
    month: 9,
    kind: "Purnima",
    description: "Sharad Purnima; Kojagari Lakshmi puja.",
  },
  {
    name: "Kartik Purnima",
    date: "2026-10-25",
    month: 10,
    kind: "Purnima",
    description: "Dev Diwali; illumination of Kashi ghats.",
  },
  {
    name: "Margashirsha Purnima",
    date: "2026-11-24",
    month: 11,
    kind: "Purnima",
    description: "Dattatreya Jayanti in some regions.",
  },
  {
    name: "Paush Amavasya",
    date: "2026-01-18",
    month: 1,
    kind: "Amavasya",
    description: "Auspicious for pitru tarpan.",
  },
  {
    name: "Mauni Amavasya",
    date: "2026-02-17",
    month: 2,
    kind: "Amavasya",
    description: "Silence and holy dip at Sangam.",
  },
  {
    name: "Phalgun Amavasya",
    date: "2026-03-19",
    month: 3,
    kind: "Amavasya",
    description: "Vrat and dana for ancestors.",
  },
  {
    name: "Chaitra Amavasya",
    date: "2026-04-17",
    month: 4,
    kind: "Amavasya",
    description: "Bhalachandra amavasya; special for pitru shanti.",
  },
  {
    name: "Vaishakh Amavasya",
    date: "2026-05-16",
    month: 5,
    kind: "Amavasya",
    description: "Shani Jayanti; propitiation of Shani.",
  },
  {
    name: "Jyeshtha Amavasya",
    date: "2026-06-14",
    month: 6,
    kind: "Amavasya",
    description: "Vat Savitri vrat in West India.",
  },
  {
    name: "Ashadha Amavasya",
    date: "2026-07-13",
    month: 7,
    kind: "Amavasya",
    description: "Hariyali amavasya; planting trees.",
  },
  {
    name: "Shravan Amavasya",
    date: "2026-08-12",
    month: 8,
    kind: "Amavasya",
    description: "Deep amavasya; light lamps for ancestors.",
  },
  {
    name: "Bhadrapada Amavasya",
    date: "2026-09-11",
    month: 9,
    kind: "Amavasya",
    description: "Pithori amavasya; matru puja.",
  },
  {
    name: "Ashwin Amavasya",
    date: "2026-10-10",
    month: 10,
    kind: "Amavasya",
    description: "Sarva Pitru Amavasya; culmination of Pitru Paksha.",
  },
  {
    name: "Kartik Amavasya",
    date: "2026-11-08",
    month: 11,
    kind: "Amavasya",
    description: "Diwali; Lakshmi puja night.",
  },
  {
    name: "Margashirsha Amavasya",
    date: "2026-12-08",
    month: 12,
    kind: "Amavasya",
    description: "Bhairav puja and pitru dana.",
  },
];

/* ─────────────── PRADOSH & SANKASHTI ─────────────── */
export interface DateLine {
  name: string;
  date: string;
  description: string;
}
export const PRADOSH_2026: DateLine[] = [
  {
    name: "Shukla Pradosh — Jan",
    date: "2026-01-01",
    description: "Trayodashi tithi; ritual for Shiva at pradosh kala.",
  },
  {
    name: "Krishna Pradosh — Jan",
    date: "2026-01-16",
    description: "Krishna paksha pradosh; contemplation of Shiva.",
  },
  {
    name: "Shukla Pradosh — Feb",
    date: "2026-01-31",
    description: "Recite Shiv Chalisa at twilight.",
  },
  {
    name: "Som Pradosh — Feb",
    date: "2026-02-14",
    description: "Falls on Monday — highly meritorious.",
  },
  { name: "Shukla Pradosh — Mar", date: "2026-03-02", description: "Rudrabhishek recommended." },
  {
    name: "Krishna Pradosh — Mar",
    date: "2026-03-16",
    description: "Recite Mahamrityunjaya mantra.",
  },
  {
    name: "Bhaum Pradosh — Apr",
    date: "2026-04-14",
    description: "Tuesday pradosh; grants freedom from debt.",
  },
  { name: "Shukla Pradosh — May", date: "2026-04-29", description: "Recite Lingashtakam." },
  { name: "Krishna Pradosh — May", date: "2026-05-13", description: "Meditate on Rudra." },
  {
    name: "Shani Pradosh — Jun",
    date: "2026-06-13",
    description: "Saturday pradosh; grants progeny.",
  },
];
export const SANKASHTI_2026: DateLine[] = [
  { name: "Sankashti — Jan", date: "2026-01-07", description: "Ganesha vrat till moonrise." },
  {
    name: "Sankashti — Feb",
    date: "2026-02-05",
    description: "Chant Sankata Nashan Ganesh Stotra.",
  },
  { name: "Sankashti — Mar", date: "2026-03-07", description: "Offer 21 durva to Ganeshji." },
  {
    name: "Sankashti — Apr",
    date: "2026-04-05",
    description: "Fast till moonrise with modak offering.",
  },
  { name: "Sankashti — May", date: "2026-05-05", description: "Recite Ganapati Atharvashirsha." },
  { name: "Sankashti — Jun", date: "2026-06-03", description: "Meditate on Vinayaka." },
  { name: "Sankashti — Jul", date: "2026-07-03", description: "Perform Ganesh puja at home." },
  {
    name: "Sankashti — Aug",
    date: "2026-08-01",
    description: "Grand day preceding Ganesh Chaturthi.",
  },
  {
    name: "Sankashti — Sep",
    date: "2026-08-31",
    description: "Angarki Sankashti; falls on Tuesday.",
  },
  { name: "Sankashti — Oct", date: "2026-09-29", description: "Offer red hibiscus." },
  { name: "Sankashti — Nov", date: "2026-10-29", description: "Chant 108 names of Ganesha." },
  {
    name: "Sankashti — Dec",
    date: "2026-11-27",
    description: "Perform Ganesh atharvashirsha path.",
  },
];

/* ─────────────── VRATS ─────────────── */
export interface VratEntry {
  slug: string;
  name: string;
  frequency: string;
  deity: string;
  rules: string;
  benefits: string;
}
export const VRATS: VratEntry[] = [
  {
    slug: "ekadashi-vrat",
    name: "Ekadashi Vrat",
    frequency: "Twice a lunar month",
    deity: "Vishnu",
    rules:
      "No grain, no rice; only fruits, milk and water. Break at sunrise the next day (parana) within the ekadashi tithi window.",
    benefits: "Purifies mind and body; grants moksha over time.",
  },
  {
    slug: "somvar-vrat",
    name: "Somvar Vrat",
    frequency: "Every Monday",
    deity: "Shiva",
    rules: "Single sattvic meal; Shiva abhishek with milk, water and bilva.",
    benefits: "Removes obstacles in marriage; harmony in relationships.",
  },
  {
    slug: "mangala-vrat",
    name: "Mangala Vrat",
    frequency: "Every Tuesday",
    deity: "Hanuman / Mangala",
    rules: "Recite Hanuman Chalisa 7 times; offer boondi laddu.",
    benefits: "Removes debt; grants courage and health.",
  },
  {
    slug: "budh-vrat",
    name: "Budh Vrat",
    frequency: "Every Wednesday",
    deity: "Ganesha / Budh",
    rules: "Green attire, wheat-free meal.",
    benefits: "Sharpens intellect and communication.",
  },
  {
    slug: "guruvar-vrat",
    name: "Guruvar Vrat",
    frequency: "Every Thursday",
    deity: "Vishnu / Guru",
    rules: "Yellow attire; offering of besan and jaggery.",
    benefits: "Prosperity, righteousness and marriage blessings.",
  },
  {
    slug: "shukra-vrat",
    name: "Shukra Vrat",
    frequency: "Every Friday",
    deity: "Lakshmi / Santoshi Mata",
    rules: "Recite Santoshi Mata katha; avoid sour food.",
    benefits: "Marital harmony and fulfilment of wishes.",
  },
  {
    slug: "shani-vrat",
    name: "Shani Vrat",
    frequency: "Every Saturday",
    deity: "Shani / Hanuman",
    rules: "Recite Shani Chalisa; oil-lamp for Shani.",
    benefits: "Reduces Shani's difficulties; grants patience.",
  },
  {
    slug: "pradosh-vrat",
    name: "Pradosh Vrat",
    frequency: "Trayodashi (twice a month)",
    deity: "Shiva-Parvati",
    rules: "Fast from sunrise; break at pradosh kaal after Shiva puja.",
    benefits: "Removes karmic obstacles; fulfils righteous desires.",
  },
  {
    slug: "sankashti-vrat",
    name: "Sankashti Chaturthi",
    frequency: "Krishna paksha chaturthi",
    deity: "Ganesha",
    rules: "Fast till moonrise; offer modak.",
    benefits: "Removes calamity and hardship.",
  },
  {
    slug: "chaturmas-vrat",
    name: "Chaturmas Vrat",
    frequency: "4 months (Ashadha-Kartik)",
    deity: "Vishnu",
    rules: "Reduce food categories; give up favourite indulgence; more sadhana.",
    benefits: "Deep spiritual reset during Vishnu's yoga-nidra.",
  },
  {
    slug: "navratri-vrat",
    name: "Navratri Vrat",
    frequency: "9 days, twice a year",
    deity: "Durga",
    rules: "Fruits, kuttu, singhara flour; recite Durga Saptashati.",
    benefits: "Awakens shakti; grants strength and clarity.",
  },
  {
    slug: "karva-chauth",
    name: "Karva Chauth",
    frequency: "Once a year (Kartik)",
    deity: "Shiva-Parvati",
    rules: "Nirjal vrat till moonrise; sargi at dawn, katha at evening.",
    benefits: "Longevity and well-being of the husband.",
  },
];

/* ─────────────── PANCHANG / HORA / MUHURAT ─────────────── */
export const WEEKDAY_LORDS: { day: string; lord: string; hora_first: string }[] = [
  { day: "Sunday", lord: "Sun", hora_first: "Sun" },
  { day: "Monday", lord: "Moon", hora_first: "Moon" },
  { day: "Tuesday", lord: "Mars", hora_first: "Mars" },
  { day: "Wednesday", lord: "Mercury", hora_first: "Mercury" },
  { day: "Thursday", lord: "Jupiter", hora_first: "Jupiter" },
  { day: "Friday", lord: "Venus", hora_first: "Venus" },
  { day: "Saturday", lord: "Saturn", hora_first: "Saturn" },
];
export const HORA_SEQUENCE = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"];
export const HORA_QUALITY: Record<
  string,
  { quality: "auspicious" | "neutral" | "inauspicious"; note: string }
> = {
  Sun: { quality: "neutral", note: "Government, health, authority." },
  Moon: { quality: "auspicious", note: "Peace, relationships, water-related work." },
  Mars: { quality: "inauspicious", note: "Avoid new starts; good for property, sports." },
  Mercury: { quality: "auspicious", note: "Learning, communication, trade." },
  Jupiter: { quality: "auspicious", note: "Best for all shubh karma, education." },
  Venus: { quality: "auspicious", note: "Music, arts, marriage, luxury." },
  Saturn: { quality: "inauspicious", note: "Avoid new starts; suitable for iron, servants." },
};

/* ─────────────── NAKSHATRA / RASHI SYLLABLES (Baby names) ─────────────── */
export const NAKSHATRA_SYLLABLES: { nakshatra: string; padas: string[] }[] = [
  { nakshatra: "Ashwini", padas: ["Chu", "Che", "Cho", "La"] },
  { nakshatra: "Bharani", padas: ["Li", "Lu", "Le", "Lo"] },
  { nakshatra: "Krittika", padas: ["A", "I", "U", "E"] },
  { nakshatra: "Rohini", padas: ["O", "Va", "Vi", "Vu"] },
  { nakshatra: "Mrigashira", padas: ["Ve", "Vo", "Ka", "Ki"] },
  { nakshatra: "Ardra", padas: ["Ku", "Gha", "Nga", "Chha"] },
  { nakshatra: "Punarvasu", padas: ["Ke", "Ko", "Ha", "Hi"] },
  { nakshatra: "Pushya", padas: ["Hu", "He", "Ho", "Da"] },
  { nakshatra: "Ashlesha", padas: ["Di", "Du", "De", "Do"] },
  { nakshatra: "Magha", padas: ["Ma", "Mi", "Mu", "Me"] },
  { nakshatra: "Purva Phalguni", padas: ["Mo", "Ta", "Ti", "Tu"] },
  { nakshatra: "Uttara Phalguni", padas: ["Te", "To", "Pa", "Pi"] },
  { nakshatra: "Hasta", padas: ["Pu", "Sha", "Na", "Tha"] },
  { nakshatra: "Chitra", padas: ["Pe", "Po", "Ra", "Ri"] },
  { nakshatra: "Swati", padas: ["Ru", "Re", "Ro", "Ta"] },
  { nakshatra: "Vishakha", padas: ["Ti", "Tu", "Te", "To"] },
  { nakshatra: "Anuradha", padas: ["Na", "Ni", "Nu", "Ne"] },
  { nakshatra: "Jyeshtha", padas: ["No", "Ya", "Yi", "Yu"] },
  { nakshatra: "Mula", padas: ["Ye", "Yo", "Bha", "Bhi"] },
  { nakshatra: "Purva Ashadha", padas: ["Bhu", "Dha", "Pha", "Dha"] },
  { nakshatra: "Uttara Ashadha", padas: ["Bhe", "Bho", "Ja", "Ji"] },
  { nakshatra: "Shravana", padas: ["Ju", "Je", "Jo", "Kha"] },
  { nakshatra: "Dhanishta", padas: ["Ga", "Gi", "Gu", "Ge"] },
  { nakshatra: "Shatabhisha", padas: ["Go", "Sa", "Si", "Su"] },
  { nakshatra: "Purva Bhadrapada", padas: ["Se", "So", "Da", "Di"] },
  { nakshatra: "Uttara Bhadrapada", padas: ["Du", "Tha", "Jha", "Da"] },
  { nakshatra: "Revati", padas: ["De", "Do", "Cha", "Chi"] },
];
export const RASHI_SYLLABLES: { rashi: string; syllables: string[] }[] = [
  { rashi: "Mesha (Aries)", syllables: ["Chu", "Che", "Cho", "La", "Li", "Lu", "Le", "Lo", "A"] },
  { rashi: "Vrishabha (Taurus)", syllables: ["I", "U", "E", "O", "Va", "Vi", "Vu", "Ve", "Vo"] },
  {
    rashi: "Mithuna (Gemini)",
    syllables: ["Ka", "Ki", "Ku", "Gha", "Nga", "Chha", "Ke", "Ko", "Ha"],
  },
  { rashi: "Karka (Cancer)", syllables: ["Hi", "Hu", "He", "Ho", "Da", "Di", "Du", "De", "Do"] },
  { rashi: "Simha (Leo)", syllables: ["Ma", "Mi", "Mu", "Me", "Mo", "Ta", "Ti", "Tu", "Te"] },
  { rashi: "Kanya (Virgo)", syllables: ["To", "Pa", "Pi", "Pu", "Sha", "Na", "Tha", "Pe", "Po"] },
  { rashi: "Tula (Libra)", syllables: ["Ra", "Ri", "Ru", "Re", "Ro", "Ta", "Ti", "Tu", "Te"] },
  {
    rashi: "Vrishchika (Scorpio)",
    syllables: ["To", "Na", "Ni", "Nu", "Ne", "No", "Ya", "Yi", "Yu"],
  },
  {
    rashi: "Dhanu (Sagittarius)",
    syllables: ["Ye", "Yo", "Bha", "Bhi", "Bhu", "Dha", "Pha", "Bhe", "Bho"],
  },
  {
    rashi: "Makara (Capricorn)",
    syllables: ["Ja", "Ji", "Ju", "Je", "Jo", "Kha", "Ga", "Gi", "Gu"],
  },
  { rashi: "Kumbha (Aquarius)", syllables: ["Ge", "Go", "Sa", "Si", "Su", "Se", "So", "Da", "Di"] },
  {
    rashi: "Meena (Pisces)",
    syllables: ["Du", "Tha", "Jha", "Da", "De", "Do", "Cha", "Chi", "Za"],
  },
];

/* ─────────────── BABY NAMES ─────────────── */
export interface BabyName {
  name: string;
  gender: "M" | "F" | "U";
  meaning: string;
  deity?: string;
  syllable?: string;
}
export const BABY_NAMES: BabyName[] = [
  { name: "Aarav", gender: "M", meaning: "Peaceful; melodious sound", syllable: "A" },
  {
    name: "Arjun",
    gender: "M",
    meaning: "Bright, shining; the Pandava prince",
    deity: "Krishna",
    syllable: "A",
  },
  { name: "Aditya", gender: "M", meaning: "Sun; son of Aditi", deity: "Surya", syllable: "A" },
  { name: "Aarush", gender: "M", meaning: "First ray of the sun", syllable: "A" },
  { name: "Ayaan", gender: "M", meaning: "Gift of God", syllable: "A" },
  { name: "Ishaan", gender: "M", meaning: "Sun; Shiva", deity: "Shiva", syllable: "I" },
  {
    name: "Krishna",
    gender: "M",
    meaning: "Dark one; the all-attractive",
    deity: "Krishna",
    syllable: "K",
  },
  {
    name: "Kartik",
    gender: "M",
    meaning: "Son of Shiva; god of war",
    deity: "Kartikeya",
    syllable: "K",
  },
  { name: "Kabir", gender: "M", meaning: "Great; the saint-poet", syllable: "K" },
  {
    name: "Reyansh",
    gender: "M",
    meaning: "Ray of light; part of Vishnu",
    deity: "Vishnu",
    syllable: "R",
  },
  { name: "Rudra", gender: "M", meaning: "Fierce; a form of Shiva", deity: "Shiva", syllable: "R" },
  { name: "Rohan", gender: "M", meaning: "Ascending; sandalwood", syllable: "R" },
  { name: "Rishi", gender: "M", meaning: "Seer; sage", syllable: "R" },
  { name: "Vihaan", gender: "M", meaning: "Dawn; morning", syllable: "V" },
  {
    name: "Vivaan",
    gender: "M",
    meaning: "Full of life; Krishna's name",
    deity: "Krishna",
    syllable: "V",
  },
  { name: "Vedant", gender: "M", meaning: "End of the Vedas; supreme knowledge", syllable: "V" },
  { name: "Shivansh", gender: "M", meaning: "Part of Shiva", deity: "Shiva", syllable: "S" },
  { name: "Shaurya", gender: "M", meaning: "Valour; heroism", syllable: "S" },
  { name: "Samar", gender: "M", meaning: "War; assembly of the wise", syllable: "S" },
  { name: "Sameer", gender: "M", meaning: "Gentle breeze", syllable: "S" },
  { name: "Neel", gender: "M", meaning: "Blue; Vishnu", deity: "Vishnu", syllable: "N" },
  { name: "Om", gender: "M", meaning: "The primordial sound", deity: "Brahman", syllable: "O" },
  { name: "Yash", gender: "M", meaning: "Fame; glory", syllable: "Y" },
  { name: "Dhruv", gender: "M", meaning: "Pole star; steadfast", syllable: "D" },
  { name: "Ananya", gender: "F", meaning: "Unique; without equal", syllable: "A" },
  {
    name: "Aadhya",
    gender: "F",
    meaning: "First power; the goddess",
    deity: "Devi",
    syllable: "A",
  },
  { name: "Aarohi", gender: "F", meaning: "Ascending musical note", syllable: "A" },
  { name: "Anaya", gender: "F", meaning: "Without a superior; caring", syllable: "A" },
  { name: "Isha", gender: "F", meaning: "Goddess; ruler", deity: "Devi", syllable: "I" },
  { name: "Ira", gender: "F", meaning: "Earth; Saraswati", deity: "Saraswati", syllable: "I" },
  { name: "Kavya", gender: "F", meaning: "Poetry", syllable: "K" },
  { name: "Kiara", gender: "F", meaning: "Divine gift; dark-haired", syllable: "K" },
  { name: "Meera", gender: "F", meaning: "Devotee of Krishna", deity: "Krishna", syllable: "M" },
  { name: "Myra", gender: "F", meaning: "Beloved; admirable", syllable: "M" },
  { name: "Nitya", gender: "F", meaning: "Eternal", syllable: "N" },
  { name: "Navya", gender: "F", meaning: "New; young", syllable: "N" },
  { name: "Prisha", gender: "F", meaning: "Beloved of God", syllable: "P" },
  {
    name: "Radha",
    gender: "F",
    meaning: "Prosperity; Krishna's beloved",
    deity: "Krishna",
    syllable: "R",
  },
  { name: "Riya", gender: "F", meaning: "Singer; graceful", syllable: "R" },
  { name: "Saanvi", gender: "F", meaning: "Goddess Lakshmi", deity: "Lakshmi", syllable: "S" },
  { name: "Sara", gender: "F", meaning: "Essence; noble", syllable: "S" },
  { name: "Sita", gender: "F", meaning: "Rama's consort; furrow", deity: "Rama", syllable: "S" },
  { name: "Tara", gender: "F", meaning: "Star; goddess Tara", deity: "Tara", syllable: "T" },
  {
    name: "Uma",
    gender: "F",
    meaning: "Peace of the night; Parvati",
    deity: "Parvati",
    syllable: "U",
  },
  { name: "Vanya", gender: "F", meaning: "Gracious gift of God", syllable: "V" },
  { name: "Diya", gender: "F", meaning: "Lamp; light", syllable: "D" },
  { name: "Anvi", gender: "F", meaning: "Goddess Lakshmi", deity: "Lakshmi", syllable: "A" },
  { name: "Advait", gender: "M", meaning: "Non-dual; unique", syllable: "A" },
  { name: "Ojas", gender: "M", meaning: "Divine energy", syllable: "O" },
];

/* ─────────────── SANSKRIT DICTIONARY ─────────────── */
export interface SanskritWord {
  word: string;
  devanagari: string;
  meaning: string;
  root?: string;
  category: string;
}
export const SANSKRIT_DICT: SanskritWord[] = [
  {
    word: "dharma",
    devanagari: "धर्म",
    meaning: "Righteous duty; cosmic order; that which sustains.",
    root: "√dhṛ (to hold)",
    category: "philosophy",
  },
  {
    word: "karma",
    devanagari: "कर्म",
    meaning: "Action; the law of cause and effect.",
    root: "√kṛ (to do)",
    category: "philosophy",
  },
  {
    word: "moksha",
    devanagari: "मोक्ष",
    meaning: "Liberation from the cycle of birth and death.",
    root: "√muc (to release)",
    category: "philosophy",
  },
  {
    word: "atman",
    devanagari: "आत्मन्",
    meaning: "The eternal Self; the innermost essence.",
    category: "philosophy",
  },
  {
    word: "brahman",
    devanagari: "ब्रह्मन्",
    meaning: "The absolute reality; the source of all.",
    category: "philosophy",
  },
  {
    word: "maya",
    devanagari: "माया",
    meaning: "Illusion; the veiling and projecting power of Brahman.",
    category: "philosophy",
  },
  {
    word: "yoga",
    devanagari: "योग",
    meaning: "Union; discipline; the path to Self-realization.",
    root: "√yuj (to unite)",
    category: "practice",
  },
  {
    word: "yajna",
    devanagari: "यज्ञ",
    meaning: "Sacrifice; sacred offering; selfless action.",
    root: "√yaj (to offer)",
    category: "ritual",
  },
  {
    word: "guru",
    devanagari: "गुरु",
    meaning: "One who dispels darkness; spiritual teacher.",
    category: "practice",
  },
  {
    word: "shishya",
    devanagari: "शिष्य",
    meaning: "Disciple; one who receives teaching.",
    root: "√śās (to teach)",
    category: "practice",
  },
  {
    word: "bhakti",
    devanagari: "भक्ति",
    meaning: "Loving devotion.",
    root: "√bhaj (to share, adore)",
    category: "practice",
  },
  {
    word: "jnana",
    devanagari: "ज्ञान",
    meaning: "Knowledge; direct wisdom.",
    root: "√jñā (to know)",
    category: "practice",
  },
  {
    word: "vairagya",
    devanagari: "वैराग्य",
    meaning: "Dispassion; freedom from clinging.",
    category: "practice",
  },
  {
    word: "ahimsa",
    devanagari: "अहिंसा",
    meaning: "Non-violence; harmlessness.",
    category: "ethics",
  },
  { word: "satya", devanagari: "सत्य", meaning: "Truth; that which is real.", category: "ethics" },
  { word: "asteya", devanagari: "अस्तेय", meaning: "Non-stealing.", category: "ethics" },
  {
    word: "brahmacharya",
    devanagari: "ब्रह्मचर्य",
    meaning: "Continence; walking in Brahman.",
    category: "ethics",
  },
  {
    word: "aparigraha",
    devanagari: "अपरिग्रह",
    meaning: "Non-possessiveness.",
    category: "ethics",
  },
  { word: "shanti", devanagari: "शान्ति", meaning: "Peace; tranquility.", category: "state" },
  {
    word: "ananda",
    devanagari: "आनन्द",
    meaning: "Bliss; the nature of the Self.",
    category: "state",
  },
  { word: "sat", devanagari: "सत्", meaning: "Being; existence; reality.", category: "state" },
  {
    word: "chit",
    devanagari: "चित्",
    meaning: "Consciousness; pure awareness.",
    category: "state",
  },
  {
    word: "prana",
    devanagari: "प्राण",
    meaning: "Vital breath; life-force.",
    category: "practice",
  },
  {
    word: "chakra",
    devanagari: "चक्र",
    meaning: "Wheel; energy centre in the subtle body.",
    category: "practice",
  },
  {
    word: "mantra",
    devanagari: "मन्त्र",
    meaning: "Sacred sound-formula that liberates the mind.",
    category: "practice",
  },
  {
    word: "yantra",
    devanagari: "यन्त्र",
    meaning: "Sacred geometric diagram.",
    category: "practice",
  },
  {
    word: "tantra",
    devanagari: "तन्त्र",
    meaning: "Sacred technology of practice.",
    category: "practice",
  },
  { word: "sadhana", devanagari: "साधना", meaning: "Spiritual practice.", category: "practice" },
  { word: "sadhaka", devanagari: "साधक", meaning: "Practitioner.", category: "practice" },
  { word: "sannyasa", devanagari: "संन्यास", meaning: "Renunciation.", category: "practice" },
  {
    word: "grihastha",
    devanagari: "गृहस्थ",
    meaning: "Householder stage of life.",
    category: "ashram",
  },
  {
    word: "vanaprastha",
    devanagari: "वानप्रस्थ",
    meaning: "Forest-dweller stage of life.",
    category: "ashram",
  },
  {
    word: "sanatana",
    devanagari: "सनातन",
    meaning: "Eternal; without beginning or end.",
    category: "philosophy",
  },
  {
    word: "vidya",
    devanagari: "विद्या",
    meaning: "Knowledge; especially spiritual knowledge.",
    category: "practice",
  },
  {
    word: "avidya",
    devanagari: "अविद्या",
    meaning: "Ignorance; not knowing the Self.",
    category: "philosophy",
  },
  {
    word: "purusha",
    devanagari: "पुरुष",
    meaning: "Consciousness; the seer.",
    category: "philosophy",
  },
  { word: "prakriti", devanagari: "प्रकृति", meaning: "Nature; the seen.", category: "philosophy" },
  {
    word: "guna",
    devanagari: "गुण",
    meaning: "Quality; strand of nature (sattva, rajas, tamas).",
    category: "philosophy",
  },
  {
    word: "samsara",
    devanagari: "संसार",
    meaning: "The cycle of birth and rebirth.",
    category: "philosophy",
  },
  {
    word: "nirvana",
    devanagari: "निर्वाण",
    meaning: "Extinguishing of the ego-flame; liberation.",
    category: "state",
  },
  {
    word: "kaivalya",
    devanagari: "कैवल्य",
    meaning: "Absolute aloneness; the goal of Yoga Sutras.",
    category: "state",
  },
  {
    word: "samadhi",
    devanagari: "समाधि",
    meaning: "Absorption; the eighth limb of yoga.",
    category: "practice",
  },
  { word: "dhyana", devanagari: "ध्यान", meaning: "Meditation.", category: "practice" },
  { word: "dharana", devanagari: "धारणा", meaning: "Concentration.", category: "practice" },
  {
    word: "pratyahara",
    devanagari: "प्रत्याहार",
    meaning: "Withdrawal of the senses.",
    category: "practice",
  },
  {
    word: "pranayama",
    devanagari: "प्राणायाम",
    meaning: "Regulation of prana; breath discipline.",
    category: "practice",
  },
  { word: "asana", devanagari: "आसन", meaning: "Steady posture.", category: "practice" },
  { word: "niyama", devanagari: "नियम", meaning: "Personal observances.", category: "ethics" },
  {
    word: "yama",
    devanagari: "यम",
    meaning: "Restraints; ethical roots of yoga.",
    category: "ethics",
  },
  { word: "sanga", devanagari: "सङ्ग", meaning: "Association; attachment.", category: "state" },
  {
    word: "satsanga",
    devanagari: "सत्सङ्ग",
    meaning: "Association with the truthful; holy company.",
    category: "practice",
  },
  { word: "sneha", devanagari: "स्नेह", meaning: "Affection; loving warmth.", category: "state" },
  { word: "priti", devanagari: "प्रीति", meaning: "Love; delight.", category: "state" },
  {
    word: "shraddha",
    devanagari: "श्रद्धा",
    meaning: "Faith rooted in understanding.",
    category: "practice",
  },
  { word: "seva", devanagari: "सेवा", meaning: "Selfless service.", category: "practice" },
  { word: "dana", devanagari: "दान", meaning: "Giving; charity.", category: "practice" },
  {
    word: "tapas",
    devanagari: "तपस्",
    meaning: "Ardour; disciplined effort.",
    category: "practice",
  },
  {
    word: "svadhyaya",
    devanagari: "स्वाध्याय",
    meaning: "Self-study; study of sacred texts.",
    category: "practice",
  },
  {
    word: "ishvara-pranidhana",
    devanagari: "ईश्वरप्रणिधान",
    meaning: "Surrender to Ishvara.",
    category: "practice",
  },
  { word: "kshama", devanagari: "क्षमा", meaning: "Forgiveness; patience.", category: "ethics" },
  { word: "daya", devanagari: "दया", meaning: "Compassion.", category: "ethics" },
];

/* ─────────────── GITA CHAPTERS ─────────────── */
export interface GitaChapter {
  num: number;
  name: string;
  devanagari: string;
  verses: number;
  summary: string;
  teaching: string;
}
export const GITA_CHAPTERS: GitaChapter[] = [
  {
    num: 1,
    name: "Arjuna Vishada Yoga",
    devanagari: "अर्जुनविषादयोग",
    verses: 47,
    summary: "Arjuna's despondency on the battlefield.",
    teaching: "Sets the stage; introduces the human dilemma between duty and attachment.",
  },
  {
    num: 2,
    name: "Sankhya Yoga",
    devanagari: "साङ्ख्ययोग",
    verses: 72,
    summary: "The essence of the Gita; the eternity of the soul.",
    teaching: "Introduces karma yoga; you have the right to action, not to its fruit.",
  },
  {
    num: 3,
    name: "Karma Yoga",
    devanagari: "कर्मयोग",
    verses: 43,
    summary: "The path of selfless action.",
    teaching: "Action performed as yajna liberates; inaction is impossible.",
  },
  {
    num: 4,
    name: "Jnana Karma Sanyasa Yoga",
    devanagari: "ज्ञानकर्मसंन्यासयोग",
    verses: 42,
    summary: "Knowledge, action and renunciation.",
    teaching: "Krishna reveals the eternal parampara; jnana purifies all karma.",
  },
  {
    num: 5,
    name: "Karma Sanyasa Yoga",
    devanagari: "कर्मसंन्यासयोग",
    verses: 29,
    summary: "Renunciation through action.",
    teaching: "True renunciation is inner detachment while acting.",
  },
  {
    num: 6,
    name: "Dhyana Yoga",
    devanagari: "ध्यानयोग",
    verses: 47,
    summary: "The path of meditation.",
    teaching: "Yoga is skill in action and equanimity of mind.",
  },
  {
    num: 7,
    name: "Jnana Vijnana Yoga",
    devanagari: "ज्ञानविज्ञानयोग",
    verses: 30,
    summary: "Knowledge and realization of Krishna.",
    teaching: "The world is Krishna's lower nature; the jiva is His higher nature.",
  },
  {
    num: 8,
    name: "Akshara Brahma Yoga",
    devanagari: "अक्षरब्रह्मयोग",
    verses: 28,
    summary: "The imperishable Brahman.",
    teaching: "Whoever remembers the Lord at the moment of death attains Him.",
  },
  {
    num: 9,
    name: "Raja Vidya Raja Guhya Yoga",
    devanagari: "राजविद्याराजगुह्ययोग",
    verses: 34,
    summary: "The king of knowledge, king of secrets.",
    teaching: "Bhakti is the supreme dharma; even a leaf offered with love reaches Him.",
  },
  {
    num: 10,
    name: "Vibhuti Yoga",
    devanagari: "विभूतियोग",
    verses: 42,
    summary: "The divine glories.",
    teaching: "Krishna is the essence of every excellence in creation.",
  },
  {
    num: 11,
    name: "Vishvarupa Darshana Yoga",
    devanagari: "विश्वरूपदर्शनयोग",
    verses: 55,
    summary: "Vision of the cosmic form.",
    teaching: "Arjuna sees the entire universe within Krishna.",
  },
  {
    num: 12,
    name: "Bhakti Yoga",
    devanagari: "भक्तियोग",
    verses: 20,
    summary: "The path of loving devotion.",
    teaching: "Bhakti is the easiest and surest path to the Divine.",
  },
  {
    num: 13,
    name: "Kshetra Kshetrajna Vibhaga Yoga",
    devanagari: "क्षेत्रक्षेत्रज्ञविभागयोग",
    verses: 35,
    summary: "The field and the knower of the field.",
    teaching: "Body is the field; the Self is the knower — never one.",
  },
  {
    num: 14,
    name: "Gunatraya Vibhaga Yoga",
    devanagari: "गुणत्रयविभागयोग",
    verses: 27,
    summary: "The three gunas.",
    teaching: "Sattva, rajas, tamas bind the jiva; transcend all three to attain moksha.",
  },
  {
    num: 15,
    name: "Purushottama Yoga",
    devanagari: "पुरुषोत्तमयोग",
    verses: 20,
    summary: "The supreme Self.",
    teaching: "Krishna is Purushottama — beyond kshara and akshara.",
  },
  {
    num: 16,
    name: "Daivasura Sampad Vibhaga Yoga",
    devanagari: "दैवासुरसम्पद्विभागयोग",
    verses: 24,
    summary: "Divine and demoniac natures.",
    teaching: "Sattvic qualities liberate; asuric qualities bind.",
  },
  {
    num: 17,
    name: "Shraddhatraya Vibhaga Yoga",
    devanagari: "श्रद्धात्रयविभागयोग",
    verses: 28,
    summary: "The three kinds of faith.",
    teaching: "One is what one's shraddha is; Om Tat Sat is the mantra.",
  },
  {
    num: 18,
    name: "Moksha Sanyasa Yoga",
    devanagari: "मोक्षसंन्यासयोग",
    verses: 78,
    summary: "Liberation through renunciation.",
    teaching: "Surrender all dharmas to Me; I will liberate you from all sin.",
  },
];

/* ─────────────── UPANISHADS ─────────────── */
export interface Upanishad {
  name: string;
  devanagari: string;
  veda: string;
  theme: string;
  keyTeaching: string;
}
export const UPANISHADS: Upanishad[] = [
  {
    name: "Isha",
    devanagari: "ईशावास्य",
    veda: "Shukla Yajurveda",
    theme: "The Lord in all",
    keyTeaching: "Renounce and enjoy; everything is pervaded by the Lord.",
  },
  {
    name: "Kena",
    devanagari: "केन",
    veda: "Sama",
    theme: "By whom is the mind directed",
    keyTeaching:
      "That which the mind cannot think but by which the mind thinks — know that as Brahman.",
  },
  {
    name: "Katha",
    devanagari: "कठ",
    veda: "Krishna Yajurveda",
    theme: "Nachiketa's dialogue with Yama",
    keyTeaching:
      "The Self is not known through study or intellect; it reveals itself to the earnest seeker.",
  },
  {
    name: "Prashna",
    devanagari: "प्रश्न",
    veda: "Atharva",
    theme: "Six questions",
    keyTeaching: "Prana is the life-force; meditation on Om leads to Brahman.",
  },
  {
    name: "Mundaka",
    devanagari: "मुण्डक",
    veda: "Atharva",
    theme: "Higher and lower knowledge",
    keyTeaching: "Satyameva Jayate — truth alone triumphs.",
  },
  {
    name: "Mandukya",
    devanagari: "माण्डूक्य",
    veda: "Atharva",
    theme: "The syllable Om and four states",
    keyTeaching: "All is Om; the fourth state (turiya) is the Self.",
  },
  {
    name: "Taittiriya",
    devanagari: "तैत्तिरीय",
    veda: "Krishna Yajurveda",
    theme: "Five sheaths and Brahman as bliss",
    keyTeaching: "Speak the truth, walk in dharma, never neglect study.",
  },
  {
    name: "Aitareya",
    devanagari: "ऐतरेय",
    veda: "Rigveda",
    theme: "Creation and consciousness",
    keyTeaching: "Consciousness is Brahman — Prajnanam Brahma.",
  },
  {
    name: "Chandogya",
    devanagari: "छान्दोग्य",
    veda: "Sama",
    theme: "Uddalaka teaches Shvetaketu",
    keyTeaching: "Tat Tvam Asi — Thou art That.",
  },
  {
    name: "Brihadaranyaka",
    devanagari: "बृहदारण्यक",
    veda: "Shukla Yajurveda",
    theme: "The great forest teaching",
    keyTeaching: "Aham Brahmasmi — I am Brahman.",
  },
  {
    name: "Shvetashvatara",
    devanagari: "श्वेताश्वतर",
    veda: "Krishna Yajurveda",
    theme: "The one God",
    keyTeaching: "Rudra is the one who governs all worlds by his ruling powers.",
  },
  {
    name: "Kaushitaki",
    devanagari: "कौषीतकि",
    veda: "Rigveda",
    theme: "Prana as Brahman",
    keyTeaching: "Prana is consciousness, prana is bliss.",
  },
];

/* ─────────────── VEDAS ─────────────── */
export const VEDAS: {
  name: string;
  devanagari: string;
  verses: string;
  content: string;
  deity: string;
}[] = [
  {
    name: "Rigveda",
    devanagari: "ऋग्वेद",
    verses: "10,552 mantras in 10 mandalas",
    content: "Hymns of praise to the devas — Agni, Indra, Varuna, Ushas, Rudra.",
    deity: "Agni, Indra, Varuna",
  },
  {
    name: "Yajurveda",
    devanagari: "यजुर्वेद",
    verses: "1,975 mantras (Shukla) / 2,086 (Krishna)",
    content: "Prose formulas for yajna and ritual procedure.",
    deity: "Yajna devatas",
  },
  {
    name: "Samaveda",
    devanagari: "सामवेद",
    verses: "1,875 mantras",
    content: "Melodic chants drawn from the Rigveda; the source of Indian classical music.",
    deity: "Soma, Indra, Agni",
  },
  {
    name: "Atharvaveda",
    devanagari: "अथर्ववेद",
    verses: "5,977 mantras in 20 kandas",
    content: "Mantras for daily life — healing, protection, family, longevity.",
    deity: "Multiple; includes Rudra, Skambha",
  },
];

/* ─────────────── YOGA SUTRAS (excerpts) ─────────────── */
export const YOGA_SUTRAS: { pada: string; count: number; theme: string; keyVerse: string }[] = [
  {
    pada: "Samadhi Pada",
    count: 51,
    theme: "The nature of yoga and samadhi",
    keyVerse: "योगश्चित्तवृत्तिनिरोधः — Yoga is the cessation of the modifications of the mind.",
  },
  {
    pada: "Sadhana Pada",
    count: 55,
    theme: "Practice; kriya yoga and ashtanga",
    keyVerse:
      "अभ्यासवैराग्याभ्यां तन्निरोधः — Cessation is achieved through practice and dispassion.",
  },
  {
    pada: "Vibhuti Pada",
    count: 56,
    theme: "Powers and siddhis",
    keyVerse: "देशबन्धश्चित्तस्य धारणा — Dharana is binding the mind to a place.",
  },
  {
    pada: "Kaivalya Pada",
    count: 34,
    theme: "Liberation",
    keyVerse:
      "पुरुषार्थशून्यानां गुणानां प्रतिप्रसवः कैवल्यम् — Liberation is the return of the gunas to their source.",
  },
];

/* ─────────────── PURANAS ─────────────── */
export const MAHAPURANAS: {
  name: string;
  devanagari: string;
  deity: string;
  verses: string;
  theme: string;
}[] = [
  {
    name: "Brahma Purana",
    devanagari: "ब्रह्म पुराण",
    deity: "Brahma",
    verses: "~10,000",
    theme: "The origin of the universe; the first Purana.",
  },
  {
    name: "Padma Purana",
    devanagari: "पद्म पुराण",
    deity: "Vishnu",
    verses: "~55,000",
    theme: "Sacred geography; Bhagavad Gita mahatmya.",
  },
  {
    name: "Vishnu Purana",
    devanagari: "विष्णु पुराण",
    deity: "Vishnu",
    verses: "~23,000",
    theme: "The purest Vaishnava Purana; six amshas.",
  },
  {
    name: "Shiva Purana",
    devanagari: "शिव पुराण",
    deity: "Shiva",
    verses: "~24,000",
    theme: "Shiva's leelas, jyotirlingas, Umā-Maheshvara.",
  },
  {
    name: "Bhagavata Purana",
    devanagari: "भागवत पुराण",
    deity: "Vishnu / Krishna",
    verses: "~18,000",
    theme: "The life of Krishna; supreme text of bhakti.",
  },
  {
    name: "Narada Purana",
    devanagari: "नारद पुराण",
    deity: "Vishnu",
    verses: "~25,000",
    theme: "Bhakti; guidance for householders and sadhakas.",
  },
  {
    name: "Markandeya Purana",
    devanagari: "मार्कण्डेय पुराण",
    deity: "Devi",
    verses: "~9,000",
    theme: "Contains the Devi Mahatmyam (Durga Saptashati).",
  },
  {
    name: "Agni Purana",
    devanagari: "अग्नि पुराण",
    deity: "Agni",
    verses: "~15,400",
    theme: "Encyclopedic — from ritual to statecraft.",
  },
  {
    name: "Bhavishya Purana",
    devanagari: "भविष्य पुराण",
    deity: "Surya",
    verses: "~14,500",
    theme: "Prophecies; solar worship; social order.",
  },
  {
    name: "Brahmavaivarta Purana",
    devanagari: "ब्रह्मवैवर्त पुराण",
    deity: "Krishna-Radha",
    verses: "~18,000",
    theme: "Radha-Krishna cosmology; Ganesha and Prakriti Khanda.",
  },
  {
    name: "Linga Purana",
    devanagari: "लिङ्ग पुराण",
    deity: "Shiva",
    verses: "~11,000",
    theme: "Origins of the linga; the 28 avatars of Shiva.",
  },
  {
    name: "Varaha Purana",
    devanagari: "वराह पुराण",
    deity: "Varaha (Vishnu)",
    verses: "~24,000",
    theme: "The boar avatar; tirtha mahatmya.",
  },
  {
    name: "Skanda Purana",
    devanagari: "स्कन्द पुराण",
    deity: "Kartikeya",
    verses: "~81,000",
    theme: "Largest Purana; Kashi, Kedar, Reva khandas.",
  },
  {
    name: "Vamana Purana",
    devanagari: "वामन पुराण",
    deity: "Vamana (Vishnu)",
    verses: "~10,000",
    theme: "The dwarf avatar; tirthas and vratas.",
  },
  {
    name: "Kurma Purana",
    devanagari: "कूर्म पुराण",
    deity: "Kurma (Vishnu)",
    verses: "~17,000",
    theme: "The tortoise avatar; Ishvara Gita.",
  },
  {
    name: "Matsya Purana",
    devanagari: "मत्स्य पुराण",
    deity: "Matsya (Vishnu)",
    verses: "~14,000",
    theme: "The fish avatar; oldest of the Puranas by content.",
  },
  {
    name: "Garuda Purana",
    devanagari: "गरुड पुराण",
    deity: "Vishnu",
    verses: "~19,000",
    theme: "Death, afterlife, and preta karma.",
  },
  {
    name: "Brahmanda Purana",
    devanagari: "ब्रह्माण्ड पुराण",
    deity: "Brahma",
    verses: "~12,000",
    theme: "Contains the Adhyatma Ramayana and Lalita Sahasranama.",
  },
];

/* ─────────────── RAMAYANA / MAHABHARATA ─────────────── */
export const RAMAYANA_KANDAS: {
  name: string;
  devanagari: string;
  sargas: number;
  summary: string;
}[] = [
  {
    name: "Bala Kanda",
    devanagari: "बालकाण्ड",
    sargas: 77,
    summary: "Rama's childhood; slaying of demons in Vishvamitra's ashram; marriage to Sita.",
  },
  {
    name: "Ayodhya Kanda",
    devanagari: "अयोध्याकाण्ड",
    sargas: 119,
    summary:
      "Rama's coronation is announced; Kaikeyi's boons; Rama, Sita and Lakshmana leave for the forest.",
  },
  {
    name: "Aranya Kanda",
    devanagari: "अरण्यकाण्ड",
    sargas: 75,
    summary: "Forest life; Shurpanakha's insult; Sita is abducted by Ravana.",
  },
  {
    name: "Kishkindha Kanda",
    devanagari: "किष्किन्धाकाण्ड",
    sargas: 67,
    summary: "Meeting with Hanuman and Sugriva; alliance with the vanaras; search for Sita.",
  },
  {
    name: "Sundara Kanda",
    devanagari: "सुन्दरकाण्ड",
    sargas: 68,
    summary:
      "Hanuman leaps to Lanka; meets Sita; returns with the message. The heart of the Ramayana.",
  },
  {
    name: "Yuddha Kanda",
    devanagari: "युद्धकाण्ड",
    sargas: 128,
    summary: "The great war; Ravana is slain; Sita's return; Rama's coronation.",
  },
  {
    name: "Uttara Kanda",
    devanagari: "उत्तरकाण्ड",
    sargas: 111,
    summary: "Rama's reign; Sita's exile; birth of Luv and Kush; Rama's return to Vaikuntha.",
  },
];
export const MAHABHARATA_PARVAS: { name: string; devanagari: string; theme: string }[] = [
  {
    name: "Adi Parva",
    devanagari: "आदि पर्व",
    theme: "The origin; the ancestry and birth of the Kurus and Pandavas.",
  },
  {
    name: "Sabha Parva",
    devanagari: "सभा पर्व",
    theme: "The assembly; the game of dice and the disrobing of Draupadi.",
  },
  {
    name: "Vana Parva",
    devanagari: "वन पर्व",
    theme: "The forest; the twelve years of exile and its stories.",
  },
  {
    name: "Virata Parva",
    devanagari: "विराट पर्व",
    theme: "The year in disguise at King Virata's court.",
  },
  {
    name: "Udyoga Parva",
    devanagari: "उद्योग पर्व",
    theme: "Preparations for war; Krishna's peace mission.",
  },
  {
    name: "Bhishma Parva",
    devanagari: "भीष्म पर्व",
    theme: "The war under Bhishma; contains the Bhagavad Gita.",
  },
  {
    name: "Drona Parva",
    devanagari: "द्रोण पर्व",
    theme: "The war under Drona; slaying of Abhimanyu.",
  },
  {
    name: "Karna Parva",
    devanagari: "कर्ण पर्व",
    theme: "The war under Karna; his fall to Arjuna.",
  },
  {
    name: "Shalya Parva",
    devanagari: "शल्य पर्व",
    theme: "The war under Shalya; the fall of Duryodhana.",
  },
  {
    name: "Sauptika Parva",
    devanagari: "सौप्तिक पर्व",
    theme: "The night massacre by Ashwatthama.",
  },
  { name: "Stri Parva", devanagari: "स्त्री पर्व", theme: "The lament of the women." },
  {
    name: "Shanti Parva",
    devanagari: "शान्ति पर्व",
    theme: "Bhishma's teachings on dharma, moksha, and rajaniti.",
  },
  {
    name: "Anushasana Parva",
    devanagari: "अनुशासन पर्व",
    theme: "Further teachings; the Vishnu Sahasranama.",
  },
  {
    name: "Ashvamedhika Parva",
    devanagari: "अश्वमेधिक पर्व",
    theme: "Yudhishthira's Ashvamedha yajna.",
  },
  {
    name: "Ashramavasika Parva",
    devanagari: "आश्रमवासिक पर्व",
    theme: "Dhritarashtra and Gandhari's retirement.",
  },
  {
    name: "Mausala Parva",
    devanagari: "मौसल पर्व",
    theme: "The passing of the Yadavas and Krishna.",
  },
  {
    name: "Mahaprasthanika Parva",
    devanagari: "महाप्रस्थानिक पर्व",
    theme: "The Pandavas' final journey.",
  },
  {
    name: "Svargarohanika Parva",
    devanagari: "स्वर्गारोहणिक पर्व",
    theme: "Ascent to Svarga; the final revelations.",
  },
];

/* ─────────────── TEMPLES (extended) ─────────────── */
export interface TempleEx {
  slug: string;
  name: string;
  deity: string;
  state: string;
  city: string;
  category:
    | "Jyotirlinga"
    | "Char Dham"
    | "Shakti Peeth"
    | "Vishnu"
    | "Ganesha"
    | "Devi"
    | "Hanuman"
    | "Other";
  timings: string;
  history: string;
}
export const TEMPLES_EX: TempleEx[] = [
  {
    slug: "somnath",
    name: "Somnath Jyotirlinga",
    deity: "Shiva",
    state: "Gujarat",
    city: "Prabhas Patan",
    category: "Jyotirlinga",
    timings: "6:00 AM – 9:30 PM (Aarti: 7am, 12pm, 7pm)",
    history: "The first of the twelve jyotirlingas; rebuilt many times through history.",
  },
  {
    slug: "mallikarjuna",
    name: "Mallikarjuna Jyotirlinga",
    deity: "Shiva",
    state: "Andhra Pradesh",
    city: "Srisailam",
    category: "Jyotirlinga",
    timings: "4:30 AM – 10:00 PM",
    history: "One of 12 jyotirlingas and one of 18 Shakti Peethas — a rare confluence.",
  },
  {
    slug: "mahakaleshwar",
    name: "Mahakaleshwar Jyotirlinga",
    deity: "Shiva",
    state: "Madhya Pradesh",
    city: "Ujjain",
    category: "Jyotirlinga",
    timings: "4:00 AM – 11:00 PM (Bhasma aarti: 4am)",
    history: "The only Jyotirlinga facing south; famous for the Bhasma aarti.",
  },
  {
    slug: "omkareshwar",
    name: "Omkareshwar Jyotirlinga",
    deity: "Shiva",
    state: "Madhya Pradesh",
    city: "Mandhata",
    category: "Jyotirlinga",
    timings: "5:00 AM – 9:30 PM",
    history: "Island shaped like Om on the Narmada.",
  },
  {
    slug: "kedarnath",
    name: "Kedarnath Jyotirlinga",
    deity: "Shiva",
    state: "Uttarakhand",
    city: "Kedarnath",
    category: "Jyotirlinga",
    timings: "4:00 AM – 9:00 PM (open May-Oct)",
    history: "One of Char Dham of India; highest Jyotirlinga in the Himalayas.",
  },
  {
    slug: "bhimashankar",
    name: "Bhimashankar Jyotirlinga",
    deity: "Shiva",
    state: "Maharashtra",
    city: "Pune district",
    category: "Jyotirlinga",
    timings: "4:30 AM – 9:30 PM",
    history: "In the Sahyadri hills; source of the Bhima river.",
  },
  {
    slug: "kashi-vishwanath",
    name: "Kashi Vishwanath",
    deity: "Shiva",
    state: "Uttar Pradesh",
    city: "Varanasi",
    category: "Jyotirlinga",
    timings: "2:30 AM – 11:00 PM (Mangala aarti at 3am)",
    history: "The eternal Kashi Kshetra; centre of Sanatan Dharma.",
  },
  {
    slug: "trimbakeshwar",
    name: "Trimbakeshwar",
    deity: "Shiva",
    state: "Maharashtra",
    city: "Nashik",
    category: "Jyotirlinga",
    timings: "5:30 AM – 9:00 PM",
    history: "Source of the Godavari; unique three-faced linga.",
  },
  {
    slug: "vaidyanath",
    name: "Vaidyanath (Baba Baidyanath)",
    deity: "Shiva",
    state: "Jharkhand",
    city: "Deoghar",
    category: "Jyotirlinga",
    timings: "4:00 AM – 3:30 PM, 6:00 PM – 9:00 PM",
    history: "The healing linga; Shravan mela draws millions.",
  },
  {
    slug: "nageshwar",
    name: "Nageshwar Jyotirlinga",
    deity: "Shiva",
    state: "Gujarat",
    city: "Dwarka",
    category: "Jyotirlinga",
    timings: "5:00 AM – 9:00 PM",
    history: "Near Dwarka; frees devotees from serpent-fear.",
  },
  {
    slug: "rameshwaram",
    name: "Rameshwaram (Ramanathaswamy)",
    deity: "Shiva",
    state: "Tamil Nadu",
    city: "Rameshwaram",
    category: "Jyotirlinga",
    timings: "5:00 AM – 1:00 PM, 3:00 PM – 9:00 PM",
    history: "Installed by Sri Rama before crossing to Lanka; longest corridor in India.",
  },
  {
    slug: "grishneshwar",
    name: "Grishneshwar",
    deity: "Shiva",
    state: "Maharashtra",
    city: "Aurangabad",
    category: "Jyotirlinga",
    timings: "5:30 AM – 9:30 PM",
    history: "The twelfth jyotirlinga; near the Ellora caves.",
  },
  {
    slug: "badrinath",
    name: "Badrinath Dham",
    deity: "Vishnu (Badri Narayan)",
    state: "Uttarakhand",
    city: "Badrinath",
    category: "Char Dham",
    timings: "4:30 AM – 1:00 PM, 4:00 PM – 9:00 PM (May-Nov)",
    history: "One of four Char Dham; abode of Nara-Narayana.",
  },
  {
    slug: "dwarka",
    name: "Dwarkadhish Temple",
    deity: "Krishna",
    state: "Gujarat",
    city: "Dwarka",
    category: "Char Dham",
    timings: "6:00 AM – 1:00 PM, 5:00 PM – 9:30 PM",
    history: "Krishna's kingdom of Dwaraka; one of the Char Dhams.",
  },
  {
    slug: "jagannath-puri",
    name: "Jagannath Puri",
    deity: "Jagannath",
    state: "Odisha",
    city: "Puri",
    category: "Char Dham",
    timings: "5:00 AM – 12:00 AM",
    history: "Home of Rath Yatra; darshan of Jagannath, Balabhadra and Subhadra.",
  },
  {
    slug: "kalighat",
    name: "Kalighat Kali",
    deity: "Kali",
    state: "West Bengal",
    city: "Kolkata",
    category: "Shakti Peeth",
    timings: "5:00 AM – 2:00 PM, 5:00 PM – 10:30 PM",
    history: "Sati's toes fell here; one of the 51 Shakti Peethas.",
  },
  {
    slug: "vaishno-devi",
    name: "Vaishno Devi",
    deity: "Devi (Trikuta)",
    state: "Jammu & Kashmir",
    city: "Katra",
    category: "Shakti Peeth",
    timings: "24 hours (weather permitting)",
    history: "13 km trek; darshan of Maha Kali, Maha Lakshmi, Maha Saraswati.",
  },
  {
    slug: "kamakhya",
    name: "Kamakhya Devi",
    deity: "Kamakhya",
    state: "Assam",
    city: "Guwahati",
    category: "Shakti Peeth",
    timings: "8:00 AM – 1:00 PM, 2:30 PM – 5:30 PM",
    history: "The seat of Kama; central to Tantric worship.",
  },
  {
    slug: "meenakshi",
    name: "Meenakshi Amman Temple",
    deity: "Meenakshi (Parvati)",
    state: "Tamil Nadu",
    city: "Madurai",
    category: "Devi",
    timings: "5:00 AM – 12:30 PM, 4:00 PM – 10:00 PM",
    history: "Marriage of Meenakshi and Sundareshwar; 14 gopurams.",
  },
  {
    slug: "tirumala",
    name: "Tirumala Venkateshwara",
    deity: "Venkateshwara (Vishnu)",
    state: "Andhra Pradesh",
    city: "Tirupati",
    category: "Vishnu",
    timings: "3:00 AM – 12:00 AM",
    history: "Most-visited temple in the world; Balaji darshan.",
  },
  {
    slug: "siddhivinayak",
    name: "Siddhivinayak Temple",
    deity: "Ganesha",
    state: "Maharashtra",
    city: "Mumbai",
    category: "Ganesha",
    timings: "5:30 AM – 10:00 PM",
    history: "One of the ashtavinayaka lineage; Mumbai's most beloved Ganesha.",
  },
  {
    slug: "ashtavinayak-morgaon",
    name: "Mayureshwar (Morgaon)",
    deity: "Ganesha",
    state: "Maharashtra",
    city: "Morgaon",
    category: "Ganesha",
    timings: "5:00 AM – 10:00 PM",
    history: "First of the ashtavinayaka circuit.",
  },
  {
    slug: "sanwaliya-seth",
    name: "Sanwaliya Seth",
    deity: "Krishna",
    state: "Rajasthan",
    city: "Mandaphia",
    category: "Vishnu",
    timings: "5:30 AM – 11:00 PM",
    history: "The merchant-Krishna of Mewar.",
  },
  {
    slug: "sri-hanuman-mandir",
    name: "Salasar Balaji",
    deity: "Hanuman",
    state: "Rajasthan",
    city: "Salasar",
    category: "Hanuman",
    timings: "24 hours",
    history: "Beard-bearing Hanuman; one of India's most-visited Hanuman temples.",
  },
  {
    slug: "mehandipur-balaji",
    name: "Mehandipur Balaji",
    deity: "Hanuman",
    state: "Rajasthan",
    city: "Mehandipur",
    category: "Hanuman",
    timings: "6:00 AM – 8:00 PM",
    history: "Famed for releasing devotees from psychological affliction.",
  },
];

/* ─────────────── PUJA SAMAGRI (per puja) ─────────────── */
export interface Samagri {
  puja: string;
  items: { name: string; qty: string; note?: string }[];
}
export const SAMAGRI_LISTS: Samagri[] = [
  {
    puja: "Ganesh Puja",
    items: [
      { name: "Modak (or laddoo)", qty: "21" },
      { name: "Durva grass", qty: "21 blades" },
      { name: "Red hibiscus / marigold", qty: "1 mala" },
      { name: "Kumkum, chandan, akshat", qty: "small bowls" },
      { name: "Ghee diya + agarbatti", qty: "1 each" },
      { name: "Panchamrit", qty: "1 cup" },
      { name: "Coconut, betel, banana", qty: "1 each" },
    ],
  },
  {
    puja: "Lakshmi Puja (Diwali)",
    items: [
      { name: "Lakshmi-Ganesha murti or picture", qty: "1" },
      { name: "Silver coin", qty: "1" },
      { name: "Kalash with water, mango leaves, coconut", qty: "1" },
      { name: "Kheel, batasha, sugar toys", qty: "1 plate" },
      { name: "Kamal (lotus) flower or kamalgatta mala", qty: "1" },
      { name: "Ghee diya", qty: "5+" },
      { name: "Roli, chandan, akshat, kalava", qty: "small bowls" },
    ],
  },
  {
    puja: "Shiv Puja",
    items: [
      { name: "Bilva leaves (bel patra)", qty: "108 or 21" },
      { name: "Milk, water, honey, curd, ghee, sugar", qty: "for panchamrit abhishek" },
      { name: "Bhang / dhatura fruit", qty: "1 (optional)" },
      { name: "Chandan, bhasma", qty: "small bowls" },
      { name: "White flowers", qty: "1 mala" },
      { name: "Rudraksha mala for jaap", qty: "1" },
    ],
  },
  {
    puja: "Durga Puja",
    items: [
      { name: "Red hibiscus flowers", qty: "1 mala + 9 flowers" },
      { name: "Sindoor, kumkum", qty: "small bowls" },
      { name: "9 different fruits (nau-phal)", qty: "9" },
      { name: "Red chunri", qty: "1" },
      { name: "Kalash + coconut + mango leaves", qty: "1 kalash" },
      { name: "Ghee diya + kapoor", qty: "1 each" },
      { name: "Durga Saptashati book", qty: "1" },
    ],
  },
  {
    puja: "Hanuman Puja",
    items: [
      { name: "Sindoor + til oil", qty: "for chola" },
      { name: "Boondi laddoo", qty: "11 or 21" },
      { name: "Red / orange cloth", qty: "1" },
      { name: "Tulsi mala (for jaap)", qty: "1" },
      { name: "Bel patra + red flowers", qty: "as available" },
      { name: "Ghee diya + agarbatti", qty: "1 each" },
      { name: "Hanuman Chalisa book", qty: "1" },
    ],
  },
  {
    puja: "Satyanarayan Puja",
    items: [
      { name: "Wheat / rice for chowk", qty: "5 kg" },
      { name: "Chowki + red cloth", qty: "1" },
      { name: "Kalash with water + coconut", qty: "1" },
      { name: "Panchamrit ingredients", qty: "1 set" },
      {
        name: "Kesari sheera (halwa) — main prasad",
        qty: "1 batch (banana, semolina, ghee, sugar, milk)",
      },
      { name: "Tulsi leaves", qty: "21" },
      { name: "Satyanarayan katha book", qty: "1" },
      { name: "Ghee diya + agarbatti + kapoor", qty: "1 each" },
    ],
  },
  {
    puja: "Griha Pravesh",
    items: [
      { name: "Kalash with water, coconut, mango leaves", qty: "1" },
      { name: "Ganesha murti (for main door)", qty: "1" },
      { name: "Milk + water for boiling (over new stove)", qty: "1 pot" },
      { name: "Rice + turmeric for chowk", qty: "1 kg" },
      { name: "Navadhanya (9 grains)", qty: "small quantity" },
      { name: "Ghee diyas + kapoor", qty: "5+" },
      { name: "Fresh flowers + garlands", qty: "as decoration" },
    ],
  },
  {
    puja: "Havan / Yajna",
    items: [
      { name: "Havan kund + wooden logs (samidha)", qty: "1 + 21 logs" },
      { name: "Ghee (cow ghee)", qty: "500 ml" },
      { name: "Hawan samagri mix", qty: "500 g" },
      { name: "Til, jau, akshat, rice", qty: "small bowls" },
      { name: "Coconut (for purnahuti)", qty: "1" },
      { name: "Kapoor + agarbatti", qty: "1 each" },
    ],
  },
];

/* ─────────────── GEMSTONES ─────────────── */
export const GEMSTONES: {
  rashi: string;
  primary: string;
  alt: string;
  wear: string;
  metal: string;
}[] = [
  {
    rashi: "Mesha (Aries)",
    primary: "Red Coral",
    alt: "Ruby",
    wear: "Ring finger",
    metal: "Gold or Copper",
  },
  {
    rashi: "Vrishabha (Taurus)",
    primary: "Diamond",
    alt: "White Sapphire",
    wear: "Little finger",
    metal: "Silver or Platinum",
  },
  {
    rashi: "Mithuna (Gemini)",
    primary: "Emerald",
    alt: "Peridot",
    wear: "Little finger",
    metal: "Silver or Gold",
  },
  {
    rashi: "Karka (Cancer)",
    primary: "Pearl",
    alt: "Moonstone",
    wear: "Little finger",
    metal: "Silver",
  },
  { rashi: "Simha (Leo)", primary: "Ruby", alt: "Red Spinel", wear: "Ring finger", metal: "Gold" },
  {
    rashi: "Kanya (Virgo)",
    primary: "Emerald",
    alt: "Peridot",
    wear: "Little finger",
    metal: "Gold",
  },
  {
    rashi: "Tula (Libra)",
    primary: "Diamond",
    alt: "White Sapphire",
    wear: "Middle finger",
    metal: "Platinum",
  },
  {
    rashi: "Vrishchika (Scorpio)",
    primary: "Red Coral",
    alt: "Carnelian",
    wear: "Ring finger",
    metal: "Copper or Gold",
  },
  {
    rashi: "Dhanu (Sagittarius)",
    primary: "Yellow Sapphire",
    alt: "Citrine or Yellow Topaz",
    wear: "Index finger",
    metal: "Gold",
  },
  {
    rashi: "Makara (Capricorn)",
    primary: "Blue Sapphire",
    alt: "Amethyst",
    wear: "Middle finger",
    metal: "Silver / Panchdhatu",
  },
  {
    rashi: "Kumbha (Aquarius)",
    primary: "Blue Sapphire",
    alt: "Lapis Lazuli",
    wear: "Middle finger",
    metal: "Silver",
  },
  {
    rashi: "Meena (Pisces)",
    primary: "Yellow Sapphire",
    alt: "Golden Topaz",
    wear: "Index finger",
    metal: "Gold",
  },
];

/* ─────────────── PRASAD RECIPES ─────────────── */
export const PRASAD_RECIPES: {
  name: string;
  deity: string;
  occasion: string;
  ingredients: string[];
  steps: string[];
}[] = [
  {
    name: "Modak (Ukadiche)",
    deity: "Ganesha",
    occasion: "Ganesh Chaturthi",
    ingredients: [
      "Rice flour 1 cup",
      "Grated coconut 1 cup",
      "Jaggery 3/4 cup",
      "Cardamom powder 1/2 tsp",
      "Ghee 1 tsp",
      "Salt a pinch",
    ],
    steps: [
      "Melt jaggery with coconut till thick; add cardamom.",
      "Boil water with ghee and salt; add rice flour; knead.",
      "Shape into small cups, fill with coconut-jaggery, seal into flower buds.",
      "Steam for 10 minutes; offer with ghee.",
    ],
  },
  {
    name: "Panchamrit",
    deity: "All",
    occasion: "Any puja",
    ingredients: [
      "Milk 1 cup",
      "Curd 1/2 cup",
      "Ghee 1 tbsp",
      "Honey 2 tbsp",
      "Sugar 2 tbsp",
      "Tulsi leaves 5",
    ],
    steps: ["Whisk all ingredients gently.", "Offer after abhishek and distribute as prasad."],
  },
  {
    name: "Kesari Sheera (Sooji Halwa)",
    deity: "Satyanarayan",
    occasion: "Satyanarayan Puja",
    ingredients: [
      "Semolina 1 cup",
      "Ghee 1/2 cup",
      "Sugar 1 cup",
      "Milk 1 cup",
      "Water 1 cup",
      "Banana 1 (sliced)",
      "Cardamom, saffron, cashew, raisin",
    ],
    steps: [
      "Roast semolina in ghee till golden.",
      "Simmer milk + water + sugar + saffron.",
      "Add hot liquid to semolina; stir till thick.",
      "Fold in banana, cardamom, garnish with nuts.",
    ],
  },
  {
    name: "Boondi Laddoo",
    deity: "Hanuman",
    occasion: "Tuesday / Hanuman Jayanti",
    ingredients: [
      "Besan 1 cup",
      "Ghee for frying",
      "Sugar 1 cup",
      "Water 1/2 cup",
      "Cardamom powder",
    ],
    steps: [
      "Prepare besan batter; fry boondi by pressing through a perforated ladle.",
      "Make one-string sugar syrup.",
      "Soak boondi in warm syrup; shape into laddoos while warm.",
    ],
  },
  {
    name: "Sabudana Khichdi",
    deity: "Krishna / Devi",
    occasion: "Vrat / Ekadashi",
    ingredients: [
      "Sago (soaked) 1 cup",
      "Peanuts (roasted, crushed) 1/2 cup",
      "Boiled potato (diced) 1",
      "Ghee 2 tbsp",
      "Cumin, green chilli, curry leaves",
      "Rock salt",
    ],
    steps: [
      "Temper cumin, chilli, curry leaves in ghee.",
      "Add potato; sauté briefly.",
      "Add sabudana + peanuts + rock salt; toss on low flame till translucent.",
      "Garnish with coriander and lemon.",
    ],
  },
  {
    name: "Sheera (Rava)",
    deity: "Any",
    occasion: "Any auspicious day",
    ingredients: [
      "Semolina 1 cup",
      "Ghee 1/2 cup",
      "Sugar 3/4 cup",
      "Milk / water 2 cups",
      "Cardamom",
    ],
    steps: [
      "Roast semolina in ghee till aromatic.",
      "Add hot milk-water-sugar mixture carefully.",
      "Cook till it leaves the sides; garnish with nuts.",
    ],
  },
  {
    name: "Panjiri (Krishna Janmashtami)",
    deity: "Krishna",
    occasion: "Janmashtami",
    ingredients: [
      "Whole wheat flour 1 cup",
      "Ghee 1/2 cup",
      "Powdered sugar 3/4 cup",
      "Assorted dry fruits, dry ginger, cardamom, makhana",
    ],
    steps: [
      "Roast makhana in ghee, crush lightly.",
      "Roast atta in ghee till golden.",
      "Cool; mix in sugar, dry fruits, spices; store airtight.",
    ],
  },
  {
    name: "Kada Prasad (Halwa)",
    deity: "Any",
    occasion: "Any bhandara / puja",
    ingredients: [
      "Whole wheat flour 1 cup",
      "Ghee 1 cup",
      "Sugar 1 cup",
      "Water 3 cups",
      "Cardamom",
    ],
    steps: [
      "Boil sugar in water till dissolved.",
      "In another pan, roast atta in ghee till dark and fragrant.",
      "Add hot syrup carefully; stir till thick and glossy.",
    ],
  },
];

/* ─────────────── AARTI THALI GUIDE ─────────────── */
export const AARTI_THALI_ITEMS: { item: string; purpose: string }[] = [
  {
    item: "Ghee lamp (5 or 7 wicks)",
    purpose: "Represents the light of consciousness offered to the Divine.",
  },
  {
    item: "Camphor (kapoor)",
    purpose: "Burnt at the end — dissolves without residue, symbolising ego dissolution.",
  },
  { item: "Dhoop / agarbatti", purpose: "Purifies the space; fragrance represents devotion." },
  { item: "Roli / kumkum + akshat", purpose: "Applied as tilak before and after aarti." },
  { item: "Fresh flowers", purpose: "Offered during aarti; symbol of beauty and impermanence." },
  { item: "Small bell", purpose: "Rung to invite devas and ward off inauspiciousness." },
  { item: "Water (achman patra)", purpose: "For self-purification before and after aarti." },
  { item: "Naivedya (bhog)", purpose: "Food offering to be shown to the deity during aarti." },
];

/* ─────────────── SHARED HELPERS ─────────────── */
export function iastToDevanagari(input: string): string {
  // Simple approximate converter — covers common IAST vowels + consonants + anusvara.
  const map: Record<string, string> = {
    ā: "आ",
    ī: "ई",
    ū: "ऊ",
    ṛ: "ऋ",
    ṝ: "ॠ",
    ḷ: "ऌ",
    e: "ए",
    ai: "ऐ",
    o: "ओ",
    au: "औ",
    aṁ: "अं",
    aḥ: "अः",
    a: "अ",
    i: "इ",
    u: "उ",
    kh: "ख",
    gh: "घ",
    ṅ: "ङ",
    ch: "छ",
    jh: "झ",
    ñ: "ञ",
    ṭh: "ठ",
    ḍh: "ढ",
    ṇ: "ण",
    th: "थ",
    dh: "ध",
    ph: "फ",
    bh: "भ",
    k: "क",
    g: "ग",
    c: "च",
    j: "ज",
    ṭ: "ट",
    ḍ: "ड",
    t: "त",
    d: "द",
    n: "न",
    p: "प",
    b: "ब",
    m: "म",
    y: "य",
    r: "र",
    l: "ल",
    v: "व",
    ś: "श",
    ṣ: "ष",
    s: "स",
    h: "ह",
    ṁ: "ं",
    ḥ: "ः",
    " ": " ",
    ".": "।",
    "|": "।",
  };
  const vowelMap: Record<string, string> = {
    ā: "ा",
    i: "ि",
    ī: "ी",
    u: "ु",
    ū: "ू",
    ṛ: "ृ",
    e: "े",
    ai: "ै",
    o: "ो",
    au: "ौ",
    a: "",
  };
  const consonants = new Set([
    "क",
    "ख",
    "ग",
    "घ",
    "ङ",
    "च",
    "छ",
    "ज",
    "झ",
    "ञ",
    "ट",
    "ठ",
    "ड",
    "ढ",
    "ण",
    "त",
    "थ",
    "द",
    "ध",
    "न",
    "प",
    "फ",
    "ब",
    "भ",
    "म",
    "य",
    "र",
    "ल",
    "व",
    "श",
    "ष",
    "स",
    "ह",
  ]);
  let out = "";
  let i = 0;
  const s = input;
  while (i < s.length) {
    let matched = false;
    for (const len of [3, 2, 1]) {
      const seg = s.slice(i, i + len);
      if (map[seg]) {
        const cons = map[seg];
        // Look ahead for vowel to combine with virama style
        let vowelPart = "";
        let advance = len;
        if (consonants.has(cons)) {
          for (const vlen of [2, 1]) {
            const vseg = s.slice(i + len, i + len + vlen);
            if (vowelMap[vseg] !== undefined) {
              vowelPart = vowelMap[vseg];
              advance += vlen;
              break;
            }
          }
          if (advance === len) {
            // no vowel found; add halant
            vowelPart = "्";
          }
        }
        out += cons + vowelPart;
        i += advance;
        matched = true;
        break;
      }
    }
    if (!matched) {
      out += s[i];
      i++;
    }
  }
  return out;
}

export function nameNumerology(name: string): { number: number; meaning: string } {
  // Pythagorean mapping for Latin letters.
  const table: Record<string, number> = {
    a: 1,
    j: 1,
    s: 1,
    b: 2,
    k: 2,
    t: 2,
    c: 3,
    l: 3,
    u: 3,
    d: 4,
    m: 4,
    v: 4,
    e: 5,
    n: 5,
    w: 5,
    f: 6,
    o: 6,
    x: 6,
    g: 7,
    p: 7,
    y: 7,
    h: 8,
    q: 8,
    z: 8,
    i: 9,
    r: 9,
  };
  const sum = [...name.toLowerCase()].reduce((s, c) => s + (table[c] ?? 0), 0);
  const number = reduceToDigit(sum);
  const meanings: Record<number, string> = {
    1: "Leader, pioneer, independent — Surya's vibration.",
    2: "Harmoniser, sensitive, cooperative — Chandra's vibration.",
    3: "Expressive, creative, joyful — Guru's vibration.",
    4: "Grounded, disciplined, structural — Rahu's vibration.",
    5: "Adaptable, curious, communicative — Budh's vibration.",
    6: "Nurturing, artistic, harmonious — Shukra's vibration.",
    7: "Introspective, spiritual, seeking — Ketu's vibration.",
    8: "Powerful, karmic, transformative — Shani's vibration.",
    9: "Compassionate, universal, complete — Mangal's vibration.",
  };
  return { number, meaning: meanings[number] ?? "" };
}

export function lifePathNumber(dob: string): number {
  const digits = dob.replace(/\D/g, "");
  const sum = [...digits].reduce((s, d) => s + Number(d), 0);
  return reduceToDigit(sum);
}

function reduceToDigit(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = [...String(n)].reduce((s, d) => s + Number(d), 0);
  }
  return n;
}

export function dashaSequence(
  startNakshatraIndex: number,
  birthYear: number,
): { planet: string; years: number; startYear: number; endYear: number }[] {
  // Vimshottari dasha lords in nakshatra order (starting Ketu)
  const lords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
  const years: Record<string, number> = {
    Ketu: 7,
    Venus: 20,
    Sun: 6,
    Moon: 10,
    Mars: 7,
    Rahu: 18,
    Jupiter: 16,
    Saturn: 19,
    Mercury: 17,
  };
  const lordOfNak = lords[startNakshatraIndex % 9];
  const startIdx = lords.indexOf(lordOfNak);
  const out: { planet: string; years: number; startYear: number; endYear: number }[] = [];
  let cur = birthYear;
  for (let i = 0; i < 9; i++) {
    const p = lords[(startIdx + i) % 9];
    const y = years[p];
    out.push({ planet: p, years: y, startYear: cur, endYear: cur + y });
    cur += y;
  }
  return out;
}
