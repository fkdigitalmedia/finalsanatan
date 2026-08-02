import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translationsDir = path.resolve(__dirname, "../src/i18n/translations");

const navTranslations = {
  en: { horoscope: "Horoscope", daily_horoscope: "Daily Horoscope", blog: "Blog" },
  hi: { horoscope: "राशिफल", daily_horoscope: "दैनिक राशिफल", blog: "ब्लॉग" },
  mr: { horoscope: "राशीभविष्य", daily_horoscope: "दैनिक राशीभविष्य", blog: "ब्लॉग" },
  gu: { horoscope: "રાશિફળ", daily_horoscope: "દૈનિક રાશિફળ", blog: "બ્લોગ" },
  bn: { horoscope: "রাশিফল", daily_horoscope: "দৈনিক রাশিফল", blog: "ব্লগ" },
  pa: { horoscope: "ਰਾਸ਼ੀਫਲ", daily_horoscope: "ਰੋਜ਼ਾਨਾ ਰਾਸ਼ੀਫਲ", blog: "ਬਲੌਗ" },
  ta: { horoscope: "ராசிபலன்", daily_horoscope: "தினசரி ராசிபலன்", blog: "வலைப்பதிவு" },
  te: { horoscope: "రాశిఫలాలు", daily_horoscope: "దినఫలాలు", blog: "బ్లాగ్" },
  kn: { horoscope: "ರಾಶಿಭವಿಷ್ಯ", daily_horoscope: "ದೈನಂದಿನ ರಾಶಿಭವಿಷ್ಯ", blog: "ಬ್ಲಾಗ್" },
  ml: { horoscope: "രാശിഫലം", daily_horoscope: "ദിനഫലം", blog: "ബ്ലോഗ്" },
  or: { horoscope: "ରାଶିଫଳ", daily_horoscope: "ଦୈନିକ ରାଶିଫଳ", blog: "ବ୍ଲଗ୍" },
  as: { horoscope: "ৰাশিফল", daily_horoscope: "দৈনিক ৰাশিফল", blog: "ব্লগ" },
};

const footerLinkTranslations = {
  en: {
    support: "Support",
    faq: "FAQ",
    editorial_policy: "Editorial Policy",
    accessibility: "Accessibility",
    ai_disclaimer: "AI Disclaimer",
    all_legal: "All Legal",
  },
  hi: {
    support: "सहायता",
    faq: "सामान्य प्रश्न",
    editorial_policy: "संपादकीय नीति",
    accessibility: "सुगम्यता",
    ai_disclaimer: "AI अस्वीकरण",
    all_legal: "सभी कानूनी पृष्ठ",
  },
  mr: {
    support: "मदत",
    faq: "वारंवार विचारले जाणारे प्रश्न",
    editorial_policy: "संपादकीय धोरण",
    accessibility: "सुलभता",
    ai_disclaimer: "AI असस्वीकरण",
    all_legal: "सर्व कायदेशीर",
  },
  gu: {
    support: "સહાય",
    faq: "પ્રશ્નોત્તરી",
    editorial_policy: "સંપાદકીય નીતિ",
    accessibility: "ઍક્સેસિબિલિટી",
    ai_disclaimer: "AI ડિસ્ક્લેમર",
    all_legal: "તમામ કાનૂની",
  },
  bn: {
    support: "সহায়তা",
    faq: "প্রশ্নোত্তর",
    editorial_policy: "সম্পাদকমণ্ডলীর নীতি",
    accessibility: "অ্যাক্সেসযোগ্যতা",
    ai_disclaimer: "AI ডিসক্লেমার",
    all_legal: "সকল আইনি তথ্য",
  },
  pa: {
    support: "ਸਹਾਇਤਾ",
    faq: "ਸਵਾਲ-ਜਵਾਬ",
    editorial_policy: "ਸੰਪਾਦਕੀ ਨੀਤੀ",
    accessibility: "ਸੁਗਮਤਾ",
    ai_disclaimer: "AI ਬੇਦਾਅਵਾ",
    all_legal: "ਸਾਰੇ ਕਾਨੂੰਨੀ",
  },
  ta: {
    support: "ஆதரவு",
    faq: "கேள்வி பதில்கள்",
    editorial_policy: "ஆசிரியர் கொள்கை",
    accessibility: "அணுகல்தன்மை",
    ai_disclaimer: "AI மறுப்பு",
    all_legal: "அனைத்து சட்டப்பூர்வ தகவல்",
  },
  te: {
    support: "మద్దతు",
    faq: "ప్రశ్నోత్తరాలు",
    editorial_policy: "ఎడిటోరియల్ విధానం",
    accessibility: "యాక్సెసిబిలిటీ",
    ai_disclaimer: "AI నిరాకరణ",
    all_legal: "అన్ని చట్టపరమైన",
  },
  kn: {
    support: "ಬೆಂಬಲ",
    faq: "ಪ್ರಶ್ನೋತ್ತರಗಳು",
    editorial_policy: "ಸಂಪಾದಕೀಯ ನೀತಿ",
    accessibility: "ಸಾಲು ಲಭ್ಯತೆ",
    ai_disclaimer: "AI ಹಕ್ಕುತ್ಯಾಗ",
    all_legal: "ಎಲ್ಲಾ ಕಾನೂನು",
  },
  ml: {
    support: "പിന്തുണ",
    faq: "ചോദ്യോത്തരങ്ങൾ",
    editorial_policy: "എഡിറ്റോറിയൽ നയം",
    accessibility: "ആക്സസിബിലിറ്റി",
    ai_disclaimer: "AI നിരാകരണം",
    all_legal: "എല്ലാ നിയമപരമായ",
  },
  or: {
    support: "ସହାୟତା",
    faq: "ପ୍ରଶ୍ନୋତ୍ତର",
    editorial_policy: "ସମ୍ପାଦକୀୟ ନୀତି",
    accessibility: "ସୁଗମତା",
    ai_disclaimer: "AI ଅସ୍ବୀକାରୋକ୍ତି",
    all_legal: "ସମସ୍ତ ଆଇନଗତ",
  },
  as: {
    support: "সহায়তা",
    faq: "প্রশ্নোত্তৰ",
    editorial_policy: "সম্পাদনা নীতি",
    accessibility: "অভিগম্যতা",
    ai_disclaimer: "AI অস্বীকাৰোক্তি",
    all_legal: "সকলো আইনী",
  },
};

const files = fs.readdirSync(translationsDir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const langCode = file.replace(".json", "");
  const filePath = path.join(translationsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  data.nav = data.nav || {};
  Object.assign(data.nav, navTranslations[langCode] || navTranslations.en);

  data.footer = data.footer || {};
  data.footer.links = data.footer.links || {};
  Object.assign(data.footer.links, footerLinkTranslations[langCode] || footerLinkTranslations.en);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Updated ${file} with nav & footer keys!`);
}

console.log("All translation files updated with nav & footer keys!");
