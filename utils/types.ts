import { ToastProps } from "react-native-ui-lib";

export interface Others {
  loading: boolean;
  toast: ToastProps | null;
  loginModal: {
    visible: boolean;
    message?: string;
  };
}

export interface Guest {
  id: string;
  nickname: string;
}

export interface Auth {
  user: User | null;
  guest: Guest | null;
  isLoggedIn: boolean;
  isGuest: boolean;
  refreshToken: string;
  accessToken: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  avatarUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  preferences: {
    id: string;
    theme: string;
    notifyAll: boolean;
    notifyNewVideo: boolean;
    notifyNewSeries: boolean;
    notifyNewSmallGroup: boolean;
    notifyAnnouncements: boolean;
    downloadOnWifiOnly: boolean;
    language: string;
  };
  profile: {
    id: string;
    address1: string;
    address2: string;
    city: string;
    zip: string;
    country: string;
  };
}

// Video Type (for recent videos, featured, etc.)
export interface Video {
  type: string;
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string | null;
  publishedAt: string;
  isNew: boolean;
}

// Video Detail Type
export interface VideoDetail {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  vimeoVideoUrl?: string | null;
  duration: number | null;
  views: number;
  publishedAt: string;
  isFeatured: boolean;
  isBookmarked?: boolean;
  series: {
    id: string;
    title: string;
  } | null;
  attachments: any[];
  progress: any | null;
  upcoming: UpcomingVideo[];
}

// Upcoming Video Type
export interface UpcomingVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  duration: number | null;
  views: number;
  publishedAt: string;
  isFeatured: boolean;
  series: {
    id: string;
    title: string;
  } | null;
}

// Series Type
export interface Series {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  thumbnailStoragePath: string | null;
  thumbnailSignedExpiresAt: string | null;
  episodesCount: number;
  isNew: boolean;
  isFeatured: boolean;
  featuredOrder: number | null;
  category: any | null;
  slug: string | null;
  visibility: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Episode Type
export interface Episode {
  id: string;
  title: string;
  description: string;
  episodeNumber: number;
  duration: number | null;
  thumbnailUrl: string | null;
  thumbnailStoragePath: string | null;
  thumbnailSignedExpiresAt: string | null;
  vimeoVideoUrl: string | null;
  videoStoragePath: string | null;
  videoSignedExpiresAt: string | null;
  seriesId: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Series Detail Response Type
export interface SeriesDetail extends Series {
  episodes: Episode[];
  progress?: {
    completedEpisodesCount: number;
    totalEpisodesCount: number;
    progressPercentage: number;
    lastWatchedEpisode?: Episode;
  };
  isBookmarked?: boolean;
}

// Series Home Response Type
export interface SeriesHomeResponse {
  hero: Series[];
  explore: {
    data: Series[];
    total: number;
    page: number;
    limit: number;
  };
}

// API Error Response Type
export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
}

// Mark Video View Response Type
export interface MarkViewResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
}

// Search Types
export interface SearchVideo {
  kind: 'video';
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  publishedAt: string;
  isNew: boolean;
  seriesId: string | null;
  groupId: string | null;
}

export interface SearchSeries {
  kind: 'series';
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  episodesCount: number;
  publishedAt: string;
  isNew: boolean;
  category: string | null;
}

export interface SearchGroup {
  kind: 'group';
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  membersCount: number;
  publishedAt: string;
  isNew: boolean;
  category: string | null;
}

export interface SearchAttachment {
  id: string;
  title: string;
  url: string;
  mimeType: string;
}

export interface SearchResultData {
  page: number;
  limit: number;
  series: {
    items: SearchSeries[];
    total: number;
  };
  groups: {
    items: SearchGroup[];
    total: number;
  };
  videos: {
    items: SearchVideo[];
    total: number;
  };
  attachments: {
    items: SearchAttachment[];
    total: number;
  };
}

export interface SearchResult {
  success: boolean;
  statusCode: number;
  message: string;
  data: SearchResultData;
}

// Search Parameters Type
export interface SearchParams {
  q: string;
  type?: 'all' | 'videos' | 'series' | 'groups' | 'attachments';
  page?: number;
  limit?: number;
  sort?: 'relevance' | 'newest' | 'popular';
  category?: string;
  minDuration?: number;
  maxDuration?: number;
  inSeriesId?: string;
  inGroupId?: string;
  onlyNew?: boolean;
}
