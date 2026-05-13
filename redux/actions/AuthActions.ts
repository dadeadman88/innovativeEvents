import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../utils/AxiosInterceptor";
import { authEndpoints } from "../../utils/Endpoints";
import { LoginApiData, User } from "../../utils/types";
import { setLoading } from "../slices/OtherSlice";
import { Platform } from "react-native";

function generateDeviceToken(): string {
  // Placeholder until push notifications are integrated
  return String(Math.floor(100000000 + Math.random() * 900000000));
}

export type ContractorRegisterFileField =
  | "drivers_license"
  | "passport"
  | "sampling_licensure"
  | "social_security_card";

function mapLoginDataToUser(d: LoginApiData): User {
  const avatarUrl =
    d.profile_photo?.trim() ||
    d.avatar_url?.trim() ||
    d.profile_image?.trim() ||
    d.image?.trim() ||
    null;

  return {
    id: d.id,
    email: d.email,
    role: d.role,
    firstName: d.first_name ?? "",
    lastName: d.last_name ?? "",
    fullName: d.fullname,
    title: d.title,
    company: d.company,
    phone: d.full_mobile_number ?? d.mobile_number,
    address: d.address ?? undefined,
    countryCode: d.country_code ?? undefined,
    fullMobileNumber: d.full_mobile_number ?? undefined,
    avatarUrl,
  };
}

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
      const { data } = await client.post<{
        response?: { code?: number; data?: LoginApiData; verify_code?: string | number };
        verify_code?: string | number;
      }>(
        authEndpoints.login,
        {
          email: credentials.email.trim(),
          password: credentials.password,
        }
      );

      const loginData = data?.response?.data;
      if (!loginData?.access_token) {
        return thunkAPI.rejectWithValue("Invalid login response");
      }

      const verify_code =
        String(
          (data as any)?.verify_code ??
            (data as any)?.response?.verify_code ??
            (loginData as any)?.verify_code ??
            (loginData as any)?.verification_code ??
            (loginData as any)?.verificationCode ??
            (loginData as any)?.otp ??
            ""
        ).trim() || undefined;

      return {
        rememberMe: credentials.rememberMe,
        accessToken: loginData.access_token,
        user: mapLoginDataToUser(loginData),
        verify_code,
      };
    }
  ),
  Register: createAsyncThunk(
    "auth/register",
    async (
      payload: {
        role: "user" | "contractor";
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        mobile_number?: string;
        title?: string;
        company?: string;
      },
      thunkAPI
    ) => {
      thunkAPI.dispatch(setLoading(true));

      const body: Record<string, any> = {
        role: payload.role,
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email.trim(),
        password: payload.password,
        device_type: Platform.OS,
        device_token: generateDeviceToken(),
        udid: "test",
      };

      if (payload.mobile_number) body.mobile_number = payload.mobile_number;
      if (payload.title) body.title = payload.title;
      if (payload.company) body.company = payload.company;

      const { data } = await client.post<{
        response?: { code?: number; data?: LoginApiData; verify_code?: string | number };
        verify_code?: string | number;
      }>(
        authEndpoints.register,
        body
      );

      const regData = data?.response?.data;
      if (!regData?.access_token) {
        return thunkAPI.rejectWithValue("Invalid register response");
      }

      const verify_code =
        String(
          (data as any)?.verify_code ??
            (data as any)?.response?.verify_code ??
            (regData as any)?.verify_code ??
            (regData as any)?.verification_code ??
            (regData as any)?.verificationCode ??
            (regData as any)?.otp ??
            ""
        ).trim() || undefined;

      return {
        rememberMe: true,
        accessToken: regData.access_token,
        user: mapLoginDataToUser(regData),
        verify_code,
      };
    }
  ),
  ContractorRegister: createAsyncThunk(
    "auth/contractorRegister",
    async (
      payload: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        mobile_number: string;
        address: string;
        files: {
          field: ContractorRegisterFileField;
          uri: string;
          mimeType?: string | null;
          fileName?: string | null;
        }[];
      },
      thunkAPI
    ) => {
      thunkAPI.dispatch(setLoading(true));

      const formData = new FormData();
      formData.append("role", "contractor");
      formData.append("first_name", payload.first_name);
      formData.append("last_name", payload.last_name);
      formData.append("email", payload.email.trim());
      formData.append("password", payload.password);
      formData.append("mobile_number", payload.mobile_number);
      formData.append("address", payload.address);
      formData.append("device_type", Platform.OS);
      formData.append("device_token", generateDeviceToken());
      formData.append("udid", generateDeviceToken());

      for (const f of payload.files) {
        formData.append(f.field, {
          uri: f.uri,
          type: f.mimeType ?? "image/jpeg",
          name: f.fileName ?? `${f.field}.jpg`,
        } as any);
      }

      const { data } = await client.post<unknown>(authEndpoints.contractorRegister, formData);
      return data;
    }
  ),
  ForgotPassword: createAsyncThunk(
    "auth/forgotPassword",
    async (data: { email: string }, thunkAPI) => {
      thunkAPI.dispatch(setLoading(true));
      const apiCall = await client.post(authEndpoints.forgotPassword, data);
      const payload = apiCall.data;

      const verify_code =
        String(
          (payload as any)?.verify_code ??
            (payload as any)?.response?.verify_code ??
            (payload as any)?.response?.data?.verify_code ??
            (payload as any)?.response?.data?.verification_code ??
            (payload as any)?.response?.data?.otp ??
            ""
        ).trim() || undefined;

      return { payload, verify_code };
    }
  ),
  ResetPassword: createAsyncThunk(
    "auth/resetPassword",
    async (data: { email: string; new_password: string }, thunkAPI) => {
      thunkAPI.dispatch(setLoading(true));
      const apiCall = await client.post(authEndpoints.resetPassword, {
        email: data.email.trim(),
        new_password: data.new_password,
      });
      return apiCall.data;
    }
  ),
  UpdateProfile: createAsyncThunk(
    "auth/updateProfile",
    async (
      payload: {
        role: "user" | "contractor";
        first_name: string;
        last_name: string;
        mobile_number?: string;
        title?: string;
        company?: string;
      },
      thunkAPI
    ) => {
      thunkAPI.dispatch(setLoading(true));
      const body: Record<string, string> = {
        role: payload.role,
        first_name: payload.first_name,
        last_name: payload.last_name,
      };
      if (payload.mobile_number?.trim()) {
        body.mobile_number = payload.mobile_number.trim();
      }
      if (payload.title?.trim()) body.title = payload.title.trim();
      if (payload.company?.trim()) body.company = payload.company.trim();

      const { data } = await client.post<{ response?: { code?: number; data?: LoginApiData } }>(
        authEndpoints.updateUser,
        body
      );

      const d = data?.response?.data;
      if (d) {
        return { user: mapLoginDataToUser(d), accessToken: d.access_token };
      }

      return thunkAPI.rejectWithValue("Invalid update response");
    }
  ),
  DeleteAccount: createAsyncThunk("auth/deleteAccount", async (_, thunkAPI) => {
    thunkAPI.dispatch(setLoading(true));
    const { data } = await client.post<unknown>(authEndpoints.deleteUser, {});
    return data;
  }),
};
