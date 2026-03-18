import { LogoutUser } from "@/redux/slices/AuthSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { router } from "expo-router";
import { useCallback } from "react";
import { ToastPresets } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from "../AuthActions";
import { useToast } from "./useOthers";

// Selector hooks for auth state
export const useAuthState = () => {
  return useSelector((state: RootState) => state.auth);
};

// Login Hook
export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();
  return useCallback(
    async (credentials: {
      email: string;
      password: string;
      rememberMe: boolean;
    }) => {
      try {
        const result = await dispatch(AuthActions.Login(credentials));
        if (AuthActions.Login.fulfilled.match(result)) {
          router.replace("/(main)/(tabs)/home");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Login failed";
        Toaster({
          visible: true,
          message: errorMessage,
          preset: ToastPresets.FAILURE,
        });
      }
    },
    [dispatch]
  );
};

export const useSocialLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();
  return useCallback(
    async (credentials: {
      type: "google" | "apple";
      socialId: string;
      email: string;
      firstName: string;
      lastName: string;
      rememberMe: boolean;
    }) => {
      try {
        const result = await dispatch(AuthActions.SocialLogin(credentials));
        if (AuthActions.SocialLogin.fulfilled.match(result)) {
          router.replace("/(main)/(tabs)/home");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Login failed";
        Toaster({
          visible: true,
          message: errorMessage,
          preset: ToastPresets.FAILURE,
        });
      }
    },
    [dispatch]
  );
};

// Register Hook
export const useRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();

  return useCallback(
    async (userData: any) => {
      try {
        const result = await dispatch(AuthActions.Register(userData));
        if (AuthActions.Register.fulfilled.match(result)) {
          router.replace("/allowNotifications");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Registration failed";
        Toaster({
          visible: true,
          message: errorMessage,
          preset: ToastPresets.FAILURE,
        });
      }
    },
    [dispatch]
  );
};

// Logout Hook
export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();

  const logout = useCallback(async ({
    refreshToken,
    deviceId,
  }: {
    refreshToken: string;
    deviceId: string;
  }) => {
    try {
      const result = await dispatch(AuthActions.Logout({
        refreshToken,
        deviceId,
      }));
      if (AuthActions.Logout.fulfilled.match(result)) {
        // API logout successful, clear local state
        dispatch(LogoutUser());
        router.replace("/getStarted");
      }
    } catch (err: any) {
      // Always clear local state even if API fails
      console.warn("Logout error, clearing local state anyway", err);
      dispatch(LogoutUser());
      const errorMessage = err.message || "Logout failed";
      Toaster({
        visible: true,
        message: errorMessage,
        preset: ToastPresets.FAILURE,
      });
    }
  }, [dispatch]);

  const logoutLocal = useCallback(() => {
    dispatch(LogoutUser());
    router.replace("/getStarted");
  }, [dispatch]);

  return {
    logout,
    logoutLocal,
  };
};

// Forgot Password Hook
export const useForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();

  return useCallback(
    async (email: string) => {
      try {
        const result = await dispatch(AuthActions.ForgotPassword({ email }));
        if (AuthActions.ForgotPassword.fulfilled.match(result)) {
          Toaster({
            visible: true,
            message: "Password reset link has been sent to your email",
            preset: ToastPresets.SUCCESS,
          });
          return true;
        }
        return false;
      } catch (err: any) {
        const errorMessage = err.message || "Failed to send reset email";
        Toaster({
          visible: true,
          message: errorMessage,
          preset: ToastPresets.FAILURE,
        });
        return false;
      }
    },
    [dispatch, Toaster]
  );
};

// Guest Login Hook
export const useGuestLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();

  return useCallback(
    async (nickname?: string) => {
      try {
        const result = await dispatch(AuthActions.GuestLogin(nickname));
        if (AuthActions.GuestLogin.fulfilled.match(result)) {
          router.replace("/(main)/(tabs)/home");
          return true;
        }
        return false;
      } catch (err: any) {
        const errorMessage = err.message || "Failed to continue as guest";
        Toaster({
          visible: true,
          message: errorMessage,
          preset: ToastPresets.FAILURE,
        });
        return false;
      }
    },
    [dispatch, Toaster]
  );
};
