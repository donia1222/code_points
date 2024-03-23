import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View, Dimensions } from 'react-native';
import * as RNLocalize from 'react-native-localize';

const TextoAnimado = () => {
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 375;
  const animatedColor = useRef(new Animated.Value(0)).current;
  const systemLanguage = RNLocalize.getLocales()[0]?.languageCode || 'en';

  // Define los textos en diferentes idiomas
  const textTranslations = {
    en: 'Menu of the day',
    es: 'Menú del día',
    de: 'Menü des Tages',
    fr: 'Menu du jour',
    it: 'Menu del giorno',
    tr: 'Günün menüsü',
    pt: 'Menu do dia',
    ru: 'Меню дня',
    zh: '每日菜单',
    ja: '本日のメニュー',
    pl: 'Menu dnia',
    sv: 'Dagens meny',
    hu: 'A napi menü',
    ar: 'قائمة اليوم',
    hi: 'आज का मेनू',
    el: 'Το μενού της ημέρας',
    nl: 'Menu van de dag',
    sl: 'Meni dneva',
  };
  
  const translatedText = textTranslations[systemLanguage] || textTranslations.en;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedColor, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease),
      }),
    ).start();
  }, [animatedColor]);

  const colorInterpolado = animatedColor.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1, 1.25 ],
    outputRange: ['#2942b8', '#20ac9f', '#8353da', '#c718a6', '#34363f','#c718a6', ],
  });

  if (isSmallScreen) {
    // No renderizar el componente en pantallas pequeñas como el iPhone SE
    return null;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.Text style={{
        color: colorInterpolado,
        fontSize: 23,
        fontWeight: 'bold',
        fontFamily: 'Poppins_400Regular',
        marginTop:-5,
        marginBottom:10,
        textAlign: 'center',
      }}>
        {translatedText}
      </Animated.Text>
    </View>
  );
};

export default TextoAnimado;
