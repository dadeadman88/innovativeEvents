import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToastProps } from "react-native-ui-lib";
import { Others } from "../../utils/types";

const initialState: Others = {
  loading: false,
  toast: null,
  loginModal: {
    visible: false,
    message: undefined,
  },
};

const OtherSlice = createSlice({
  name: "Loading",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    showHideToast(state, action: PayloadAction<ToastProps>) {
      state.toast = action.payload as any;
    },
    showLoginModal(state, action: PayloadAction<{ message?: string }>) {
      state.loginModal = {
        visible: true,
        message: action.payload?.message,
      };
    },
    hideLoginModal(state) {
      state.loginModal = {
        visible: false,
        message: undefined,
      };
    },
  },
});

export const { setLoading, showHideToast, showLoginModal, hideLoginModal } = OtherSlice.actions;
export default OtherSlice.reducer;
