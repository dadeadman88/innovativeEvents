// Base URL (used by AxiosInterceptor)
export const BASE_URL =
  "https://renew-uni-app-backend-production.up.railway.app";

// Legacy endpoints for backward compatibility (relative paths)
export const endpoints = {
  Login: "auth/mobile/login",
  Register: "auth/mobile/register",
  Logout: "auth/mobile/logout",
};

// Auth Endpoints (relative paths - base URL already in AxiosInterceptor)
export const authEndpoints = {
  register: "auth/mobile/register",
  login: "auth/mobile/login",
  google: "auth/mobile/google",
  social: "auth/mobile/social",
  guest: "auth/mobile/guest",
  refresh: "auth/mobile/refresh",
  logout: "auth/mobile/logout",
  forgotPassword: "auth/mobile/forgot-password",
  resetPassword: "auth/mobile/reset-password",
};

// Feed Endpoints
export const feedEndpoints = {
  home: "mobile/feed/home",
};

// Search Endpoints
export const searchEndpoints = {
  home: "mobile/search/home",
  suggest: "mobile/search/suggest",
  trending: "mobile/search/trending",
  search: "mobile/search",
};

// Series Endpoints
export const seriesEndpoints = {
  home: "mobile/series/home",
  list: "mobile/series",
  detail: (id: string) => `mobile/series/${id}`,
  progress: (id: string) => `mobile/series/${id}/progress`,
  bookmark: (id: string) => `mobile/series/${id}/bookmark`,
  start: (id: string) => `mobile/series/${id}/start`,
  downloads: (id: string) => `mobile/series/${id}/downloads`,
  complete: (id: string) => `mobile/series/${id}/complete`,
};

// Videos Endpoints
export const videosEndpoints = {
  featured: "mobile/videos/featured",
  explore: "mobile/videos/explore",
  detail: (id: string) => `mobile/videos/${id}`,
  playback: (id: string) => `mobile/videos/${id}/playback`,
  markView: (id: string) => `mobile/videos/${id}/view`,
  progress: (id: string) => `mobile/videos/${id}/progress`,
  bookmark: (id: string) => `mobile/videos/${id}/bookmark`,
};

// Small Groups Endpoints
export const smallGroupsEndpoints = {
  home: "mobile/small-groups/home",
  list: "mobile/small-groups",
  detail: (id: string) => `mobile/small-groups/${id}`,
  related: (id: string) => `mobile/small-groups/${id}/related`,
  progress: (id: string) => `mobile/small-groups/${id}/progress`,
  bookmark: (id: string) => `mobile/small-groups/${id}/bookmark`,
  start: (id: string) => `mobile/small-groups/${id}/start`,
  downloads: (id: string) => `mobile/small-groups/${id}/downloads`,
  complete: (id: string) => `mobile/small-groups/${id}/complete`,
};

// Library Endpoints
export const libraryEndpoints = {
  home: "mobile/library/home",
  bookmarks: "mobile/library/bookmarks",
  toggleBookmark: "mobile/library/bookmarks/toggle",
  bulkRemoveBookmarks: "mobile/library/bookmarks/remove",
  history: "mobile/library/history",
  clearHistory: "mobile/library/history",
  updateProgress: "mobile/library/history/progress",
  removeFromHistory: (videoId: string) => `mobile/library/history/${videoId}`,
  downloads: "mobile/library/downloads",
  addDownload: "mobile/library/downloads",
  clearDownloads: "mobile/library/downloads",
  removeDownload: (videoId: string) => `mobile/library/downloads/${videoId}`,
};

// Notifications Endpoints
export const notificationsEndpoints = {
  registerDevice: "mobile/notifications/register-device",
  deactivate: "mobile/notifications/deactivate",
  list: "mobile/notifications",
  markRead: "mobile/notifications/mark-read",
  markAllRead: "mobile/notifications/mark-all-read",
  remove: (id: string) => `mobile/notifications/${id}`,
  getSettings: "mobile/notifications/settings",
  updateSettings: "mobile/notifications/settings",
};

// Profile Endpoints
export const profileEndpoints = {
  me: "mobile/profile/me",
  update: "mobile/profile",
  changePassword: "mobile/profile/password",
  getPreferences: "mobile/profile/preferences",
  updatePreferences: "mobile/profile/preferences",
  registerDevice: "mobile/profile/device",
};

// Info Endpoints
export const infoEndpoints = {
  faqs: "mobile/info/faqs",
};

// Support Endpoints
export const supportEndpoints = {
  myTickets: "mobile/support/my-tickets",
  createTicket: "mobile/support/tickets",
};

// Share Endpoints
export const shareEndpoints = {
  get: (targetType: "VIDEO" | "SERIES" | "SMALL_GROUP", id: string) =>
    `mobile/share/${targetType}/${id}`,
};
