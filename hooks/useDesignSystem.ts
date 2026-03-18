import { configureDesignSystem } from "@/utils/designSystem";
import { useFonts } from "expo-font";
import { useEffect } from "react";

export const useDesignSystem = () => {
  const [fontsLoaded] = useFonts({
    AlbertSansLight: require('../assets/fonts/AlbertSansLight.ttf'),
    AlbertSansLightItalic: require('../assets/fonts/AlbertSansLightItalic.ttf'),
    AlbertSansRegular: require('../assets/fonts/AlbertSansRegular.ttf'),
    AlbertSansItalic: require('../assets/fonts/AlbertSansItalic.ttf'),
    AlbertSansMedium: require('../assets/fonts/AlbertSansMedium.ttf'),
    AlbertSansSemiBold: require('../assets/fonts/AlbertSansSemiBold.ttf'),
    AlbertSansSemiBoldItalic: require('../assets/fonts/AlbertSansSemiBoldItalic.ttf'),
    AlbertSansBold: require('../assets/fonts/AlbertSansBold.ttf'),
    AlbertSansBoldItalic: require('../assets/fonts/AlbertSansBoldItalic.ttf'),
    AlbertSansExtraBold: require('../assets/fonts/AlbertSansExtraBold.ttf'),
    AlbertSansExtraBoldItalic: require('../assets/fonts/AlbertSansExtraBoldItalic.ttf'),
    AlbertSansBlack: require('../assets/fonts/AlbertSansBlack.ttf'),
    AlbertSansBlackItalic: require('../assets/fonts/AlbertSansBlackItalic.ttf'),
    AlbertSansExtraLight: require('../assets/fonts/AlbertSansExtraLight.ttf'),
    AlbertSansExtraLightItalic: require('../assets/fonts/AlbertSansExtraLightItalic.ttf'),
    AlbertSansThin: require('../assets/fonts/AlbertSansThin.ttf'),
    AlbertSansThinItalic: require('../assets/fonts/AlbertSansThinItalic.ttf'),
  });

  useEffect(() => {
    configureDesignSystem();
  }, []);
};
