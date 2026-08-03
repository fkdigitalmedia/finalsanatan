import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.resolve(__dirname, "../src/i18n/translations");

const aiPanelTranslations = {
  en: {
    title: "AI Kundli Analysis & Insights",
    subtitle: "Personalized AI-powered astrological interpretation of your birth chart",
    premium_badge: "PREMIUM REPORT",
    free_preview_badge: "FREE PREVIEW",
    unlock_full_report: "Unlock Full Report",
    premium_only: "Premium Feature",
    loading_title: "GENERATING AI KUNDLI INTERPRETATION",
    loading_subtitle: "Analyzing planetary placements, house positions & classical Vedic yogas...",
    loading_tips: {
      "0": "Calculating planetary dignities and Ashtakavarga strength...",
      "1": "Synthesizing Vimshottari Dasha sub-periods with natal chart placements...",
      "2": "Evaluating 150+ classical Yogas and Dosha cancellation rules...",
      "3": "Formatting custom personalized life recommendations..."
    },
    could_not_generate: "Could not generate AI interpretation",
    retry: "Retry",
    disclaimer: "Disclaimer: AI interpretations are generated using classical Vedic astrology principles for guidance and educational purposes."
  },
  hi: {
    title: "एआई कुंडली विश्लेषण और मार्गदर्शन",
    subtitle: "आपकी जन्मपत्रिका का व्यक्तिगत एआई-संचालित ज्योतिषीय विश्लेषण",
    premium_badge: "प्रीमियम रिपोर्ट",
    free_preview_badge: "मुफ़्त पूर्वावलोकन",
    unlock_full_report: "पूर्ण रिपोर्ट अनलॉक करें",
    premium_only: "केवल प्रीमियम सुविधा",
    loading_title: "एआई कुंडली विश्लेषण तैयार हो रहा है",
    loading_subtitle: "ग्रहों की स्थिति, भावों और शास्त्रीय वैदिक योगों का विश्लेषण किया जा रहा है...",
    loading_tips: {
      "0": "ग्रह बल और अष्टकवर्ग शक्ति की गणना की जा रही है...",
      "1": "विंशोत्तरी दशा और जन्म कुंडली का समन्वय किया जा रहा है...",
      "2": "150+ शास्त्रीय योगों और दोषों का मूल्यांकन किया जा रहा है...",
      "3": "व्यक्तिगत जीवन सलाह और सुझाव तैयार किए जा रहे हैं..."
    },
    could_not_generate: "एआई विश्लेषण उत्पन्न नहीं हो सका",
    retry: "पुनः प्रयास करें",
    disclaimer: "अस्वीकरण: एआई विश्लेषण शास्त्रीय वैदिक ज्योतिष सिद्धांतों पर आधारित है।"
  },
  mr: {
    title: "एआय कुंडली विश्लेषण आणि मार्गदर्शन",
    subtitle: "तुमच्या जन्मपत्रिकेचे वैयक्तिक एआय ज्योतिषीय विश्लेषण",
    premium_badge: "प्रीमियम अहवाल",
    free_preview_badge: "मोफत पूर्वावलोकन",
    unlock_full_report: "पूर्ण अहवाल अनलॉक करा",
    premium_only: "केवळ प्रीमियम वैशिष्ठ्य",
    loading_title: "एआय कुंडली विश्लेषण तयार होत आहे",
    loading_subtitle: "ग्रहांची स्थिती आणि वैदिक योगांचे विश्लेषण केले जात आहे...",
    loading_tips: {
      "0": "ग्रह बल आणि अष्टकवर्ग शक्तीची गणना केली जात आहे...",
      "1": "विंशोत्तरी दशा आणि जन्म कुंडलीचे विश्लेषण केले जात आहे...",
      "2": "150+ शास्त्रीय योग आणि दोष तपासले जात आहेत...",
      "3": "वैयक्तिक जीवन सल्ला तयार केला जात आहे..."
    },
    could_not_generate: "एआय विश्लेषण तयार होऊ शकले नाही",
    retry: "पुन्हा प्रयत्न करा",
    disclaimer: "अस्वीकरण: एआय विश्लेषण शास्त्रीय वैदिक ज्योतिष तत्त्वांवर आधारित आहे."
  },
  gu: {
    title: "એઆઈ કુંડળી વિશ્લેષણ અને માર્ગદર્શન",
    subtitle: "તમારી જન્મપત્રિકાનું વ્યક્તિગત એઆઈ જ્યોતિષીય વિશ્લેષણ",
    premium_badge: "પ્રીમિયમ રિપોર્ટ",
    free_preview_badge: "મફત પૂર્વાવલોકન",
    unlock_full_report: "સંપૂર્ણ રિપોર્ટ અનલૉક કરો",
    premium_only: "માત્ર પ્રીમિયમ સુવિધા",
    loading_title: "એઆઈ કુંડળી વિશ્લેષણ તૈયાર થઈ રહ્યું છે",
    loading_subtitle: "ગ્રહોની સ્થિતિ અને વૈદિક યોગોનું વિશ્લેષણ કરવામાં આવી રહ્યું છે...",
    loading_tips: {
      "0": "ગ્રહ બળ અને અષ્ટકવર્ગ શક્તિની ગણતરી થઈ રહી છે...",
      "1": "વિંશોત્તરી દશા અને જન્મ કુંડળીનું પૃથક્કરણ થઈ રહ્યું છે...",
      "2": "150+ શાસ્ત્રીય યોગોનું મૂલ્યાંકન થઈ રહ્યું છે...",
      "3": "વ્યક્તિગત જીવન સલાહ તૈયાર થઈ રહી છે..."
    },
    could_not_generate: "એઆઈ વિશ્લેષણ જનરેટ થઈ શક્યું નથી",
    retry: "ફરી પ્રયાસ કરો",
    disclaimer: "અસ્વીકરણ: એઆઈ વિશ્લેષણ શાસ્ત્રીય વૈદિક જ્યોતિષ સિદ્ધાંતો પર આધારિત છે."
  }
};

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const lang = path.basename(file, ".json");
  const filePath = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  if (!data.kundli) data.kundli = {};
  data.kundli.aiPanel = aiPanelTranslations[lang] || aiPanelTranslations.hi || aiPanelTranslations.en;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  console.log(`Updated ${file} with kundli.aiPanel translations.`);
}
