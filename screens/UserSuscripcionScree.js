
import React, { useEffect, useState , useRef} from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image, StyleSheet, Modal,Linking, Platform, ImageBackground, ScrollView} from 'react-native';
import Purchases from 'react-native-purchases';
import * as RNLocalize from "react-native-localize";
import DeviceInfo from 'react-native-device-info';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import PrivacyModal from './Links/PrivacyModal';
import EULAModal from './Links/EulaModal';
import GDPRModal from './Links/GDPRModal';

export default function UserSubscription({ onClose, onRestore, isSubscribed, navigation, isNightMode }) { 
  const [offerings, setOfferings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const imageUrl = "https://app.hundezonen.ch/docs/peerrdddo.png";
  const [restoredMessage, setRestoredMessage] = useState('');
  const [showExpirationDate, setShowExpirationDate] = useState(false);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const systemLanguage = RNLocalize.getLocales()[0]?.languageCode || 'en';
  const scrollViewRef = useRef(null);
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const [isEULAModalVisible, setIsEULAModalVisible] = useState(false);
  const [isGDPRModalVisible, setIsGDPRModalVisible] = useState(false);
  
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
// Get the device model
const deviceModel = DeviceInfo.getModel();

// Get the OS version
const systemVersion = DeviceInfo.getSystemVersion();

// Create the email body
const emailBody = `Device Information:
Device Model: ${deviceModel}
iOS Version: ${systemVersion}`;

// Create the mailto URL
const mailtoURL = `mailto:info@lweb.ch?body=${encodeURIComponent(emailBody)}`;

// Try to open the mail app
Linking.openURL(mailtoURL).catch(err => console.error('Failed to open mail app:', err));
};


  const fetchNotifications = async () => {
    try {
      const response = await fetch('https://mycode.lweb.ch/notificaciones/recuperar.php');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return []; // Devuelve un array vacío en caso de error
    }
  };

  useEffect(() => {
    const loadNotifications = async () => {
      const fetchedNotifications = await fetchNotifications();
      setNotifications(fetchedNotifications);
    };

    loadNotifications();
  }, []);

  const obtenerMesYDia = (fecha, idiomaSeleccionado) => {
    const date = new Date(fecha);
    return new Intl.DateTimeFormat(idiomaSeleccionado, { month: 'long', day: 'numeric' }).format(date);
  };
  

  const showClickerTrainingModal = () => {
    console.log('Button Pressed');
    setModalVisible(true);
};

const closeClickerTrainingModal = () => {
    setModalVisible(false);
};

const titleTranslations = {
  en: "Subscription status",
  es: "Estado de la suscripción",
  de: "Abonnementstatus",
  fr: "Statut de l'abonnement",
  it: "Stato dell'abbonamento",
  tr: "Abonelik durumu",
  pt: "Status da assinatura",
    ru: "Статус подписки",
    zh: "订阅状态",
    ja: "サブスクリプションのステータス",
    pl: "Status subskrypcji",
    sv: "Prenumerationsstatus",
    hu: "Előfizetés állapota",
    ar: "حالة الاشتراك",
    hi: "सदस्यता की स्थिति",
    el: "Κατάσταση συνδρομής",
    nl: "Abonnementsstatus",
    sl: "Stanje naročnine",
};

  const buttonTextTranslations = {
    en: "Subscribe",

  };

  const restoreButtonTextTranslations = {
    en: "Restore ",
    es: "Restaurar ",
    de: "Wiederherstellen",
    fr: "Restaurer",
    it: "Ripristina",
    tr: "Geri Yükle",
    pt: "Restaurar",
    ru: "Восстановить",
    zh: "恢复",
    ja: "復元 ",
    pl: "Przywróć",
    sv: "Återställ",
    hu: "Visszaállítás",
    ar: "عرض الاشتراك",
    hi: "पुनर्स्थापित करें",
    el: "Επαναφορά",
    nl: "Herstellen",
    sl: "Obnovi",
  };
  

const benefitTitleTranslations = {
  en: ["You can check your subscription status by pressing View My Subscription"],
  es: ["Puedes ver el estado de tu suscripción presionando Ver mi suscripción"],
  de: ["Du kannst den Status deines Abonnements überprüfen, indem du auf Mein Abonnement anzeigen drückst"],
  fr: ["Vous pouvez vérifier l'état de votre abonnement en appuyant sur Voir mon abonnement"],
  it: ["Puoi controllare lo stato del tuo abbonamento premendo Visualizza la mia sottoscrizione"],
  tr: ["Abonelik durumunu 'Aboneliğimi Görüntüle'ye basarak kontrol edebilirsin"],
  pt: ["Podes verificar o estado da tua subscrição pressionando Ver a minha subscrição"],
  ru: ["Вы можете проверить статус вашей подписки, нажав Посмотреть мою подписку"],
  zh: ["按查看我的订阅以检查您的订阅状态"],
  ja: ["「マイサブスクリプションを見る」を押して、サブスクリプションの状態を確認できます"],
  pl: ["Możesz sprawdzić status swojej subskrypcji, naciskając Zobacz moją subskrypcję"],
  sv: ["Du kan kontrollera din prenumerationsstatus genom att trycka på Visa min prenumeration"],
  hu: ["Az előfizetésed állapotát ellenőrizheted az Előfizetésem megtekintése gomb megnyomásával"],
  ar: ["يمكنك التحقق من حالة اشتراكك بالضغط على عرض اشتراكي"],
  hi: ["अपनी सदस्यता की स्थिति जानने के लिए मेरी सदस्यता देखें पर दबाएँ"],
  el: ["Μπορείτε να ελέγξετε την κατάσταση της συνδρομής σας πατώντας Δείτε τη συνδρομή μου"],
  nl: ["Je kunt de status van je abonnement controleren door op Mijn abonnement bekijken te drukken"],
  sl: ["Stanje svoje naročnine lahko preveriš s pritiskom na Ogled moje naročnine"],
};


  const benefitDescriptionTranslations = {
    en: [
        "You can cancel your subscription at any time from your user account in the App Store application"
    ],
    es: [
        "Puedes cancelar tu suscripción en cualquier momento desde tu cuenta de usuario en la aplicación de App Store"
    ],
    de: [
        "Sie können Ihr Abonnement jederzeit über Ihr Benutzerkonto in der App Store-Anwendung kündigen"
    ],
    fr: [
        "Vous pouvez annuler votre abonnement à tout moment depuis votre compte utilisateur dans l'application App Store"
    ],
    it: [
        "Puoi annullare la tua iscrizione in qualsiasi momento dal tuo account utente nell'applicazione App Store"
    ],
    tr: [
        "Aboneliğinizi App Store uygulamasındaki kullanıcı hesabınızdan herhangi bir zaman iptal edebilirsiniz"
    ],
    pt: [
      "Você pode cancelar sua assinatura a qualquer momento a partir da sua conta de usuário no aplicativo App Store"
  ],
  ru: [
      "Вы можете отменить свою подписку в любое время из своей учетной записи пользователя в приложении App Store"
  ],
  zh: [
      "您可以随时从App Store应用程序中的用户帐户取消您的订阅"
  ],
  ja: [
      "App Storeアプリケーションのユーザーアカウントからいつでもサブスクリプションをキャンセルできます"
  ],
  pl: [
      "Możesz anulować swoją subskrypcję w dowolnym momencie z poziomu konta użytkownika w aplikacji App Store"
  ],
  sv: [
      "Du kan avbryta din prenumeration när som helst från ditt användarkonto i App Store-applikationen"
  ],
  hu: [
      "Leiratkozhat az előfizetéséről bármikor a felhasználói fiókjából az App Store alkalmazásban"
  ],
  ar: [
      "يمكنك إلغاء اشتراكك في أي وقت من حساب المستخدم الخاص بك في تطبيق App Store"
  ],
  hi: [
      "आप अपनी सदस्यता को ऐप स्टोर एप्लिकेशन में अपने उपयोगकर्ता खाते से कभी भी रद्द कर सकते हैं"
  ],
  el: [
      "Μπορείτε να ακυρώσετε τη συνδρομή σας ανά πάσα στιγμή από τον λογαριασμό χρήστη σας στην εφαρμογή App Store"
  ],
  nl: [
      "U kunt uw abonnement op elk moment opzeggen vanuit uw gebruikersaccount in de App Store-applicatie"
  ],
  sl: [
      "Naročnino lahko kadar koli prekličete iz svojega uporabniškega računa v aplikaciji App Store"
  ]
};

const supportButtonTextTranslations = {
  en: "Subscription Support",
  es: "Soporte para Suscripciones",
  de: "Abonnement Support",
  fr: "Support d'Abonnement",
  it: "Supporto Abbonamento",
  tr: "Abonelik Destek",
  pt: "Suporte de Assinatura",
  ru: "Поддержка Подписки",
  zh: "订阅支持",
  ja: "サブスクリプションサポート",
  pl: "Wsparcie dla Subskrypcji",
  sv: "Prenumeration Support",
  hu: "Előfizetési Támogatás",
  ar: "دعم الاشتراك",
  hi: "सदस्यता सहारा",
  el: "Υποστήριξη Συνδρομής",
  nl: "Abonnement Ondersteuning",
  sl: "Podpora Naročnine",
};

const messagesTranslations = {
  successfulRestoration: {
    en: "Subscription started on {startDate} and will expire on {expirationDate}. User ID: {userID}",
    es: "La suscripción comenzó el {startDate} y expirará el {expirationDate}. ID de usuario: {userID}",
    de: "Das Abonnement begann am {startDate} und läuft am {expirationDate} ab. Benutzer-ID: {userID}",
    fr: "L'abonnement a commencé le {startDate} et expirera le {expirationDate}. ID d'utilisateur: {userID}",
    it: "L'abbonamento è iniziato il {startDate} e scadrà il {expirationDate}. ID utente: {userID}",
    tr: "Abonelik {startDate} tarihinde başladı ve {expirationDate} tarihinde sona erecek. Kullanıcı ID: {userID}" // Verifica esta traducción
  },
  noPurchases: {
    en: "No previous purchases found to restore.",
    es: "No se encontraron compras anteriores para restaurar.",
    de: "Es wurden keine früheren Käufe zum Wiederherstellen gefunden.",
    fr: "Aucun achat précédent trouvé pour la restauration.",
    it: "Nessun acquisto precedente trovato da ripristinare.",
    tr: "Geri yüklemek için önceki satın alımlar bulunamadı." // Verifica esta traducción
  },
  errorRestoring: {
    en: "An error occurred while restoring the purchase.",
    es: "Ocurrió un error al restaurar la compra.",
    de: "Beim Wiederherstellen des Kaufs ist ein Fehler aufgetreten.",
    fr: "Une erreur s'est produite lors de la restauration de l'achat.",
    it: "Si è verificato un errore durante il ripristino dell'acquisto.",
    tr: "Satın almayı geri yüklerken bir hata oluştu." // Verifica esta traducción
  },
  apiMessage: {
    en: "We work with OpenAI's API. If you have any issues with the bot's responses, you can check the API's status at: https://status.openai.com",
    es: "Trabajamos con la API de OpenAI. Si tiene algún problema con las respuestas del bot, puede verificar el estado de la API en: https://status.openai.com",
    de: "Wir arbeiten mit der API von OpenAI. Wenn Sie Probleme mit den Antworten des Bots haben, können Sie den Status der API überprüfen unter: https://status.openai.com",
    fr: "Nous travaillons avec l'API d'OpenAI. Si vous avez des problèmes avec les réponses du bot, vous pouvez vérifier l'état de l'API à l'adresse : https://status.openai.com",
    it: "Lavoriamo con l'API di OpenAI. Se hai problemi con le risposte del bot, puoi verificare lo stato dell'API a: https://status.openai.com",
    tr: "OpenAI'nin API'si ile çalışıyoruz. Botun yanıtlarıyla ilgili herhangi bir sorun yaşarsanız, API'nin durumunu şuradan kontrol edebilirsiniz: https://status.openai.com",
    pt: "Trabalhamos com a API do OpenAI. Se você tiver algum problema com as respostas do bot, pode verificar o status da API em: https://status.openai.com",
    ru: "Мы работаем с API OpenAI. Если у вас возникли проблемы с ответами бота, вы можете проверить статус API по адресу: https://status.openai.com",
    zh: "我们使用OpenAI的API。如果您对机器人的回应有任何问题，可以在以下地址查看API的状态：https://status.openai.com",
    ja: "私たちはOpenAIのAPIを利用しています。ボットの応答に問題がある場合は、APIのステータスを次のアドレスで確認できます：https://status.openai.com",
    pl: "Pracujemy z API OpenAI. Jeśli masz jakiekolwiek problemy z odpowiedziami bota, możesz sprawdzić stan API pod adresem: https://status.openai.com",
    sv: "Vi arbetar med OpenAIs API. Om du har några problem med botens svar kan du kontrollera API: s status på: https://status.openai.com",
    hu: "Az OpenAI API-jával dolgozunk. Ha problémája van a bot válaszaival, ellenőrizheti az API állapotát itt: https://status.openai.com",
    ar: "نحن نعمل مع واجهة برمجة تطبيقات OpenAI. إذا كان لديك أي مشكلات في ردود البوت، يمكنك التحقق من حالة واجهة برمجة التطبيقات على: https://status.openai.com",
    hi: "हम OpenAI के API के साथ काम करते हैं। अगर आपको बोट के उत्तरों में कोई समस्या है, तो आप API की स्थिति की जाँच कर सकते हैं: https://status.openai.com",
    el: "Εργαζόμαστε με το API της OpenAI. Εάν αντιμετωπίζετε οποιαδήποτε προβλήματα με τις απαντήσεις του bot, μπορείτε να ελέγξετε την κατάσταση του API στο: https://status.openai.com",
    nl: "We werken met de API van OpenAI. Als u problemen ondervindt met de antwoorden van de bot, kunt u de status van de API controleren op: https://status.openai.com",
    sl: "Delamo z API-jem OpenAI. Če imate težave z odgovori bota, lahko stanje API-ja preverite na: https://status.openai.com"
  }

}



  const subscriptionTitle = titleTranslations[systemLanguage] || titleTranslations['en']; 
  const buttonText = buttonTextTranslations[systemLanguage] || buttonTextTranslations['en'];
  const restoreButtonText = restoreButtonTextTranslations[systemLanguage] || restoreButtonTextTranslations['en'];

  const benefitTitles = benefitTitleTranslations[systemLanguage] || benefitTitleTranslations['en'];
  const benefitDescriptions = benefitDescriptionTranslations[systemLanguage] || benefitDescriptionTranslations['en'];
  const supportButtonText = supportButtonTextTranslations[systemLanguage] || supportButtonTextTranslations['en'];


  const SubscriptionBenefit = ({ title, description }) => (
    <View style={styles.benefit}>
        <Text style={styles.benefitTitle}>{title}</Text>
        <Text style={styles.benefitDescription}>{description}</Text>
    </View>
);
useEffect(() => {
  const initializePurchases = async () => {
    if (Platform.OS === 'ios') {
      Purchases.setDebugLogsEnabled(true);
      await Purchases.configure({ apiKey: 'API' });

      try {
        const purchaserInfo = await Purchases.getPurchaserInfo();
        if (purchaserInfo && purchaserInfo.entitlements.active['16611']) {
          console.log('Usuario ya suscrito');
          onClose(true);
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
        restorePurchases();

      }
    }
  };

  initializePurchases();
}, []);

const purchaseSubscription = async (pkg) => {
  setIsSubscribing(true);

  try {
    const purchaseMade = await Purchases.purchasePackage(pkg);
    if (purchaseMade && purchaseMade.customerInfo.entitlements.active['1661']) {
      console.log('Compra exitosa');
      onClose(true);
    }
  } catch (error) {
    console.log('Error al realizar compra:', error);
  } finally {
    setIsSubscribing(false);
  }
};
const restorePurchases = async () => {
  setIsSubscribing(true);

  try {
    const restoredPurchases = await Purchases.restorePurchases();

    if (restoredPurchases && restoredPurchases.entitlements.active['1661']) {
      const startDate = new Date(restoredPurchases.allPurchaseDates['1661a']).toLocaleDateString();
      const expirationDate = new Date(restoredPurchases.allExpirationDates['1661a']).toLocaleDateString();      
      setRestoredMessage(`Subscription started on ${startDate} and will expire on ${expirationDate}.
User ID: ${restoredPurchases.originalAppUserId}`);
      
      setShowExpirationDate(true);
      setIsUserSubscribed(true); // Actualizar estado para reflejar que el usuario está suscrito
    } else {
      setRestoredMessage('User not subscribed');
      setShowExpirationDate(false);
      setIsUserSubscribed(false); // Actualizar estado para reflejar que el usuario no está suscrito
    }
  } catch (error) {
    setRestoredMessage('An error occurred while restoring the purchase.');
    setIsUserSubscribed(false); // En caso de error, asumir que el usuario no está suscrito
  } finally {
    setIsSubscribing(false);
  }
};

const handleSupportPress = () => {
  if (!restoredMessage) {
    Alert.alert('Error', 'Please restore your purchase first.');
    return;
  }

  // Get the device model
  const deviceModel = DeviceInfo.getModel();

  // Get the OS version
  const systemVersion = DeviceInfo.getSystemVersion();

  // Add device info to the email body
  const emailBody = `Device Information:
Device Model: ${deviceModel}
iOS Version: ${systemVersion}

${restoredMessage}`;

  const mailtoURL = `mailto:info@lweb.ch?subject=Subscription%20Support&body=${encodeURIComponent(emailBody)}`;

  Linking.openURL(mailtoURL).catch(err => console.error('Failed to open mail app:', err));
};
const homescreen = () => {
  navigation.navigate('NegociosLogin');
};



if (isLoading || isSubscribing) {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

return (
  <View style={styles.container}>


<TouchableOpacity onPress={() => {
    homescreen();
}} style={[styles.buttonCustom]}>
<Ionicons name="close" size={32} color="white" style={styles.notificationIcon} />
</TouchableOpacity>

        <TouchableOpacity 
      onPress={() => setModalVisible(true)} 
      style={styles.notificationButton}
    >
      <Ionicons name="notifications" size={24} color="white" style={styles.notificationIcon} />
    </TouchableOpacity>

    <View style={styles.titleContainer}>
      <Text style={styles.title}>{subscriptionTitle}</Text>
    </View>
    
    {showExpirationDate ? (
  <View>
    <View style={styles.messageContainer}>
      <Text style={[styles.messageText, {color: '#FFFFFF'}]}>{restoredMessage}</Text>
    </View>

    <View style={styles.benefitsContainer}>
      {benefitTitles.map((title, index) => (
        <SubscriptionBenefit
          key={index}
          description={benefitDescriptions[index]}
        />
      ))}
    </View>

    
    <View style={styles.linksContainer}>
    <TouchableOpacity onPress={handlePrivacyPress} style={styles.linkButton}>
        <Text style={styles.linkText}>Privacy Policy</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={handleEULAPress} style={styles.linkButton}>
        <Text style={styles.linkText}>EULA</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={handleSupportPress} style={styles.linkButton}>
            <Text style={styles.linkText}>Contact</Text>
        </TouchableOpacity>
  

        

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

  </View>
) : (
  <View style={styles.messageContainer}>
    <Text style={[styles.messageText, {color: '#FFFFFF'}]}>{restoredMessage}</Text>
    <TouchableOpacity onPress={restorePurchases} style={styles.restoreButton}>
      <Text style={[styles.restoreButtonText, {color: '#FFFFFF'}]}>
        {isSubscribing ? 'Synchronizing...' : restoreButtonText}
      </Text>
    </TouchableOpacity>

  </View>
  
)}



<Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        
      >
        
  <ImageBackground 
  source={require('../assets/imagenes/dinner.png')} 
  style={{ flex: 1 }}
  resizeMode="cover" // esto es opcional y se utiliza para definir cómo se debe redimensionar la imagen de fondo
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
                // Lógica adicional si es necesario
              }
            }}
          >
            <View style={[styles.modalView, isNightMode ? styles.nightModeBackground : {}]}>
              {/* Barra en la parte superior */}
              <TouchableOpacity
                style={styles.draggableBar}
                activeOpacity={1}
              >
                <View style={styles.draggableIndicator} />
              </TouchableOpacity>

              <ScrollView>
  {notifications.map((notification, index) => (
    <View key={index} style={[styles.notificationItem, isNightMode ? styles.darkModeView : {}]}>

<Text style={styles.boldText}>
    {obtenerMesYDia(notification.fecha_envio)}
  </Text>

  <Text style={[styles.notificationTitle, isNightMode ? styles.nightModeText : {}]}>
    {notification.titulo}
  </Text>
  <Text style={isNightMode ? styles.nightModeText : {}}>
    {notification.mensaje}
  </Text>
</View>
    
  ))}
  
</ScrollView>

            </View>
        
          </PanGestureHandler>
        </GestureHandlerRootView>
        </ImageBackground>
      </Modal>

  </View>
  
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'black',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
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
    fontFamily: 'Poppins-Regular',
  },
  benefitsContainer: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center', // Cambiado para alinear los elementos al centro
  },
  
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Añadido para centrar los elementos horizontalmente
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'column', // Cambiado de 'row' a 'column'
    padding: 15, // Ajusta el padding según sea necesario
    borderRadius: 5,
  },
  

  benefitDescription: {
    color: '#dbdbdbb8',
    fontSize: 16, // ajustar el tamaño de la fuente según sea necesario
    textAlign: 'center',
    marginBottom: 20, // agregar un margen para separar la descripción de otros elementos
  },

  button: {
    padding: 18,
    backgroundColor: '#0cc2b1',
    borderRadius: 50,
    marginVertical: 5,
    width:'80%',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
  },
  restoreButton: {
    marginTop: 20,
    borderRadius: 50,
    borderWidth: 1, // Ancho del borde
    borderColor: '#c3c3c3', // Color del borde, cámbialo según tu diseño
    padding: 10
  },
  restoreButtonText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#c3c3c3',
  },
  tryClickerButton: {
    padding: 10,
    backgroundColor: '#096e64', // o el color que prefieras
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },
  tryClickerButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  messageContainer: {
    padding: 20,
    backgroundColor: 'lightgrey', // O el color que prefieras
    borderRadius: 5,
    margin: 10,
  },
  messageText: {
    fontSize: 16,
  },
  supportButton: {
    backgroundColor: '#096e64', // Un color verde agradable
    padding: 10,
    borderRadius: 25, // Bordes redondeados
    elevation: 5, // Sombra para Android
    margin: 10,
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignItems: 'center',
    marginTop: 40,
  },
  supportButtonText: {
    color: 'white',
    fontWeight: 'bold', // Texto en negrita
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },

  apiMessageContainer: {
    padding: 10,

  },
  apiMessageText: {
    fontSize: 14,
    color: '#ffffff82', // Para asegurarte de que el texto es legible
    textAlign: 'center',
   marginTop:80
  },
  apiMessageLink: {
    color: '#009688',  
    textDecorationLine: 'underline', 
    textAlign: 'center',
    marginTop:10,
    fontSize: 14
},
messageContainer: {
  // Establece el color de fondo a transparente o al color deseado
  backgroundColor: 'transparent', // o el color deseado
  // ...otros estilos...
},
messageContainer: {
  // Establece el color de fondo a transparente o al color deseado
  backgroundColor: 'transparent', // o el color deseado
  color: 'black',
},
messageText: {
  // ... other styles ...
  color: '#FFFFFF',
  fontSize:18
},

