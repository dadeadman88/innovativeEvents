import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { Auth, User } from "../../utils/types";
import { AuthActions } from "../actions/AuthActions";
import { ProfileActions } from "../actions/ProfileActions";

const initialState: Auth = {
  user: null,
  guest: null,
  isLoggedIn: false,
  isGuest: false,
  refreshToken: "",
  accessToken: "",
};

const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload?.user;
      state.guest = null;
      state.isLoggedIn = true;
      state.isGuest = false;
      state.refreshToken = action.payload?.refreshToken;
      state.accessToken = action.payload?.accessToken;
    },
    LogoutUser: (state) => {
      state.user = null;
      state.guest = null;
      state.isLoggedIn = false;
      state.isGuest = false;
      state.refreshToken = "";
      state.accessToken = "";
      SecureStore.deleteItemAsync("auth_renew_org");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(AuthActions.Login.fulfilled, (state, action) => {
      state.user = action.payload?.user;
      state.isLoggedIn = true;
      state.refreshToken = action.payload?.refreshToken;
      state.accessToken = action.payload?.accessToken;
      if (action.payload?.rememberMe)
        SecureStore.setItemAsync(
          "auth_renew_org",
          JSON.stringify(action.payload)
        );
    });

    builder.addCase(AuthActions.SocialLogin.fulfilled, (state, action) => {
      state.user = action.payload?.user;
      state.isLoggedIn = true;
      state.refreshToken = action.payload?.refreshToken;
      state.accessToken = action.payload?.accessToken;
      if (action.payload?.rememberMe)
        SecureStore.setItemAsync(
          "auth_renew_org",
          JSON.stringify(action.payload)
        );
    });

    builder.addCase(AuthActions.Register.fulfilled, (state, action) => {
      state.user = action.payload?.user;
      state.isLoggedIn = true;
      state.isGuest = false;
      state.refreshToken = action.payload?.refreshToken;
      state.accessToken = action.payload?.accessToken;
      if (action.payload?.rememberMe)
        SecureStore.setItemAsync(
          "auth_renew_org",
          JSON.stringify(action.payload)
        );
    });

    builder.addCase(AuthActions.GuestLogin.fulfilled, (state, action) => {
      state.guest = action.payload?.guest;
      state.isGuest = true;
      state.isLoggedIn = false;
      state.accessToken = action.payload?.accessToken;
    });

    builder.addCase(ProfileActions.getProfile.fulfilled, (state, action) => {
      state.user = action.payload as User | null;
    });
    builder.addCase(AuthActions.RefreshToken.fulfilled, (state, action) => {
      state.accessToken = action.payload?.accessToken;
      state.refreshToken = action.payload?.refreshToken;
    });
    builder.addCase(AuthActions.Logout.fulfilled, (state, action) => {
      state.user = null;
      state.guest = null;
      state.isLoggedIn = false;
      state.isGuest = false;
      state.refreshToken = "";
      state.accessToken = "";
      SecureStore.deleteItemAsync("auth_renew_org");
    });
  },
});

export const { LogoutUser, setUser } = AuthSlice.actions;
export default AuthSlice.reducer;
