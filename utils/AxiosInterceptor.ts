import { LogoutUser } from "@/redux/slices/AuthSlice";
import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import { ToastPresets } from "react-native-ui-lib";
import { setLoading, showHideToast } from "../redux/slices/OtherSlice";
import { authEndpoints, BASE_URL, eventEndpoints } from "./Endpoints";
import { ApiErrorResponse } from "./types";

function getAxiosErrorMessage(error: AxiosError<ApiErrorResponse>): string {
  if (error.message === "Network Error") return "Please check your network";
  const data = error.response?.data as any;
  if (data?.error) {
    if (data.error.messages) {
      const m = data.error.messages;
      return Array.isArray(m) ? m.join("\n") : String(m);
    }
    if (data.error.message) {
      return String(data.error.message);
    }
  }
  if (data?.message) {
    const m = data.message;
    return Array.isArray(m) ? m.join("\n") : String(m);
  }
  return error.message || "Something went wrong";
}

/** Unauthenticated auth calls: never treat 401 as “session expired”. */
function isPublicAuthRequestUrl(url: string | undefined): boolean {
  if (!url) return false;
  const publicPaths = [
    authEndpoints.login,
    authEndpoints.register,
    authEndpoints.contractorRegister,
    authEndpoints.checkEmail,
    authEndpoints.forgotPassword,
    authEndpoints.resetPassword,
  ] as const;
  return publicPaths.some((p) => url === p || url.endsWith(`/${p}`));
}

const EVENT_LIST_PATH_SUFFIXES = [
  eventEndpoints.all,
  eventEndpoints.contractorAll,
  eventEndpoints.contractorAssignedAll,
] as const;

/**
 * Endpoints whose errors are entirely the caller's problem. For these we:
 *   - never force a global logout / redirect on 401, AND
 *   - never show the default FAILURE toast on any other error status.
 *
 * Use this for requests where the call-site needs to translate the failure
 * into something user-meaningful (e.g. "You have already checked in" for
 * `event/checkin/add` is not the same as the raw backend message, and we
 * don't want a stale 401 to bounce the contractor out to the welcome screen
 * mid-job).
 */
const CALLER_HANDLED_PATH_SUFFIXES = [
  eventEndpoints.checkinAdd,
  eventEndpoints.checkoutAdd,
] as const;

function resolveRequestUrl(url: string | undefined, baseURL?: string): string {
  const raw = (url ?? "").trim();
  if (!raw) return (baseURL ?? "").trim();
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  const base = (baseURL ?? "").replace(/\/+$/, "");
  const path = raw.replace(/^\//, "");
  return base ? `${base}/${path}` : raw;
}

/** 401 on event list should not force app-wide logout (treat as recoverable; wrong params or API quirks). */
function isEventListRequestUrl(url: string | undefined, baseURL?: string): boolean {
  const full = resolveRequestUrl(url, baseURL);
  if (!full) return false;
  return EVENT_LIST_PATH_SUFFIXES.some((suffix) => full.includes(suffix));
}

/** Endpoints whose errors are surfaced/handled entirely by the calling code. */
function isCallerHandledRequestUrl(url: string | undefined, baseURL?: string): boolean {
  const full = resolveRequestUrl(url, baseURL);
  if (!full) return false;
  return CALLER_HANDLED_PATH_SUFFIXES.some((suffix) => full.includes(suffix));
}

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
    if (config.data instanceof FormData) {
      delete (config.headers as Record<string, unknown>)["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

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
      const status = error.response?.status;
      const requestUrl = error.config?.url;
      const requestBase = error.config?.baseURL;
      const isCallerHandled = isCallerHandledRequestUrl(requestUrl, requestBase);
      console.log("Axios error response", error.config?.headers, status, requestUrl);
      if (status === 401) {
        const isEventList = isEventListRequestUrl(requestUrl, requestBase);

        if (isPublicAuthRequestUrl(requestUrl) || isEventList || isCallerHandled) {
          const message = getAxiosErrorMessage(error);
          const isCheckEmail =
            requestUrl === authEndpoints.checkEmail ||
            requestUrl?.endsWith(`/${authEndpoints.checkEmail}`);
          const treatAsSuccess =
            isCheckEmail && message.toLowerCase().includes("does not exist");

          if (!treatAsSuccess && !isEventList && !isCallerHandled) {
            getStore().dispatch(
              showHideToast({
                visible: true,
                message,
                preset: ToastPresets.FAILURE,
              })
            );
          }
        } else {
          getStore().dispatch(LogoutUser());
          router.replace("/(initialRoute)/getStarted");
        }
      }
      else if (!isCallerHandled) {
        getStore().dispatch(
          showHideToast({
            visible: true,
            message: getAxiosErrorMessage(error),
            preset: ToastPresets.FAILURE,
          })
        );
      }
    }
    return Promise.reject(error);
  }
);

export default client;
