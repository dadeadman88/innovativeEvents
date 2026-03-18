import { moderateScale } from "react-native-size-matters";
import { Colors, Typography } from "react-native-ui-lib";

const fontRegularName = "AlbertSans";
export const theme = {
  font: {
    light: fontRegularName + "Light",
    lightItalic: fontRegularName + "LightItalic",
    regular: fontRegularName + "Regular",
    semibold: fontRegularName + "SemiBold",
    semiboldItalic: fontRegularName + "SemiBoldItalic",
    extraLight: fontRegularName + "ExtraLight",
    extraLightItalic: fontRegularName + "ExtraLightItalic",
    bold: fontRegularName + "Bold",
    boldItalic: fontRegularName + "BoldItalic",
    extraBold: fontRegularName + "ExtraBold",
    extraBoldItalic: fontRegularName + "ExtraBoldItalic",
    medium: fontRegularName + "Medium",
  },
  fontSize: {
    headingSize: 22,
    tiny: 8,
    extraVSmall: 10,
    extraSmall12: 12,
    extraSmall: 13,
    small: 14,
    medium: 15,
    regular: 16,
    large: 18,
    large20: 20,
    large24: 24,
    large26: 26,
    large28: 28,
    large32: 32,
    extraLarge: 40,
  },
  color: {
    primary: "#109CD9",
    secondary: "#E53935",
    accent: "#386DF3",
    inputBg: "#F6F8FE",
    textColor: "#151918",
    borderColor: Colors.rgba(0, 0, 0, 0.04) || "",
    containerBackground: "#fff",
    grayBackground: Colors.rgba(21, 25, 24, 0.04) || "",
    placeholderColor: Colors.rgba(21, 25, 24, 0.5) || "",
    black: Colors.black,
    white: Colors.white,
    darkGray: "#4c4c4cff",
    gray: "#6C6C6C",
    lightGray: "#9B9B9B",
    lightGray2: "#f4f4f4ff",
    inputBorder: "#E8E8E8",
    bannerRed: "#FFE5E5",
    infoBoxBg: "#EBF0FE",
    google: Colors.white,
    facebook: Colors.rgba(58, 88, 155, 1) || "",
    apple: Colors.rgba(46, 46, 46, 1) || "",
    onboardingBlue: "#109CD9",
  },
  dark_color: {
    primary: "#109CD9",
    secondary: "#E53935",
    accent: "#386DF3",
    inputBg: "#151918",
    textColor: "#fff",
    borderColor: Colors.rgba(255, 255, 255, 0.04) || "",
    containerBackground: "#151918",
    grayBackground: Colors.rgba(250, 250, 250, 0.04) || "",
    placeholderColor: Colors.rgba(255, 255, 255, 0.5) || "",
    black: Colors.white,
    white: "#101614",
    darkGray: "#4c4c4cff",
    gray: "#9A9A9A",
    lightGray: "#9C9C9C",
    lightGray2: "#f4f4f4ff",
    inputBorder: "#3A3A3A",
    bannerRed: "#331515",
    infoBoxBg: "#151928",
    google: Colors.white,
    facebook: Colors.rgba(58, 88, 155, 1) || "",
    apple: Colors.rgba(46, 46, 46, 1) || "",
    onboardingBlue: "#109CD9",
  },
};

// for more information - https://wix.github.io/react-native-ui-lib/foundation/style
export const configureDesignSystem = async (): Promise<void> => {
  Colors.loadSchemes({
    light: theme.color,
    dark: theme.dark_color,
  });

  let fontFamilies: Record<string, { fontFamily: string }> = {};
  Object.keys(theme.font).map((s) => {
    if (!fontFamilies) fontFamilies = {};
    fontFamilies[s] = {
      fontFamily: theme.font[s as keyof typeof theme.font],
    };
  });

  Typography.loadTypographies({
    section: { fontSize: moderateScale(26), fontWeight: "600" },
    tiny: {
      fontSize: moderateScale(theme.fontSize.tiny),
      lineHeight: moderateScale(theme.fontSize.tiny + 5),
    },
    smallest: {
      fontSize: moderateScale(theme.fontSize.extraVSmall),
      lineHeight: moderateScale(theme.fontSize.extraVSmall + 5),
    },
    extraVSmall: {
      fontSize: moderateScale(theme.fontSize.extraVSmall),
      lineHeight: moderateScale(theme.fontSize.extraVSmall + 5),
    },
    extraSmall12: {
      fontSize: moderateScale(theme.fontSize.extraSmall12),
      lineHeight: moderateScale(theme.fontSize.extraSmall12 + 5),
    },
    extraSmall: {
      fontSize: moderateScale(theme.fontSize.extraSmall),
      lineHeight: moderateScale(theme.fontSize.extraSmall + 5),
    },
    small: {
      fontSize: moderateScale(theme.fontSize.small),
      lineHeight: moderateScale(theme.fontSize.small + 5),
    },
    mediumSize: {
      fontSize: moderateScale(theme.fontSize.medium),
      lineHeight: moderateScale(theme.fontSize.medium + 5),
    },
    large: {
      fontSize: moderateScale(theme.fontSize.large),
      lineHeight: moderateScale(theme.fontSize.large + 5),
    },
    large20: {
      fontSize: moderateScale(theme.fontSize.large20),
      lineHeight: moderateScale(theme.fontSize.large20 + 5),
    },
    large24: {
      fontSize: moderateScale(theme.fontSize.large24),
      lineHeight: moderateScale(theme.fontSize.large24 + 5),
    },
    large26: {
      fontSize: moderateScale(theme.fontSize.large26),
      lineHeight: moderateScale(theme.fontSize.large26 + 5),
    },
    large28: {
      fontSize: moderateScale(theme.fontSize.large28),
      lineHeight: moderateScale(theme.fontSize.large28 + 5),
    },
    large32: {
      fontSize: moderateScale(theme.fontSize.large32),
      lineHeight: moderateScale(theme.fontSize.large32 + 5),
    },
    regularSize: {
      fontSize: moderateScale(theme.fontSize.regular),
      lineHeight: moderateScale(theme.fontSize.regular + 5),
    },
    extraLarge: {
      fontSize: moderateScale(theme.fontSize.extraLarge),
      lineHeight: moderateScale(theme.fontSize.extraLarge + 5),
    },
    heading: {
      fontSize: moderateScale(theme.fontSize.headingSize),
      lineHeight: moderateScale(theme.fontSize.headingSize + 5),
    },
    ...fontFamilies,
  });
};
