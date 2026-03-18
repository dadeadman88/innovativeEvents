import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';
import { Appearance } from "react-native";
import { Colors } from "react-native-ui-lib";

export type ThemeMode = "default" | "light" | "dark";

interface ThemeState {
  currentTheme: ThemeMode;
  systemTheme: "light" | "dark" | null;
}

const initialState: ThemeState = {
  currentTheme: "dark",
  systemTheme: null,
};

// Async thunk to load theme from storage
export const loadThemeFromStorage = createAsyncThunk(
  "theme/loadFromStorage",
  async () => {
    try {
      const storedTheme = await SecureStore.getItemAsync("app_theme");
      return (storedTheme as ThemeMode) || "dark";
    } catch (error) {
      console.error("Error loading theme from storage:", error);
      return "dark" as ThemeMode;
    }
  }
);

// Async thunk to save theme to storage
export const saveThemeToStorage = createAsyncThunk(
  "theme/saveToStorage",
  async (theme: ThemeMode) => {
    try {
      await SecureStore.setItemAsync("app_theme", theme);
      return theme;
    } catch (error) {
      console.error("Error saving theme to storage:", error);
      throw error;
    }
  }
);

// Helper function to get the effective theme
const getEffectiveTheme = (currentTheme: ThemeMode, systemTheme: "light" | "dark" | null): "light" | "dark" => {
  if (currentTheme === "default") {
    return systemTheme || "dark";
  }
  return currentTheme;
};

const ThemeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.currentTheme = action.payload;

      // Apply the theme immediately using the stored system theme
      const effectiveTheme = getEffectiveTheme(action.payload, state.systemTheme);

      Appearance.setColorScheme(effectiveTheme);
      Colors.setScheme(effectiveTheme);
    },
    setSystemTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.systemTheme = action.payload;

      // If current theme is default, update the effective theme when system theme changes
      if (state.currentTheme === "default") {
        const effectiveTheme = getEffectiveTheme(state.currentTheme, action.payload);
        Appearance.setColorScheme(effectiveTheme);
        Colors.setScheme(effectiveTheme);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadThemeFromStorage.fulfilled, (state, action) => {
        state.currentTheme = action.payload;

        // Use the stored system theme for calculating effective theme
        const effectiveTheme = getEffectiveTheme(action.payload, state.systemTheme);

        Appearance.setColorScheme(effectiveTheme);
        Colors.setScheme(effectiveTheme);
      })
      .addCase(saveThemeToStorage.fulfilled, (state, action) => {
        // Theme saved successfully
        console.log("Theme saved:", action.payload);
      });
  },
});

export const { setTheme, setSystemTheme } = ThemeSlice.actions;
export default ThemeSlice.reducer;