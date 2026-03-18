import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../utils/AxiosInterceptor";
import { profileEndpoints } from "../../utils/Endpoints";
import { convertDataToFormData } from "../../utils/constants";
import { setLoading } from "../slices/OtherSlice";

export const ProfileActions = {
  getProfile: createAsyncThunk("profile/getProfile", async (_) => {
    const apiCall = await client.get(profileEndpoints.me);
    return apiCall.data?.data;
  }),

  updateProfile: createAsyncThunk(
    "profile/updateProfile",
    async (
      data: {
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
      },
      thunkAPI
    ) => {
      thunkAPI.dispatch(setLoading(true));
      const apiCall = await client.patch(profileEndpoints.update, data);
      return apiCall.data;
    }
  ),

  changePassword: createAsyncThunk(
    "profile/changePassword",
    async (
      data: {
        currentPassword: string;
        newPassword: string;
      },
      thunkAPI
    ) => {
      thunkAPI.dispatch(setLoading(true));
      const apiCall = await client.patch(profileEndpoints.changePassword, data);
      return apiCall.data;
    }
  ),

  getPreferences: createAsyncThunk("profile/getPreferences", async (_) => {
    const apiCall = await client.get(profileEndpoints.getPreferences);
    return apiCall.data;
  }),

  updatePreferences: createAsyncThunk(
    "profile/updatePreferences",
    async (data: {
      language?: string;
      theme?: string;
      autoPlay?: boolean;
      downloadQuality?: string;
    }) => {
      const formData = convertDataToFormData(data);
      const apiCall = await client.patch(
        profileEndpoints.updatePreferences,
        formData
      );
      return apiCall.data;
    }
  ),

  registerDevice: createAsyncThunk(
    "profile/registerDevice",
    async (data: { deviceToken: string; platform: string }) => {
      const formData = convertDataToFormData(data);
      const apiCall = await client.post(
        profileEndpoints.registerDevice,
        formData
      );
      return apiCall.data;
    }
  ),
};
