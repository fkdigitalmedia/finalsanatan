# Sanskrit Sandhi Splitter & Combiner Engine Documentation

## 1. Overview
The **Sanskrit Sandhi Splitter & Combiner Engine** (`src/components/tools/sandhi/sandhi-engine.ts`) provides a rule-based computational system for Sanskrit Sandhi splitting (विच्छेद) and combination (संयोजन) following classical **Paninian Ashtadhyayi** (अष्टाध्यायी) rules.

---

## 2. Supported Sandhi Categories & Sutras

### 2.1 स्वर सन्धि / अच् सन्धि (Vowel Sandhi)
- **दीर्घ सन्धि (Dirgha)**: *अकः सवर्णे दीर्घः (६.१.१०१)*
- **गुण सन्धि (Guna)**: *आद्गुणः (६.१.८७)*
- **वृद्धि सन्धि (Vriddhi)**: *वृद्धिरेचि (६.१.८८)*
- **यण् सन्धि (Yan)**: *इको यणचि (६.१.७७)*
- **अयादि सन्धि (Ayadi)**: *एचोऽयवायावः (६.१.७८)*
- **पूर्वरूप सन्धि (Purvarupa)**: *एङः पदान्तादति (६.१.१०९)*
- **पररूप सन्धि (Pararupa)**: *एङि पररूपम् (६.१.९४)*

### 2.2 व्यञ्जन सन्धि / हल् सन्धि (Consonant Sandhi)
- **श्चुत्व सन्धि (Schutva)**: *स्तोः श्चुना श्चुः (८.४.४०)*
- **जश्त्व सन्धि (Jashtva)**: *झलां जशोऽन्ते (८.२.३९)*
- **अनुनासिक सन्धि (Anunasika)**: *यरोऽनुनासिकेऽनुनासिको वा (८.४.४५)*
- **अनुस्वार सन्धि (Anusvara)**: *मोऽनुस्वारः (८.३.२३)*

### 2.3 विसर्ग सन्धि (Visarga Sandhi)
- **उत्व सन्धि (Utva)**: *अतो रोरप्लुतादप्लुते (६.१.११३) / हशि च (६.१.११४)*
- **सत्व सन्धि (Satva)**: *विसर्जनीयस्य सः (८.३.३४)*
- **रुत्व सन्धि (Rutva)**: *ससजुषो रुः (८.२.६६)*
- **लोप सन्धि (Lopa)**: *भोभगोअघोअपूर्वस्य योऽशि (८.३.१७)*

---

## 3. UI Features & API
- **Dual Mode Interface**: 1-Click switch between **विच्छेद (Splitter)** and **संयोजन (Joiner)**.
- **Equation Display**: Clear mathematical formula formatting `पूर्वपद + उत्तरपद = समस्त पद`.
- **40+ Classical Presets**: Quick insert for words like *धर्मक्षेत्रे, हिमालयः, देवेन्द्रः, सज्जनः, जगदीशः, शिवोऽहम्, मनोबलम्, इत्यादि*.
- **Audio Recitation & Copying**: TTS speech playback and instant clipboard export.
