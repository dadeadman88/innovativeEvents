import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../utils/AxiosInterceptor";
import { authEndpoints } from "../../utils/Endpoints";
import { getDeviceInfo, getDeviceName } from "../../utils/constants";
import { setLoading } from "../slices/OtherSlice";

export const AuthActions = {
  Login: createAsyncThunk(
    "auth/login",
    async (
      credentials: {
        email: string;
        password: string;
        rememberMe: boolean;
      },
      thunkAPI
    ) => {
      thunkAPI.dispatch(setLoading(true));
      let apiCall = await client.post(authEndpoints.login, {
        ...credentials,
        ...getDeviceInfo(),
      });
      return { ...credentials, ...apiCall.data?.data };
    }
  ),
  SocialLogin: createAsyncThunk(
    "auth/socialLogin",
    async (
      credentials: {
        type: "google" | "apple";
        socialId: string;
        email: string;
        firstName: string;
        lastName: string;
        rememberMe: boolean;
      },
      thunkAPI
    ) => {
      thunkAPI.dispatch(setLoading(true));
      let apiCall = await client.post(authEndpoints.social, {
        ...credentials,
        ...getDeviceInfo(),
      });
      return { ...credentials, ...apiCall.data?.data };
    }
  ),
  Register: createAsyncThunk("auth/register", async (data: any, thunkAPI) => {
    thunkAPI.dispatch(setLoading(true));
    console.log("Register data", data);
    let apiCall = await client.post(authEndpoints.register, {
      ...data,
      ...getDeviceInfo(),
    });
    return apiCall.data?.data?.data;
  }),
  Logout: createAsyncThunk("auth/logout", async (data: {
    refreshToken: string;
    deviceId: string;
  }, thunkAPI) => {
    thunkAPI.dispatch(setLoading(true));
    let apiCall = await client.post(authEndpoints.logout, data);
    return apiCall.data?.data;
  }),
  ForgotPassword: createAsyncThunk(
    "auth/forgotPassword",
    async (data: { email: string }, thunkAPI) => {
      thunkAPI.dispatch(setLoading(true));
      let apiCall = await client.post(authEndpoints.forgotPassword, data);
      return apiCall.data;
    }
  ),
  GuestLogin: createAsyncThunk(
    "auth/guestLogin",
    async (nickname: string | undefined, thunkAPI) => {
      thunkAPI.dispatch(setLoading(true));
      const deviceInfo = getDeviceInfo();
      const deviceName = nickname || getDeviceName();

      let apiCall = await client.post(authEndpoints.guest, {
        deviceId: deviceInfo.deviceId,
        nickname: deviceName,
      });
      return apiCall.data?.data;
    }
  ),
  RefreshToken: createAsyncThunk("auth/refreshToken", async (data: { refreshToken: string }, thunkAPI) => {
    thunkAPI.dispatch(setLoading(true));
    const { deviceId } = getDeviceInfo();
    let apiCall = await client.post(authEndpoints.refresh, {
      ...data,
      deviceId,
    });
    return { ...apiCall.data?.data };
  }),
};
