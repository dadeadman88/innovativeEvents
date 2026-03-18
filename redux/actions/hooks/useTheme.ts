import { useCallback } from "react";
import { Appearance, AppState, useColorScheme } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loadThemeFromStorage, saveThemeToStorage, setSystemTheme, setTheme, ThemeMode } from "../../slices/ThemeSlice";
import { RootState } from "../../store";

export const useTheme = () => {
    const dispatch = useDispatch();
    const themeState = useSelector((state: RootState) => state.theme);
    const colorScheme = useColorScheme();

    const setAppTheme = useCallback(
        async (theme: ThemeMode) => {
            dispatch(setTheme(theme));
            // Save to storage
            dispatch(saveThemeToStorage(theme) as any);
        },
        [dispatch]
    );

    const updateSystemTheme = useCallback(
        (systemTheme: "light" | "dark") => {
            dispatch(setSystemTheme(systemTheme));
        },
        [dispatch]
    );

    const loadTheme = useCallback(() => {
        dispatch(loadThemeFromStorage() as any);
    }, [dispatch]);

    const init = useCallback(() => {
        // Step 1: Initialize system theme in Redux
        const initialSystemTheme = colorScheme || "dark";
        dispatch(setSystemTheme(initialSystemTheme));

        AppState.addEventListener("change", (status) => {
            if (status === "active") {
                Appearance.setColorScheme(undefined)
                dispatch(setSystemTheme(Appearance.getColorScheme() as "light" | "dark"));
            }
        });

        // Step 2: Load saved theme after system theme is set
        dispatch(loadThemeFromStorage() as any);
    }, [colorScheme, dispatch]);

    // Get the effective theme (resolves "default" to actual light/dark)
    const getEffectiveTheme = useCallback((): "light" | "dark" => {
        if (themeState.currentTheme === "default") {
            // For default mode, prioritize stored systemTheme, fallback to current Appearance
            return themeState.systemTheme || colorScheme || "dark";
        }
        return themeState.currentTheme;
    }, [colorScheme, themeState.currentTheme, themeState.systemTheme]);

    return {
        currentTheme: themeState.currentTheme,
        systemTheme: themeState.systemTheme,
        effectiveTheme: getEffectiveTheme(),
        setAppTheme,
        updateSystemTheme,
        loadTheme,
        init,
    };
};