restoreButtonText: {
  // ... other styles ...
  color: '#FFFFFF',

},
buttonTextmenus: {
  color: '#FFFFFF',
  fontSize: 17, // Un tamaño de fuente más grande para mejorar la legibilidad
  fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
  marginLeft:10,
},
restoreButtonText: {
  // ... other styles ...
  color: '#646464b8',
  textAlign: 'center',
  fontSize: 17,
   fontFamily: 'Poppins_400Regular',

},

restoredMessageStyle: {
  color: 'black', // Esto hará que el texto sea negro
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
  color: '#b8b8b8', // O cualquier color que prefieras

},
messageTextp: {
  textAlign: 'center',

},
modalTitle: {
  fontSize: 28,
  color: '#00554d',
  textAlign: 'center',
  marginVertical: 20,
  marginTop: -20,
},
notificationItem: {
  padding: 15,
  marginBottom: 10,
  backgroundColor: '#e3e3e3', // Un fondo blanco para cada notificación
  marginTop: 10,
  borderRadius: 10,
  textAlign: 'center',
 
},
notificationMessage: {
  fontSize: 17,
  color: 'black', // O el color de texto que prefieras
  textAlign: 'center',
},
notificationDate: {
  fontSize: 12,
  marginTop: 5,
  textAlign: 'center',
},
deleteButton: {
  position: 'absolute',
  right: 10,
  top: 10,
  padding: 10, // Ajusta para hacer más fácil tocar el botón
},
notificationButton: {
  marginTop: 20,
  position: 'absolute',
  top:30,
  right: 30,
}, 
boldText: {
  fontSize: 15,
  color: '#a3a3a3',
},

