// Base URL (used by AxiosInterceptor)
export const BASE_URL = "https://alsayafelectromechanical.com/innovative/api/";

// Keep endpoint exports minimal and app-specific.
// All endpoints are relative paths (AxiosInterceptor already sets baseURL).
export const authEndpoints = {
  register: "register",
  contractorRegister: "contractor/register",
  login: "login",
  checkEmail: "check/email",
  forgotPassword: "user/forgotpassword",
  resetPassword: "user/reset-password",
  updateUser: "user/update",
  deleteUser: "user/delete",
} as const;

export const eventEndpoints = {
  add: "event/add",
  all: "event/all",
  contractorAll: "event/contractor/all",
  contractorAssignedAll: "event/contractor/assigned/all",
  contractorResponse: "event/contractor/response",
  checkinAdd: "event/checkin/add",
  checkoutAdd: "event/checkout/add",
} as const;

export const notificationEndpoints = {
  all: "notification/all",
} as const;


