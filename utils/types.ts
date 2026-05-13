import { ToastProps } from "react-native-ui-lib";

export interface Others {
  loading: boolean;
  toast: ToastProps | null;
  loginModal: {
    visible: boolean;
    message?: string;
  };
}

export interface Auth {
  user: User | null;
  isLoggedIn: boolean;
  accessToken: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  /** From signup / profile API (customer) */
  title?: string;
  company?: string;
  phone?: string;
  avatarUrl?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  /** Raw role / profile fields from API (optional) */
  address?: string | null;
  countryCode?: string | null;
  fullMobileNumber?: string | null;
}

// Login API success envelope
export interface LoginApiData {
  id: string;
  decoded_id?: number;
  first_name: string;
  last_name: string;
  fullname: string;
  email: string;
  access_token: string;
  title?: string;
  company?: string;
  signup_via?: string;
  mobile_number?: string;
  country_code?: string;
  full_mobile_number?: string;
  gender?: string | null;
  dob?: string | null;
  last_login_at?: string;
  is_notify?: string;
  role: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  profile_photo?: string | null;
  avatar_url?: string | null;
  profile_image?: string | null;
  image?: string | null;
}

// API Error Response Type (axios interceptor + legacy shapes)
export interface ApiErrorResponse {
  success?: boolean;
  statusCode?: number;
  message?: string | string[];
  error?: string | { code?: number; messages?: string | string[] };
  path?: string;
  timestamp?: string;
}
