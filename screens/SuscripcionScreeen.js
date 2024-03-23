
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image, StyleSheet, Modal,ScrollView, Linking ,Easing, Animated, ImageBackground, Dimensions,Button,FlatList, Platform} from 'react-native';
import * as RNLocalize from "react-native-localize";
import { Ionicons } from '@expo/vector-icons';
import RNRestart from 'react-native-restart';
import PrivacyModal from './Links/PrivacyModal';
import EULAModal from './Links/EulaModal';
import GDPRModal from './Links/GDPRModal';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import TypingText from './TypingText'; // Asegúrate de que la ruta sea correcta
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import Purchases from 'react-native-purchases';

const windowHeight = Dimensions.get('window').height;

const windowWidth = Dimensions.get('window').width;

export default function SubscriptionScreen({ onClose, onRestore, isSubscribed,showCloseIcon, navigation   }) { 
  const [offerings, setOfferings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribed] = useState(false);
  const systemLanguage = RNLocalize.getLocales()[0]?.languageCode || 'en';
  const imageUrl = "https://app.hundezonen.ch/docs/peerrdddo.png";
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const [isEULAModalVisible, setIsEULAModalVisible] = useState(false);
  const [isGDPRModalVisible, setIsGDPRModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isFoodMosalTestVisible, setIsFoodMosalTestlVisible] = useState(false);
  const [isSubscriptionBenefitModalVisible, setIsSubscriptionBenefitModalVisible] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);
  const [currencyCode, setCurrencyCode] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const images = [
    require('../assets/imagenes/re.png'),
    require('../assets/imagenes/re.png'),
    require('../assets/imagenes/re.png'),
    require('../assets/imagenes/re.png'),
];


const openModalWithImage = (image) => {
  setSelectedImage(image);
  setModalVisible(true);
};

const renderThumbnail = ({ item }) => (
  <TouchableOpacity onPress={() => openModalWithImage(item)}>
      <FastImage source={item} style={styles.thumbnail} />
  </TouchableOpacity>
);


  const getPriceForCurrency = (currencyCode) => {
    if (!currencyCode || !conversionRates[currencyCode]) {
      return `${currencySymbols['USD']}${basePriceUSD}/${monthTranslations['en']}`;  // Devuelve el precio en dólares si no hay información de conversión.
    }
  
    const convertedPrice = basePriceUSD * conversionRates[currencyCode];
    return `${currencySymbols[currencyCode]}${convertedPrice.toFixed(2)}/${monthTranslations[systemLanguage] || monthTranslations['en']}`;
  }
  

useEffect(() => {
  const fetchCurrencyCode = async () => {
    try {
      const response = await axios.get('https://ipapi.co/currency/');
      setCurrencyCode(response.data);
    } catch (error) {
      console.error("Error fetching currency code: ", error);
    }
  };

  fetchCurrencyCode();
}, []);


  const handleSupportPress = async () => {
    try {
        const restoredPurchases = await Purchases.restorePurchases();
        
        if (restoredPurchases && restoredPurchases.entitlements.active['1661']) {
            const startDate = new Date(restoredPurchases.allPurchaseDates['1661']).toLocaleDateString();
            const expirationDate = new Date(restoredPurchases.allExpirationDates['1661']).toLocaleDateString();
            const userId = restoredPurchases.originalAppUserId;
            
            // Get the device model
            const deviceModel = DeviceInfo.getModel();

            // Get the OS version
            const systemVersion = DeviceInfo.getSystemVersion();

            const emailBody = `
                Device Model: ${deviceModel}\n
                iOS Version: ${systemVersion}\n
                Subscription Start Date: ${startDate}\n
                Subscription Expiration Date: ${expirationDate}\n
                User ID: ${userId}\n
            `;

            const mailtoURL = `mailto:info@lweb.ch?subject=Subscription%20Support&body=${encodeURIComponent(emailBody)}`;
    
            Linking.openURL(mailtoURL).catch(err => console.error('Failed to open mail app:', err));
        } else {
            setIsSupportModalVisible(true);
            setTimeout(() => {
                setIsSupportModalVisible(false);
            }, 2000); // Close the modal after 2 seconds
        }
    } catch (error) {
        console.log('Error:', error);
    }
};
  
  const handlePrivacyPress = () => {
    setIsPrivacyModalVisible(true);
};

const handleEULAPress = () => {
    setIsEULAModalVisible(true);
};

const handleGDPRPress = () => {
    setIsGDPRModalVisible(true);
};

const handleContactPress = async () => {
  // Obtener el modelo del dispositivo
  const deviceModel = DeviceInfo.getModel();

  // Obtener la versión del sistema operativo
  const systemVersion = DeviceInfo.getSystemVersion();

  // Create the email body
  const emailBody = `Device Information:
Device Model: ${deviceModel}
iOS Version: ${systemVersion}`;

  // Crear el URL para abrir el correo
  const mailtoURL = `mailto:info@lweb.ch?body=${encodeURIComponent(emailBody)}`;

  // Intentar abrir la aplicación de correo
  Linking.openURL(mailtoURL).catch(err => console.error('Failed to open mail app:', err));
};



const showFoodMosalTest = () => {
  console.log('Button Pressed');
  setIsFoodMosalTestlVisible(true); // Esto se ha actualizado
};

const closeFoodMosalTest = () => {
  setIsFoodMosalTestlVisible(false); // Esto se ha actualizado
};

const titleTranslations = {
  en: "Dog-Mentor AI",
  es: "Dog-Mentor AI",
  de: "Dog-Mentor AI",
  fr: "Dog-Mentor AI",
  it: "Dog-Mentor AI",
  tr: "Dog-Mentor AI",
  pt: "Dog-Mentor AI", 
  ru: "Dog-Mentor AI", // Traducción en ruso añadida
  zh: "Dog-Mentor AI", // Traducción en chino añadida
  ja: "Dog-Mentor AI",
   pl: "Dog-Mentor AI", // Polaco
    sv: "Dog-Mentor AI", // Sueco
    hu: "Dog-Mentor AI", // Húngaro
    ar: "Dog-Mentor AI", // Árabe
    hi: "Dog-Mentor AI", // Hindú
    el: "Dog-Mentor AI"  // Griego Traducción en japonés añadida
};

const buttonTextTranslations = {
  en: "Subscribe",
  es: "Suscribirse",
  de: "Abonnieren",
  fr: "S'abonner",
  it: "Iscriviti",
  tr: "Abone Ol",
  pt: "Assinar", // Traducción en portugués añadida
  ru: "Подписаться", // Traducción en ruso añadida
  zh: "订阅", // Traducción en chino añadida
  ja: "登録する",
  pl: "Subskrybuj",    // Polaco
  sv: "Prenumerera",   // Sueco
  hu: "Feliratkozás",  // Húngaro
  ar: "الاشتراك",      // Árabe
  hi: "सदस्यता लें",   // Hindú
  el: "Εγγραφή"        // Griego// Traducción en japonés añadida
};