nightModeTexts:{
  fontSize: 16,
  color: 'white',
  marginLeft: 10,
  textAlign: 'center',
},

notificationTitle: {
fontSize: 18,
marginBottom: 5,
color: '#525252',
marginTop: 10,

},
darkModeView: {
  backgroundColor: '#2e2e2e', // Fondo oscuro

},
modalTitlesi: {
  marginLeft: 5,
  fontSize: 18,

},
modalView: {
  flex: 1,
  paddingTop: 60, // Asegúrate de tener espacio para el botón de cerrar
  paddingHorizontal: 20,
  backgroundColor: 'white', // Color para el modo claro
},
closeButton: {
  position: 'absolute',
  top: 40,
  left: 20,
  zIndex: 3,
},
draggableBar: {
  alignSelf: 'center',
  marginTop: 10,
  height: 30,
  justifyContent: 'center',
  zIndex: 2,
},
draggableIndicator: {
  height: 4,
  width: 40,
  backgroundColor: '#787878',
  borderRadius: 5,
  marginTop:-50,
},
sectionDescription: {
  fontSize: 15,
  padding: 5,
  borderRadius:10,
  marginTop:10,
  textAlign: 'center',
},
buttonCustom: {
  position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
},
linksContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginTop: 10,
},

linkButton: {
  padding: 10,
},

linkText: {
  color: '#b8b8b8', // O cualquier color que prefieras

},

});