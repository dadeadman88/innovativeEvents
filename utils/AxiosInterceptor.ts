import { AuthActions } from "@/redux/actions/AuthActions";
import { LogoutUser } from "@/redux/slices/AuthSlice";
import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import { ToastPresets } from "react-native-ui-lib";
import { setLoading, showHideToast } from "../redux/slices/OtherSlice";
import { authEndpoints, BASE_URL } from "./Endpoints";
import { ApiErrorResponse } from "./types";

// Lazy store getter to avoid circular dependency
let getStore: () => any;
export const setStoreReference = (storeGetter: () => any) => {
  getStore = storeGetter;
};

const client = axios.create({
  baseURL: BASE_URL,
});

client.interceptors.request.use(
  (config) => {
    if (getStore) {
      let token = getStore().getState().auth?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    config.headers["Accept"] = "*/*";
    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (res) => {
    // console.warn("Axios response", res?.data?.status);
    if (getStore) {
      getStore().dispatch(setLoading(false));
    }
    return Promise.resolve(res);
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (getStore) {
      getStore().dispatch(setLoading(false));
      console.log("Axios error response", error.config?.headers, error.status, error.config?.url);
      if (error.status === 401 && error.config?.url !== authEndpoints.refresh) {
        if (getStore().getState().auth.refreshToken) {
          getStore().dispatch(AuthActions.RefreshToken({ refreshToken: getStore().getState().auth.refreshToken }))
            .then((result: any) => {
              if (AuthActions.RefreshToken.fulfilled.match(result)) {
                return Promise.resolve(result);
              }
              else {
                getStore().dispatch(LogoutUser());
                router.replace("/(initialRoute)/getStarted");
              }
            });
        }
      }
      else {
        getStore().dispatch(
          showHideToast({
            visible: true,
            message:
              error.message === "Network Error"
                ? "Please check your network"
                : error.response?.data?.message instanceof Array ? error.response?.data?.message.join("\n") : error.response?.data?.message,
            preset: ToastPresets.FAILURE,
          })
        );
      }
    }
    return Promise.reject(error);
  }
);

export default client;
