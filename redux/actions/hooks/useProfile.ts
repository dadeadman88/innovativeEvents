import { AppDispatch } from "@/redux/store";
import { useCallback } from "react";
import { ToastPresets } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { ProfileActions } from "../ProfileActions";
import { useToast } from "./useOthers";

export const useGetProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(async () => {
    try {
      const result = await dispatch(ProfileActions.getProfile());
      return result;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return false;
    }
  }, [dispatch]);
};

export const useUpdateProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();
  return useCallback(
    async (data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      dateOfBirth?: string;
      avatar?: any;
      address1?: string;
      address2?: string;
      city?: string;
      zip?: string;
      country?: string;
    }) => {
      try {
        const result = await dispatch(ProfileActions.updateProfile(data));
        if (ProfileActions.updateProfile.fulfilled.match(result)) {
          Toaster({
            visible: true,
            message: "Profile updated successfully",
            preset: ToastPresets.SUCCESS,
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error updating profile:", error);
        return false;
      }
    },
    [dispatch, Toaster]
  );
};

export const useChangePassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();
  return useCallback(
    async (data: { newPassword: string; currentPassword: string }) => {
      try {
        const result = await dispatch(ProfileActions.changePassword(data));
        if (ProfileActions.changePassword.fulfilled.match(result)) {
          Toaster({
            visible: true,
            message: "Password changed successfully",
            preset: ToastPresets.SUCCESS,
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error changing password:", error);
        return false;
      }
    },
    [dispatch, Toaster]
  );
};

export const useGetPreferences = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(async () => {
    try {
      const result = await dispatch(ProfileActions.getPreferences());
      return ProfileActions.getPreferences.fulfilled.match(result);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      return false;
    }
  }, [dispatch]);
};

export const useUpdatePreferences = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (data: {
      language?: string;
      theme?: string;
      autoPlay?: boolean;
      downloadQuality?: string;
    }) => {
      try {
        const result = await dispatch(ProfileActions.updatePreferences(data));
        return ProfileActions.updatePreferences.fulfilled.match(result);
      } catch (error) {
        console.error("Error updating preferences:", error);
        return false;
      }
    },
    [dispatch]
  );
};