const restoreButtonTextTranslations = {
  en: "Restore Purchase",
  es: "Restaurar Compra",
  de: "Kauf wiederherstellen",
  fr: "Restaurer l'achat",
  it: "Ripristina acquisto",
  tr: "Satın Alma İşlemini Geri Yükle",
  pt: "Restaurar Compra", // Traducción en portugués añadida
  ru: "Восстановить покупку", // Traducción en ruso añadida
  zh: "恢复购买", // Traducción en chino añadida
  ja: "購入を復元する" ,
  sv: "Återställ köp",       // Sueco
  hu: "Vásárlás visszaállítása", // Húngaro
  ar: "استعادة الشراء",      // Árabe
  hi: "खरीद बहाल करें",     // Hindú
  el: "Επαναφορά αγοράς"     // Griego en japonés añadida
};

const accessButtonTextTranslations = {
  en: "PRESS HERE TO ENTER →",
  es: "PRESIONA AQUÍ PARA ENTRAR →",
  de: "HIER DRÜCKEN, UM EINZUTRETEN →",
  fr: "APPUYEZ ICI POUR ENTRER →",
  it: "PREMI QUI PER ENTRARE →",
  tr: "GİRMEK İÇİN BURAYA BASIN →",
  pt: "PRESSIONE AQUI PARA ENTRAR →",
  ru: "НАЖМИТЕ ЗДЕСЬ, ЧТОБЫ ВОЙТИ →",
  zh: "按此进入 →",
  ja: "ここを押して入る →",
  sv: "TRYCK HÄR FÖR ATT GÅ IN →",
  hu: "IDE KATTINTS A BELÉPÉSHEZ →",
  ar: "اضغط هنا للدخول →",
  hi: "प्रवेश करने के लिए यहाँ दबाएँ →",
  el: "ΠΑΤΉΣΤΕ ΕΔΏ ΓΙΑ ΝΑ ΕΙΣΈΛΘΕΤΕ →",
  // Añade más idiomas según sea necesario
};



