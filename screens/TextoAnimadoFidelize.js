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
    en: 'LunchQR',
    es: 'LunchQR',
    de: 'LunchQR',
    fr: 'LunchQR',
    it: 'LunchQR',
    tr: 'LunchQR',
    pt: 'LunchQR',
    ru: 'LunchQR',
    zh: 'LunchQR',
    ja: 'LunchQR',
    pl: 'LunchQR',
    sv: 'LunchQR',
    hu: 'LunchQR',
    ar: 'LunchQR',
    hi: 'LunchQR',
    el: 'LunchQR',
    nl: 'LunchQR',
    sl: 'LunchQR',
  };
  
  const translatedText = textTranslations[systemLanguage] || textTranslations.en;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedColor, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease),
      }),
    ).start();
  }, [animatedColor]);

  const colorInterpolado = animatedColor.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1, 1.25 ],
    outputRange: ['#302b63', '#009688', '#302b63', '#009688', '#302b63','#009688', ],
  });

  if (isSmallScreen) {
    // No renderizar el componente en pantallas pequeñas como el iPhone SE
    return null;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.Text style={{
        color: colorInterpolado,
        fontSize: 36,
        fontWeight: 'bold',
        fontFamily: 'Poppins-Regular', // Asegúrate de que este nombre coincida con cómo lo cargaste
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
