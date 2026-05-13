import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { Auth, User } from "../../utils/types";
import { AuthActions } from "../actions/AuthActions";

const initialState: Auth = {
  user: null,
  isLoggedIn: false,
  accessToken: "",
};

const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload?.user;
      state.isLoggedIn = true;
      state.accessToken = action.payload?.accessToken;
    },
    LogoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.accessToken = "";
      SecureStore.deleteItemAsync("auth_renew_org");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(AuthActions.Login.fulfilled, (state, action) => {
      state.user = action.payload?.user;
      state.isLoggedIn = true;
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
      state.accessToken = action.payload?.accessToken;
      if (action.payload?.rememberMe)
        SecureStore.setItemAsync(
          "auth_renew_org",
          JSON.stringify(action.payload)
        );
    });

    builder.addCase(AuthActions.UpdateProfile.fulfilled, (state, action) => {
      state.user = action.payload?.user;
      if (action.payload?.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
    });
  },
});

export const { LogoutUser, setUser } = AuthSlice.actions;
export default AuthSlice.reducer;