const benefitTitleTranslations = {
    en: [
      { title: "Generates Texts and Images", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
      { title: "Breed Identifier", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
      { title: "Clicker Training", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
      { title: "Dog Recipes", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
    ],
    es: [
      { title: "Genera textos e imágenes", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
      { title: "Identificador de Razas", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
      { title: "Entrenamiento con Clicker", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
      { title: "Recetas para Perros", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
      
    ],
    de: [
      { title: "Generiert Texte und Bilder", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
      { title: "Rassenidentifikator", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
      { title: "Clicker-Training", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
      { title: "Hunderezepte", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
    ],
    fr: [
      { title: "Génère des textes et des images", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
      { title: "Identificateur de Race", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
      { title: "Entraînement au Clicker", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
      { title: "Recettes pour Chiens", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
    ],
    it: [
      { title: "Genera testi e immagini", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
      { title: "Identificatore di Razza", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
      { title: "Allenamento con Clicker", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
      { title: "Ricette per Cani", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
    ],
    tr: [
      { title: "Metin ve Resim Üretir", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
      { title: "Irk Tanımlayıcı", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
      { title: "Clicker Eğitimi", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
      { title: "Köpek Tarifleri", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
    ],
    pt: [
      { title: "Gera textos e imagens", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
      { title: "Identificador de Raça", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
      { title: "Treinamento com Clicker", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
      { title: "Receitas para Cães", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
    ],
    ru: [
      { title: "Генерирует тексты и изображения", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
      { title: "Идентификатор породы", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
      { title: "Тренировка с кликером", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
      { title: "Рецепты для собак", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
    ],
    zh: [
      { title: "生成文本和图片", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
      { title: "品种识别", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
      { title: "点击器训练", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
      { title: "狗的食谱", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
    ],
    ja: [
      { title: "テキストと画像を生成する", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
      { title: "犬種識別器", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
      { title: "クリッカートレーニング", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
      { title: "犬のレシピ", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
    ],
  pl: [
    { title: "Czat z AI", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "Identyfikator rasy", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
    { title: "Trening z clickerem", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "Przepisy dla psów", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
  ],
  sv: [
    { title: "AI Chatt", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "Rasidentifierare", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
    { title: "Clickerträning", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "Hundrecept", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
  ],
  hu: [
    { title: "AI Chat", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "Fajta azonosító", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
    { title: "Clicker edzés", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "Kutyareceptek", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
  ],

  ar: [
    { title: "دردشة الذكاء الاصطناعي", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "معرف السلالة", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
    { title: "تدريب النقر", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "وصفات الكلب", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
  ],
  hi: [
    { title: "एआई चैट", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "नस्ल पहचानकर्ता", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
    { title: "क्लिकर प्रशिक्षण", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "कुत्ते के व्यंजन", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },
  ],
  el: [
    { title: "Συνομιλία με AI", imageUrl: 'https://app.hundezonen.ch/docs/icons8-bot-48.png' },
    { title: "Αναγνωριστής φυλής", imageUrl: 'https://app.hundezonen.ch/docs/patas.png' },
    { title: "Εκπαίδευση κλικ", imageUrl: 'https://app.hundezonen.ch/docs/cliker1%20copia.png' },
    { title: "Συνταγές για σκύλους", imageUrl: 'https://app.hundezonen.ch/docs/comida-de-perro.png' },

  ],

};


const benefitDescriptionTranslations = {
  en: [
    "Get instant answers related to the well-being or any doubts about your dog. 🤖🗨️",
    "Identify your dog's breed with AI-powered technology. 🐶🔍",
    "Enhance your dog's skills and behavior with effective clicker training. 🎓🐕",
  ],
  es: [
    "Recibe respuestas al instante relacionadas con el bienestar o cualquier duda sobre tu perro. 🤖🗨️",
    "Identifica la raza de tu perro con tecnología impulsada por IA. 🐶🔍",
    "Mejora las habilidades y el comportamiento de tu perro con un efectivo entrenamiento con clicker. 🎓🐕",
  ],
  de: [
    "Erhalte sofortige Antworten zu Fragen zum Wohlbefinden oder anderen Zweifeln bezüglich deines Hundes. 🤖🗨️",
    "Identifiziere die Rasse deines Hundes mit KI-Technologie. 🐶🔍",
    "Verbessere die Fähigkeiten und das Verhalten deines Hundes mit effektivem Clicker-Training. 🎓🐕",
  ],
  fr: [
    "Recevez des réponses instantanées concernant le bien-être ou toute autre question concernant votre chien. 🤖🗨️",
    "Identifiez la race de votre chien avec la technologie alimentée par l'IA. 🐶🔍",
    "Améliorez les compétences et le comportement de votre chien avec une formation au clicker efficace. 🎓🐕",
  ],
  it: [
    "Ricevi risposte immediate relative al benessere o qualsiasi dubbio sul tuo cane. 🤖🗨️",
    "Identifica la razza del tuo cane con la tecnologia alimentata da IA. 🐶🔍",
    "Migliora le competenze e il comportamento del tuo cane con un efficace allenamento con il clicker. 🎓🐕",
  ],
  tr: [
    "Köpeğinizin sağlığı veya herhangi bir şüphesi hakkında anında yanıt alın. 🤖🗨️",
    "Köpeğinizin ırkını AI destekli teknoloji ile belirleyin. 🐶🔍",
    "Etkili bir tıklama eğitimi ile köpeğinizin becerilerini ve davranışlarını geliştirin. 🎓🐕",
],

pt: [
  "Obtenha respostas instantâneas relacionadas ao bem-estar ou qualquer dúvida sobre seu cão. 🤖🗨️",
  "Identifique a raça do seu cão com a tecnologia alimentada por IA. 🐶🔍",
  "Aprimore as habilidades e comportamento do seu cão com um eficaz treinamento com clicker. 🎓🐕",
],
ru: [
  "Получите мгновенные ответы на вопросы о благополучии или сомнениях относительно вашей собаки. 🤖🗨️",
  "Определите породу вашей собаки с помощью технологии на базе ИИ. 🐶🔍",
  "Улучшите навыки и поведение вашей собаки с помощью эффективного тренировочного кликера. 🎓🐕",
],
zh: [
  "获取有关您的狗的健康或任何疑虑的即时答案。🤖🗨️",
  "使用 AI 技术识别您的狗的品种。🐶🔍",
  "用有效的点击器训练来增强您的狗的技能和行为。🎓🐕",
],
ja: [
  "あなたの犬の健康や疑問に関する即時の回答を取得します。🤖🗨️",
  "AI技術であなたの犬の品種を特定します。🐶🔍",
  "効果的なクリッカートレーニングであなたの犬のスキルと行動を向上させます。🎓🐕",
],
pl: [
  "Uzyskaj natychmiastowe odpowiedzi dotyczące dobrego samopoczucia lub wszelkich wątpliwości związanych z twoim psem. 🤖🗨️",
  "Zidentyfikuj rasę swojego psa za pomocą technologii zasilanej przez AI. 🐶🔍",
  "Popraw umiejętności i zachowanie swojego psa skutecznym treningiem z klikerem. 🎓🐕",
],
sv: [
  "Få omedelbara svar relaterade till välbefinnandet eller eventuella tvivel om din hund. 🤖🗨️",
  "Identifiera din hunds ras med AI-driven teknik. 🐶🔍",
  "Förbättra din hunds färdigheter och beteende med effektiv klickerträning. 🎓🐕",
],
hu: [
  "Azonnali válaszokat kap a kutyája jólétével vagy bármilyen kétségekkel kapcsolatban. 🤖🗨️",
  "Azonosítsa kutyája fajtáját AI-alapú technológiával. 🐶🔍",
  "Fejlessze kutyája készségeit és viselkedését hatékony klikker tréninggel. 🎓🐕",
],
ar: [
  "احصل على إجابات فورية تتعلق بالرفاهية أو أي شكوك حول كلبك. 🤖🗨️",
  "حدد سلالة كلبك بتقنية تعتمد على الذكاء الصناعي. 🐶🔍",
  "عزز مهارات وسلوك كلبك بتدريب فعال بالنقر. 🎓🐕",
],
hi: [
  "अपने कुत्ते की भलाई या किसी भी संदेह से संबंधित तुरंत उत्तर प्राप्त करें। 🤖🗨️",
  "एआई-पावर्ड तकनीक के साथ अपने कुत्ते की नस्ल की पहचान करें। 🐶🔍",
  "प्रभावी क्लिकर प्रशिक्षण के साथ अपने कुत्ते की कौशल और व्यवहार में वृद्धि करें। 🎓🐕",
],
el: [
  "Λάβετε άμεσες απαντήσεις σχετικά με την ευεξία ή οποιεσδήποτε αμφιβολίες σχετικά με τον σκύλο σας. 🤖🗨️",
  "Προσδιορίστε τη φυλή του σκύλου σας με την τεχνολογία που ενισχύεται από την AI. 🐶🔍",
  "Βελτιώστε τις δεξιότητες και τη συμπεριφορά του σκύλου σας με αποτελεσματική εκπαίδευση κλικ. 🎓🐕",
],

};

const tryClickerButtonTranslations = {
  en: "Test Version Dog Recipes 🦴",
  es: "Versión de Prueba Recetas para Perros 🦴",
  de: "Testversion Hundefutter Rezepte 🦴",
  fr: "Version d'Essai Recettes pour Chiens 🦴",
  it: "Versione di Prova Ricette per Cani 🦴",
  pt: "Versão de Teste Receitas para Cães 🦴",
  ru: "Тестовая версия рецептов для собак 🦴",
  zh: "测试版狗食谱 🦴",
  ja: "テストバージョン 犬のレシピ 🦴",
  pl: "Wersja Testowa Przepisów dla Psów 🦴",
  sv: "Testversion Hundrecept 🦴",
  hu: "Teszt Verzió Kutyareceptek 🦴",
  ar: "نسخة تجريبية وصفات الكلاب 🦴",
  hi: "टेस्ट वर्शन डॉग रेसिपीज़ 🦴",
  el: "Δοκιμαστική Έκδοση Συνταγές για Σκύλους 🦴"
};

const subscribedTextTranslations = {
  en: ["SUBSCRIBED"],
  es: ["SUSCRITO"],
  de: ["ABONNIERT"],
  fr: ["ABONNÉ"],
  it: ["ABBONATO"],
  tr: ["ABONE"],
  pt: ["INSCRITO"],
  ru: ["ПОДПИСАН"],
  zh: ["已订阅"],
  ja: ["購読済み"],
  pl: ["ZASUBSKRYBOWANY"],
  sv: ["PÅSKRIVEN"],
  hu: ["FELIRATKOZVA"],
  ar: ["مشترك"],
  hi: ["सदस्यता ली गई"],
  el: ["ΕΓΓΡΑΦΉ"]
};

const pressToEnterTextTranslations = {
  en: "Press 'Restore Purchase' to enter",
  es: "Presiona 'Restaurar Compra' para entrar",
  de: "Drücken Sie 'Kauf wiederherstellen', um einzutreten",
  fr: "Appuyez sur 'Restaurer l'achat' pour entrer",
  it: "Premi 'Ripristina acquisto' per entrare",
  tr: "'Satın Alma İşlemini Geri Yükle'ye basarak girin", // Traducción en turco añadida
  pt: "Pressione 'Restaurar Compra' para entrar",
  ru: "Нажмите 'Восстановить Покупку', чтобы войти",
  zh: "按 '恢复购买' 进入",
  ja: "'購入を復元'を押して入力してください",
  pl: "Naciśnij 'Przywróć zakup', aby wejść",
  sv: "Tryck på 'Återställ köp' för att ange",
  hu: "Nyomja meg a 'Vásárlás visszaállítása' gombot a belépéshez",
  ar: "اضغط على 'استعادة الشراء' للدخول",
  hi: "'खरीदी हुई वस्तु को पुनर्स्थापित करें' दबाकर प्रवेश करें",
  el: "Πατήστε 'Επαναφορά Αγοράς' για να εισέλθετε"
};

const cancelSubscriptionTextTranslations = {
  en: "You can manage and cancel your subscription by accessing your App Store account settings after purchase.",
  es: "Puedes gestionar y cancelar tu suscripción accediendo a los ajustes de tu cuenta del App Store después de la compra..",
  de: "Sie können Ihr Abonnement verwalten und stornieren, indem Sie nach dem Kauf auf die Einstellungen Ihres App Store-Kontos zugreifen, um die Probe fortzusetzen.",
  fr: "Vous pouvez gérer et annuler votre abonnement en accédant aux paramètres de votre compte App Store après l'achat.",
  it: "Puoi gestire e annullare l'abbonamento accedendo alle impostazioni del tuo account App Store dopo l'acquisto.",
  tr: "Satın aldıktan sonra App Store hesap ayarlarına erişerek aboneliğinizi yönetebilir ve iptal edebilirsiniz.",
  pt: "Você pode gerenciar e cancelar sua assinatura acessando as configurações da sua conta da App Store após a compra.",
  ru: "Вы можете управлять и отменять подписку, обратившись к настройкам вашей учетной записи в App Store после покупки.",
  zh: "购买后，您可以通过访问App Store帐户设置来管理和取消您的订阅。\n如果您处于试用期内，请重启应用程序以继续试用。",
  ja: "購入後、App Storeのアカウント設定にアクセスして、サブスクリプションを管理およびキャンセルできます。",
  pl: "Możesz zarządzać i anulować subskrypcję, przechodząc do ustawień swojego konta w App Store po zakupie.",
  sv: "Du kan hantera och avbryta din prenumeration genom att gå till dina App Store-kontoinställningar efter köpet.",
  hu: "Megvásárlás után kezelheti és lemondhatja előfizetését az App Store fiókbeállításaihoz való hozzáféréssel.",
  ar: "يمكنك إدارة اشتراكك وإلغاءه من خلال الوصول إلى إعدادات حسابك في App Store بعد الشراء.",
  hi: "खरीदने के बाद आप अपने ऐप स्टोर खाता सेटिंग्स को पहुंचकर अपनी सदस्यता को प्रबंधित और रद्द कर सकते हैं।\nयदि आप परीक्षण अवधि में हैं, तो परीक्षण जारी रखने के लिए ऐप को पुनः प्रारंभ करें।",
  el: "Μπορείτε να διαχειριστείτε και να ακυρώσετε τη συνδρομή σας προσπελάνοντας τις ρυθμίσεις του λογαριασμού σας στο App Store μετά την αγορά."
};


const accessTranslations = {
  en: "Subscribe or restore to access",
  es: "Suscríbete o restaura para acceder",
  de: "Abonnieren oder wiederherstellen, um Zugang zu erhalten",
  fr: "Abonnez-vous ou restaurez pour accéder",
  it: "Iscriviti o ripristina per accedere",
  tr: "Erişmek için abone ol veya geri yükle", // Por favor, verifica esta traducción, ya que fue realizada automáticamente.
  pt: "Assine ou restaure para acessar",
  ru: "Подпишитесь или восстановите для доступа",
  zh: "订阅或恢复以访问",
  ja: "アクセスするには、購読または復元してください",
  pl: "Subskrybuj lub przywróć, aby uzyskać dostęp",
  sv: "Prenumerera eller återställ för att få tillgång",
  hu: "Fizessen elő vagy állítsa vissza a hozzáférést",
  ar: "اشترك أو استعد للوصول",
  hi: "पहुँच पाने के लिए सदस्यता लें या पुनर्स्थापित करें",
  el: "Εγγραφείτε ή επαναφέρετε για πρόσβαση"
};


const subscribeTranslations = {
  en: "SUBSCRIBE",
  es: "SUSCRÍBETE",
  de: "ABONNIEREN ",
  fr: "S'ABONNER",
  it: "ISCRIVITI",
  tr: "ABONE OL",
  pt: "ASSINAR",
  ru: "ПОДПИСАТЬСЯ",
  zh: "订阅",
  ja: "サブスクライブ", 
  pl: "SUBSKRYBUJ",
  sv: "PRENUMERERA",
  hu: "FELIRATKOZÁS",
  ar: "اشترك",
  hi: "सदस्यता लें",
  el: "ΕΓΓΡΑΦΕΙΤΕ"
};

const contentTranslations = {
  en: "Access all content for",
  es: "Accede a todo el contenido por",
  de: "Zugriff auf alle Inhalte für",
  fr: "Accédez à tout le contenu pour",
  it: "Accedi a tutto il contenuto per",
  tr: "Tüm içeriğe erişin", 
  pt: "Aceda a todo o conteúdo por",
  ru: "Доступ ко всему контенту за",
  zh: "首月初始 5 折优惠！以访问所有内容", 
  ja: "最初の月は50％オフ！全コンテンツにアクセス", 
  pl: "Uzyskaj dostęp do całej zawartości za",
  sv: "Få tillgång till allt innehåll för",
  hu: "Hozzáférés az összes tartalomhoz",
  ar: "خصم أولي 50% للشهر الأول! احصل على الوصول إلى جميع المحتوى مقابل",
  hi: "पहले महीने के लिए 50% की शुरुआती छूट! सभी सामग्री तक पहुंच हासिल करें", 
  el: "Πρόσβαση σε όλο το περιεχόμενο με"
};

const currencySymbols = {
  USD: '$',
  EUR: '€',
  TRY: '₺',
  RUB: '₽',
  CNY: '¥',
  JPY: '¥',
  PLN: 'zł',
  SEK: 'kr',
  HUF: 'Ft',
  AED: 'د.إ',
  INR: '₹',
  CHF: 'CHF' // Símbolo para el franco suizo
};



const basePriceUSD = 8.00;
const conversionRates = {
  USD: 1,
  EUR: 1,
  TRY: 1,
  RUB: 1,    
  CNY: 1,   
  JPY: 1,    
  PLN: 1,    
  SEK: 1,    
  HUF: 1,    
  AED: 1,   
  INR: 1,   
  CHF: 1  // Actualización del valor del franco suizo
};
const monthTranslations = {
  en: "month Auto-renewable, 50% off the first month!",
  es: "mes Auto-renovable, ¡el primer mes con 50% de descuento!",
  de: "Monat automatisch erneuerbar, 50% Rabatt im ersten Monat!",
  fr: "mois renouvellement automatique, 50% de réduction le premier mois!",
  it: "mese rinnovabile automaticamente, 50% di sconto il primo mese!",
  tr: "ay otomatik yenilenebilir, ilk ay için %50 indirim!",
  pt: "mês renovação automática, 50% de desconto no primeiro mês!",
  ru: "месяц автоматического продления, 50% скидка в первый месяц!",
  zh: "月 自动续订，首月五折优惠！",
  ja: "月 自動更新, 最初の月は50%オフ！",
  pl: "miesiąc z automatycznym odnawianiem, 50% zniżki w pierwszym miesiącu!",
  sv: "månad med automatisk förnyelse, 50% rabatt första månaden!",
  hu: "hónap automatikus megújulással, az első hónapban 50% kedvezmény!",
  ar: "شهر تجديد تلقائي، 50% خصم في الشهر الأول!",
  hi: "महीना स्वचालित नवीनीकरण, पहले महीने में 50% की छूट!",
  el: "Μήνας με αυτόματη ανανέωση, 50% έκπτωση τον πρώτο μήνα!"
};



const alertTranslations = {
  successTitle: {
    en: 'Success',
    es: 'Éxito',
    de: 'Erfolg',
    fr: 'Succès',
    it: 'Successo',
    tr: 'Başarı',pt: 'Sucesso',
    ru: 'Успех',
    zh: '成功',
    ja: '成功',
    pl: 'Sukces',
    sv: 'Framgång',
    hu: 'Siker',
    ar: 'نجاح',
    hi: 'सफलता',
    el: 'Επιτυχία'
  },
  successMessage: {
    en: 'Your purchase has been restored. The subscription will expire on {date}.',
    es: 'Tu compra ha sido restaurada. La suscripción expirará el {date}.',
    de: 'Ihr Kauf wurde wiederhergestellt. Das Abonnement läuft am {date} ab.',
    fr: 'Votre achat a été restauré. L\'abonnement expirera le {date}.',
    it: 'Il tuo acquisto è stato ripristinato. L\'abbonamento scadrà il {date}.',
    tr: 'Satın almanız geri yüklendi. Abonelik {date} tarihinde sona erecek.',
    pt: 'Sua compra foi restaurada. A assinatura expirará em {date}.',
    ru: 'Ваша покупка была восстановлена. Подписка истечет {date}.',
    zh: '您的购买已恢复。订阅将在 {date} 到期。',
    ja: 'ご購入が復元されました。サブスクリプションは {date} に失効します。',
    pl: 'Twój zakup został przywrócony. Subskrypcja wygasa {date}.',
    sv: 'Ditt köp har återställts. Prenumerationen går ut {date}.',
    hu: 'A vásárlás visszaállítva. Az előfizetés lejár {date}.',
    ar: 'تم استعادة عملية الشراء الخاصة بك. ستنتهي الاشتراك في {date}.',
    hi: 'आपकी खरीदी गई वस्तु को पुनर्स्थापित कर दिया गया है। सदस्यता {date} को समाप्त होगी।',
    el: 'Η αγορά σας έχει επαναφερθεί. Η συνδρομή θα λήξει στις {date}.'
  },
  restoreTitle: {
    en: 'Restore Purchase',
    es: 'Restaurar Compra',
    de: 'Kauf wiederherstellen',
    fr: 'Restaurer l\'achat',
    it: 'Ripristina Acquisto',
    tr: 'Satın Almayı Geri Yükle',
    pt: 'Restaurar Compra',
    ru: 'Восстановить Покупку',
    zh: '恢复购买',
    ja: '購入を復元',
    pl: 'Przywróć zakup',
    sv: 'Återställ köp',
    hu: 'Vásárlás visszaállítása',
    ar: 'استعادة الشراء',
    hi: 'खरीदी हुई वस्तु को पुनर्स्थापित करें',
    el: 'Επαναφορά Αγοράς'
  },
  restoreMessage: {
    en: 'No previous purchases found to restore.',
    es: 'No se encontraron compras anteriores para restaurar.',
    de: 'Keine früheren Käufe zur Wiederherstellung gefunden.',
    fr: 'Aucun achat précédent trouvé pour la restauration.',
    it: 'Nessun acquisto precedente trovato da ripristinare.',
    tr: 'Geri yüklemek için önceki satın alımlar bulunamadı.',
    pt: 'Nenhuma compra anterior encontrada para restaurar.',
    ru: 'Не найдено предыдущих покупок для восстановления.',
    zh: '没有找到要恢复的先前购买。',
    ja: '復元する以前の購入は見つかりませんでした。',
    pl: 'Nie znaleziono wcześniejszych zakupów do przywrócenia.',
    sv: 'Inga tidigare köp hittades för att återställa.',
    hu: 'Nem található korábbi vásárlás a visszaállításhoz.',
    ar: 'لم يتم العثور على عمليات شراء سابقة لاستعادتها.',
    hi: 'पुनर्स्थापित करने के लिए कोई पिछली खरीददारी नहीं मिली।',
    el: 'Δεν βρέθηκαν προηγούμενες αγορές για επαναφορά.'
  },

  errorTitle: {
    en: 'Error Restoring',
    es: 'Error al Restaurar',
    de: 'Fehler beim Wiederherstellen',
    fr: 'Erreur lors de la restauration',
    it: 'Errore nel ripristino',
    tr: 'Geri Yükleme Hatası',
    pt: 'Erro ao Restaurar',
    ru: 'Ошибка Восстановления',
    zh: '恢复错误',
    ja: '復元エラー', // Verifica esta traducción
    pl: 'Błąd przywracania',
    sv: 'Fel vid återställning',
    hu: 'Hiba a visszaállítás során',
    ar: 'خطأ في الاستعادة',
    hi: 'पुनर्स्थापना में त्रुटि',
    el: 'Σφάλμα Επαναφοράς'
  },
  errorMessage: {
    en: 'An error occurred while restoring the purchase.',
    es: 'Ocurrió un error al restaurar la compra.',
    de: 'Beim Wiederherstellen des Kaufs ist ein Fehler aufgetreten.',
    fr: 'Une erreur s\'est produite lors de la restauration de l\'achat.',
    it: 'Si è verificato un errore durante il ripristino dell\'acquisto.',
    tr: 'Satın almayı geri yüklerken bir hata oluştu.',
    pt: 'Ocorreu um erro ao restaurar a compra.',
    ru: 'Произошла ошибка при восстановлении покупки.',
    zh: '恢复购买时发生错误。',
    ja: '購入の復元中にエラーが発生しました。', // Verifica esta traducción
    pl: 'Wystąpił błąd podczas przywracania zakupu.',
    sv: 'Ett fel inträffade vid återställning av köpet.',
    hu: 'Hiba történt a vásárlás visszaállítása közben.',
    ar: 'حدث خطأ أثناء استعادة الشراء.',
    hi: 'खरीद की पुनर्स्थापना करते समय त्रुटि हुई।',
    el: 'Παρουσιάστηκε σφάλμα κατά την επαναφορά της αγοράς.'
  },
};


const loadingMessages = {
  initial: {
    en: "Loading...",
    es: "Cargando...",
    de: "Laden...",
    fr: "Chargement...",
    it: "Caricamento...",
    tr: "Yükleniyor...",
    pt: "Carregando...",
    ru: "Загрузка...",
    zh: "加载中...",
    ja: "読み込み中...",
    pl: 'Ładowanie...',
    sv: 'Laddar...',
    hu: 'Betöltés...',
    ar: 'جار التحميل...',
    hi: 'लोड हो रहा है...',
    el: 'Φόρτωση...'
  },
  connecting: {
    en: "This might take a moment",
    es: "Esto puede tardar un momento",
    de: "Dies könnte einen Moment dauern",
    fr: "Cela pourrait prendre un moment",
    it: "Questo potrebbe richiedere un momento",
    tr: "Bu biraz zaman alabilir",
    pt: "Isso pode levar um momento",
    ru: "Это может занять некоторое время",
    zh: "这可能需要一点时间",
    ja: "これには少し時間がかかるかもしれません",
    pl: 'To może chwilę zająć',
    sv: 'Detta kan ta ett ögonblick',
    hu: 'Ez egy pillanatig tarthat',
    ar: 'قد يستغرق هذا برهة',
    hi: 'इसमें एक पल का समय लग सकता है',
    el: 'Αυτό μπορεί να πάρει λίγο χρόνο'
  },
  dontClose: {  // Nueva clave añadida
    en: "Please do not close the app",
    es: "Por favor no cierres la aplicación",
    de: "Bitte schließen Sie die App nicht",
    fr: "Veuillez ne pas fermer l'application",
    it: "Per favore non chiudere l'app",
    tr: "Lütfen uygulamayı kapatmayın",
    pt: "Por favor, não feche o aplicativo",
    ru: "Пожалуйста, не закрывайте приложение",
    zh: "请不要关闭应用程序",
    ja: "アプリを閉じないでください",
    pl: 'Proszę nie zamykać aplikacji',
    sv: 'Vänligen stäng inte appen',
    hu: 'Kérjük, ne zárja be az alkalmazást',
    ar: 'يرجى عدم إغلاق التطبيق',
    hi: 'कृपया ऐप को न बंद करें',
    el: 'Παρακαλώ μην κλείσετε την εφαρμογή'
  }
};




const supportModalMessages = {
  en: "You need to be subscribed to contact support.",
  es: "Necesitas estar suscrito para contactar al soporte.",
  de: "Sie müssen abonniert sein, um den Support zu kontaktieren.",
  fr: "Vous devez être abonné pour contacter le support.",
  it: "Devi essere iscritto per contattare il supporto.",
  tr: "Destek ile iletişime geçmek için abone olmanız gerekmektedir.",
  pt: "Você precisa estar inscrito para entrar em contato com o suporte.",
  ru: "Вы должны быть подписаны, чтобы связаться со службой поддержки.",
  zh: "您需要订阅才能联系支持。",
  ja: "サポートに連絡するには、登録する必要があります。",
  pl: "Musisz być zapisany, aby skontaktować się z pomocą techniczną.",
    sv: "Du måste vara prenumerant för att kontakta supporten.",
    hu: "Fel kell iratkoznia a támogatással való kapcsolatfelvételhez.",
    ar: "تحتاج إلى الاشتراك للتواصل مع الدعم.",
    hi: "सहायता से संपर्क करने के लिए आपको सदस्यता लेनी पड़ेगी।",
    el: "Πρέπει να είστε συνδρομητής για να επικοινωνήσετε με την υποστήριξη."
};


const openModalTextTranslations = {
  en: "Examples of Generated Images",
  es: "Ejemplos de Imágenes Generadas",
  de: "Beispiele für Generierte Bilder",
  fr: "Exemples d'Images Générées",
  it: "Esempi di Immagini Generate",
  tr: "Oluşturulan Görüntülerin Örnekleri",
  pt: "Exemplos de Imagens Geradas",
  ru: "Примеры Сгенерированных Изображений",
  zh: "生成的图像示例",
  ja: "生成された画像の例",
  pl: "Przykłady Wygenerowanych Obrazów",
  sv: "Exempel på Genererade Bilder",
  hu: "Generált Képek Példái",
  ar: "أمثلة على الصور المولدة",
  hi: "उत्पन्न छवियों के उदाहरण",
  el: "Παραδείγματα Δημιουργημένων Εικόνων"
};


const currentLanguage = 'en'; // Puedes cambiar este valor dependiendo del idioma del usuario
const supportModalMessage = supportModalMessages[systemLanguage] || supportModalMessages['en']; 
const openModalText = openModalTextTranslations[systemLanguage] || openModalTextTranslations['en'];

  const subscriptionTitle = titleTranslations[systemLanguage] || titleTranslations['en']; 
  const buttonText = buttonTextTranslations[systemLanguage] || buttonTextTranslations['en'];
  const restoreButtonText = restoreButtonTextTranslations[systemLanguage] || restoreButtonTextTranslations['en'];
  const benefitTitles = benefitTitleTranslations[systemLanguage] || benefitTitleTranslations['en'];
  const benefitDescriptions = benefitDescriptionTranslations[systemLanguage] || benefitDescriptionTranslations['en'];
  const tryClickerButtonText = tryClickerButtonTranslations[systemLanguage] || tryClickerButtonTranslations['en'];
  const subscribedText = subscribedTextTranslations[systemLanguage] || subscribedTextTranslations['en'];
  const pressToEnterText = pressToEnterTextTranslations[systemLanguage] || pressToEnterTextTranslations['en'];
  const cancelSubscriptionText = cancelSubscriptionTextTranslations[systemLanguage] || cancelSubscriptionTextTranslations['en'];
  const accessMessage = accessTranslations[systemLanguage] || accessTranslations['en']; 


  const SubscriptionBenefit = ({ benefit }) => {
    const showModal = (message) => {
      setModalMessage(message);
      setIsSubscriptionBenefitModalVisible(true);
      setTimeout(() => {
        setIsSubscriptionBenefitModalVisible(false);
      }, 1000); 
    };
    return (
      <TouchableOpacity onPress={() => showModal(accessMessage)}> 
        <View style={styles.benefitContainer}>
          <Text style={styles.benefitTitle}>{benefit.title}</Text>
          <Image 
            source={{ uri: benefit.imageUrl }} 
            style={styles.benefitImage} 
          />
        </View>
      </TouchableOpacity>
    );
  };

useEffect(() => {
  const initializePurchases = async () => {
    if (Platform.OS === 'ios') {
      Purchases.setDebugLogsEnabled(true);
      await Purchases.configure({ apiKey: 'appl_jeRcGcmSqhNLqVVsEgvUYbAFjFn' });

      try {
        const purchaserInfo = await Purchases.getPurchaserInfo();
        if (purchaserInfo && purchaserInfo.entitlements.active['1661']) {
          console.log('Usuario ya suscrito');
          setIsSubscribed(true); // Asegúrate de tener este estado definido y actualizado aquí
          navigateToBusinessLogin(); // Navega cuando el usuario ya está suscrito
          return;
        }
      } catch (error) {
        console.log('Error al obtener la información del comprador:', error);
      }

      try {
        const response = await Purchases.getOfferings();
        setOfferings(response.current);
      } catch (error) {
        console.log('Error al obtener ofertas:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  initializePurchases();
}, []);

Purchases.addCustomerInfoUpdateListener((info) => {

  if (info && info.entitlements.active['1661']) {
    console.log('Usuario ya suscrito');
  }
});

const purchaseSubscription = async (pkg) => {
  setIsSubscribed(true);

  try {
    const purchaseMade = await Purchases.purchasePackage(pkg);
    if (purchaseMade && purchaseMade.customerInfo.entitlements.active['1661']) {
      console.log('Successful purchase');

      const expirationDate = purchaseMade.customerInfo.entitlements.active['1661'].expiresDate;
      navigateToBusinessLogin(); // Navega después de una compra exitosa
    }
  } catch (error) {
    console.log('Error making purchase:', error);
  } finally {
    setIsSubscribed(false);
  }
};


const restorePurchases = async () => {
  if (isSubscribed) {
    // Si el usuario ya está suscrito, simplemente reinicia la app
    RNRestart.Restart();
  } else {
    // Si el usuario no está suscrito, procede con la restauración
    setIsSubscribed(true);

    try {
      const restoredPurchases = await Purchases.restorePurchases();
      console.log('Restored Purchases:', restoredPurchases);

      if (restoredPurchases && restoredPurchases.entitlements.active['1661']) {
        console.log('Successful restoration');
        const expirationDate = restoredPurchases.allExpirationDates['1661'];
        Alert.alert(
          'Success',
          `Your purchase has been restored. The subscription will expire on ${new Date(expirationDate).toLocaleDateString()}.`,
          [{ 
            text: 'OK', 
            onPress: () => {
              RNRestart.Restart(); // Esto reiniciará la app
            } 
          }]
        );
      } else {
        Alert.alert('Restore Purchase', 'No previous purchases found to restore.');
      }
    } catch (error) {
      Alert.alert('Error Restoring', 'An error occurred while restoring the purchase.');
      console.log('Error restoring purchase:', error);
    } finally {
      setIsSubscribed(false);
    }
  }
};

const navigateToBusinessLogin = () => {
  // Navega a NegociosLogin
  navigation.navigate('NegociosLogin');
};


const [messageKey, setMessageKey] = useState('initial');
const spinValue = new Animated.Value(0);
const [intervalId, setIntervalId] = useState(null);

useEffect(() => {
  Animated.loop(
    Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      }
    )
  ).start();

  if (isLoading || isSubscribing) {
    if (!intervalId) {
      const id = setInterval(() => {
        setMessageKey(prev => {
          switch (prev) {
            case 'initial': return 'connecting';
            case 'connecting': return 'dontClose';
            default: return prev; // No cambies el valor si no estás en 'initial' o 'connecting'
          }
        });
      }, 4000);
      setIntervalId(id);
    }
  } else {
    setMessageKey('initial');
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }

}, [isLoading, isSubscribing]);

const spin = spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg']
});

const message = loadingMessages[messageKey][systemLanguage] || loadingMessages[messageKey]['en'];

if (isLoading || isSubscribing) {
  return (
    <View style={styles.loaderContainer}>
      <Animated.Image
        source={require('../assets/imagenes/perro5.png')}
        style={[
          styles.loadingIcon,
          { transform: [{ rotate: spin }] }
        ]}
      />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}
const handleClose = () => {
  RNRestart.Restart(); // Esto reiniciará la app
};

const homescreen = () => {
  navigation.navigate('NegociosLogin');
};



return (
  <View style={styles.container}>
 <ImageBackground 
  source={require('../assets/imagenes/dinner.png')} 
  style={{ flex: 1 }}
  resizeMode="cover" // esto es opcional y se utiliza para definir cómo se debe redimensionar la imagen de fondo
>
    <View style={styles.overlay} />
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
    <TouchableOpacity onPress={() => {
    homescreen();
}} style={[styles.buttonCustom]}>
<Ionicons name="close" size={32} color="white" style={styles.notificationIcones} />
</TouchableOpacity>

    {showCloseIcon && (
        <TouchableOpacity
          onPress={handleClose}
          style={{
            position: 'absolute', // Posicionamiento absoluto
            top: -30, // 10 píxeles desde la parte superior
            left: 10, // 10 píxeles desde la izquierda
            zIndex: 1, // Asegura que el botón esté por encima de otros elementos
          }} 
        >
          <Ionicons name="close-circle-outline" size={30} color="#d2d2d2" />
        </TouchableOpacity>
      )}

      <View style={styles.benefitsContainer}>
        {benefitTitles.map((benefit, index) => (
          <SubscriptionBenefit
            key={index}
            benefit={benefit}
          />
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSubscriptionBenefitModalVisible}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{modalMessage}</Text>
        </View>
      </Modal>

<Modal 
  animationType="fade" 
  transparent={true} 
  visible={isSupportModalVisible} 
  onRequestClose={() => setIsSupportModalVisible(false)}
>
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <Text style={styles.modalText}>{supportModalMessage}</Text>
    </View>
  </View>
</Modal>

{
  isSubscribed ? (
    <View style={styles.subscribedContainer}>
      <View style={{ alignItems: 'center', marginTop: 0, padding: 10, flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, color: 'black' }}>{subscribedText}</Text>
        <Icon name="checkmark-circle" size={23} color="black" style={{ marginLeft: 5 }} />
      </View>
    </View>
  ) : (
    offerings && offerings.availablePackages.map((pkg, index) => (
      <TouchableOpacity 
        key={index} 
        onPress={() => purchaseSubscription(pkg)} 
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {isSubscribing ? 'Subscribing...' : subscribeTranslations[systemLanguage] || subscribeTranslations['en']}
        </Text>

        <Text style={{...styles.priceText, textAlign: 'center'}}>
  {`${contentTranslations[systemLanguage] || contentTranslations['en']} ${getPriceForCurrency(currencyCode)}`}
</Text>

      </TouchableOpacity>
    ))
  )
}


<Modal
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
    transparent={true}
>
    <GestureHandlerRootView style={{ flex: 1 }}>
        <PanGestureHandler
            onGestureEvent={(event) => {
                if (event.nativeEvent.translationY > 50 && event.nativeEvent.velocityY > 0) {
                    setModalVisible(false);
                }
            }}
            onHandlerStateChange={(event) => {
                if (event.nativeEvent.state === State.END) {
                    // Añade lógica adicional aquí si es necesario
                }
            }}
        >
            <View style={styles.modalView}>
                {/* Barrita (handle) para indicar dónde realizar el gesto */}
                <View style={styles.draggableBar} />

                {selectedImage && (
    <FastImage
        style={styles.fullImage}
        source={selectedImage}
        resizeMode={FastImage.resizeMode.contain}
    />
)}
                <FlatList
                    data={images}
                    renderItem={renderThumbnail}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                />
            </View>
        </PanGestureHandler>
    </GestureHandlerRootView>
</Modal>

<TouchableOpacity onPress={restorePurchases} style={styles.restoreButton}>
  <TypingText 
    text={isSubscribed ? accessButtonTextTranslations[systemLanguage] || accessButtonTextTranslations['en'] :
          (isSubscribing ? 'Synchronizing...' : restoreButtonTextTranslations[systemLanguage] || restoreButtonTextTranslations['en'])} 
    style={styles.restoreButtonText} 
  />
</TouchableOpacity>

      <View style={styles.linksContainer}>
    <TouchableOpacity onPress={handlePrivacyPress} style={styles.linkButton}>
        <Text style={styles.linkText}>Privacy Policy</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={handleEULAPress} style={styles.linkButton}>
        <Text style={styles.linkText}>EULA</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={handleGDPRPress} style={styles.linkButton}>
        <Text style={styles.linkText}>(T&C)</Text>
    </TouchableOpacity>

    {isSubscribed ? (
        <TouchableOpacity onPress={handleSupportPress} style={styles.linkButton}>
            <Text style={styles.linkText}>Support</Text>
        </TouchableOpacity>
    ) : (
        <TouchableOpacity onPress={handleContactPress} style={styles.linkButton}>
            <Text style={styles.linkText}>Contact</Text>
        </TouchableOpacity>
    )}
</View>

      <PrivacyModal 
        visible={isPrivacyModalVisible} 
        onClose={() => setIsPrivacyModalVisible(false)} 
      />

      <EULAModal 
        visible={isEULAModalVisible} 
        onClose={() => setIsEULAModalVisible(false)} 
      />

      <GDPRModal 
        visible={isGDPRModalVisible} 
        onClose={() => setIsGDPRModalVisible(false)} 
      />

      <Text style={styles.cancelSubscriptionText}>
        {cancelSubscriptionText}
      </Text>
    </ScrollView>
    </ImageBackground>
  </View>
  
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 0,  // Cambiado a 0

  },
  
  contentContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    maxWidth: '95%',
    maxHeight: '90%', // Agregado para limitar la altura
    margin: '10%', // Agregado para añadir margen alrededor
    alignSelf: 'center',
    marginTop:80,
    backgroundColor: '#0000009e',
  },


  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', // Añadido para centrar el contenido verticalmente

  },
  scrollView: {
    width: '100%',
    flex: 1,
    
  },
  
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',


  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    
  },
  titleImage: {
    width: 26, // o el tamaño que desees
    height: 26, // o el tamaño que desees
    marginRight: 10, // o el espacio que desees entre la imagen y el texto
  },
  title: {
    fontSize: 24,
    color: '#06c2b0',
  },
  
  benefitTitle: {
    color: '#d8d8d8',
    fontSize: 18, // ajustar el tamaño de la fuente según sea necesario
    textAlign: 'center',
    marginBottom: 10, // agregar un margen para separar el título de la descripción
    fontWeight: 'bold', // añadir negrita para que el título se destaque

  },
  benefitDescription: {
    color: '#5a5a5a',
    fontSize: 16, // ajustar el tamaño de la fuente según sea necesario
    textAlign: 'center',
  },

  button: {
    padding: 12,
    backgroundColor: '#0ef0da',
    borderRadius: 20,
    marginVertical: 5,
    width:'120%',
    marginTop:20,
    marginBottom: 10, // O el valor que prefieras
  },
  buttonText: {
    color: '#000000b0',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  restoreButton: {
    borderRadius: 50,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width:'120%',
  },

  restoreButtonContainer: {
    maxWidth: '50%', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20

  },

  restoreButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0ef0da',
    borderWidth: 2,
    borderColor: '#0ef0da',
    padding: 10,
    borderRadius: 10,
    marginTop:20,
    
    
  },

  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },

  linkButton: {
    padding: 10,
  },

  linkText: {
    color: 'white', // O cualquier color que prefieras

  },
  cancelSubscriptionText: {
    margin: 10,
    color: '#0a0a0a',
    fontSize: 12,
    textAlign: 'center',

  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center', // para centrar verticalmente el texto y la imagen
  },
  benefitImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
},


  benefitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#0000009e',
    // Utiliza el ancho de la ventana para calcular el ancho del contenedor
    width: windowWidth * 0.9 - 20, // Asegúrate de restar cualquier margen adicional
    alignSelf: 'center',
  },



  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 20,
    width: windowWidth * 1.0, // 80% del ancho de la pantalla
    maxHeight: windowHeight * 1.0, // 80% del alto de la pantalla
    margin: 20,
    alignSelf: 'center', // Asegura que el modal se centre horizontalmente
    paddingTop:20,
    marginTop:70,
    paddingBottom:100,
},

modalText: {
  
  fontSize: 21,
  color: '#10e0cd', 
  textAlign: 'center',
  padding: 50,
  borderRadius: 10,
  marginTop: 200, // Ajusta el margen según sea necesario
  marginBottom: 200, // Ajusta el margen según sea necesario
  fontWeight: 'bold',
  
},
cancelSubscriptionText: {
  margin: 10,
  color: 'white', // Cambiado a blanco para que sea visible sobre el overlay oscuro
  fontSize: 12,
  textAlign: 'center',
},

tryClickerButtonTextCentered: {
  color: 'white', // Cambiado a blanco para que sea visible sobre el overlay oscuro
  fontSize: 18, // Aumentado el tamaño de la fuente para una mejor visibilidad
  textAlign: 'center',
  marginVertical: 20, // Aumentado el margen para más espacio
},

subscribedContainer: {
  backgroundColor: '#0ef0da', // Fondo opaco
  borderRadius: 20, // Bordes redondeados
  padding: 10, // Espacio interno
  marginHorizontal: 0, // Reducir el margen horizontal para que el contenedor sea más largo
  marginBottom: 0, // Espacio debajo
  marginTop:10,
},
tryClickerButtonTextCentered: {
  color: '#c6c6c6',
  marginTop: 20,
  textAlign: 'center',
},

centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: 'rgba(0,0,0,0.5)', // fondo semi transparente
},

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Cambia el color de fondo según sea necesario
  },
  loadingIcon: {
    width: 80, // Ajusta el tamaño según sea necesario
    height: 80, // Ajusta el tamaño según sea necesario
    marginBottom: 20, // Ajusta el margen según sea necesario
  },
  loadingText: {
    color: '#0ad1be', // Cambia el color del texto según sea necesario
    fontSize: 18, // Ajusta el tamaño de fuente según sea necesario

  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },    

  thumbnail: {
    width: windowWidth / 4 - 10, // Un tercio del ancho de la pantalla menos el margen
    height: windowWidth / 4 - 10, // Altura igual al ancho para mantener la proporción
    margin: 5,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
},
fullImage: {
    width: '90%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 10,
    marginTop:10,
    borderRadius: 20,
    height: windowHeight * 0.4, // 40% del alto de la pantalla
    resizeMode: 'contain',
},
draggableBar: {
  alignSelf: 'center',
  width: 40,
  height: 4,
  backgroundColor: '#ccc',
  borderRadius: 3,
  marginTop: 8,
  marginBottom: 8,
},
buttonStyle: {
  borderRadius: 5,
  // Otros estilos del botón si es necesario
},
buttonTextStyle: {
  color: '#ecececd6', // Color del texto
  fontSize: 16, // Tamaño de la fuente
  textAlign: 'center',
  marginTop: 10,
},
buttonCustom: {
  position: 'absolute',
  top: -40,
  left: 0,
  padding: 10, 

},

});