import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../utils/AxiosInterceptor';
import { libraryEndpoints } from '../../utils/Endpoints';
import { convertDataToFormData } from '../../utils/constants';

export const LibraryActions = {
  getLibraryHome: createAsyncThunk(
    'library/getLibraryHome',
    async (_) => {
      const apiCall = await client.get(libraryEndpoints.home);
      return apiCall.data;
    }
  ),

  getBookmarks: createAsyncThunk(
    'library/getBookmarks',
    async (params: {
      targetType?: 'VIDEO' | 'SERIES' | 'SMALL_GROUP';
      page?: number;
      limit?: number;
      q?: string;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${libraryEndpoints.bookmarks}?${queryParams}`);
      return apiCall.data;
    }
  ),

  loadMoreBookmarks: createAsyncThunk(
    'library/loadMoreBookmarks',
    async (params: {
      targetType?: 'VIDEO' | 'SERIES' | 'SMALL_GROUP';
      page?: number;
      limit?: number;
      q?: string;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${libraryEndpoints.bookmarks}?${queryParams}`);
      return apiCall.data;
    }
  ),

  toggleBookmark: createAsyncThunk(
    'library/toggleBookmark',
    async (data: { targetId: string; targetType: 'VIDEO' | 'SERIES' | 'SMALL_GROUP' }) => {
      const formData = convertDataToFormData(data);
      const apiCall = await client.post(libraryEndpoints.toggleBookmark, formData);
      return apiCall.data;
    }
  ),

  bulkRemoveBookmarks: createAsyncThunk(
    'library/bulkRemoveBookmarks',
    async (ids: string[]) => {
      const formData = convertDataToFormData({ ids });
      const apiCall = await client.post(libraryEndpoints.bulkRemoveBookmarks, formData);
      return apiCall.data;
    }
  ),

  getHistory: createAsyncThunk(
    'library/getHistory',
    async (params: {
      completed?: string;
      inProgress?: string;
      page?: number;
      limit?: number;
      q?: string;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${libraryEndpoints.history}?${queryParams}`);
      console.warn("=== HISTORY API RESPONSE ===");
      console.warn("Full Response:", JSON.stringify(apiCall.data, null, 2));
      console.warn("Response.data:", JSON.stringify(apiCall.data?.data, null, 2));
      console.warn("Response.meta:", JSON.stringify(apiCall.data?.meta, null, 2));
      console.warn("============================");
      return apiCall.data;
    }
  ),

  loadMoreHistory: createAsyncThunk(
    'library/loadMoreHistory',
    async (params: {
      completed?: string;
      inProgress?: string;
      page?: number;
      limit?: number;
      q?: string;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${libraryEndpoints.history}?${queryParams}`);
      return apiCall.data;
    }
  ),

  clearHistory: createAsyncThunk(
    'library/clearHistory',
    async (_) => {
      const apiCall = await client.delete(libraryEndpoints.clearHistory);
      return apiCall.data;
    }
  ),

  updateProgress: createAsyncThunk(
    'library/updateProgress',
    async (data: { videoId: string; progress: number; timestamp: number }) => {
      const formData = convertDataToFormData(data);
      const apiCall = await client.patch(libraryEndpoints.updateProgress, formData);
      return apiCall.data;
    }
  ),

  removeFromHistory: createAsyncThunk(
    'library/removeFromHistory',
    async (videoId: string) => {
      const apiCall = await client.delete(libraryEndpoints.removeFromHistory(videoId));
      return apiCall.data;
    }
  ),

  getDownloads: createAsyncThunk(
    'library/getDownloads',
    async (params: { page?: number; limit?: number; q?: string }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${libraryEndpoints.downloads}?${queryParams}`);
      return apiCall.data;
    }
  ),

  addDownload: createAsyncThunk(
    'library/addDownload',
    async (data: { videoId: string }) => {
      const formData = convertDataToFormData(data);
      const apiCall = await client.post(libraryEndpoints.addDownload, formData);
      return apiCall.data;
    }
  ),

  clearDownloads: createAsyncThunk(
    'library/clearDownloads',
    async (_) => {
      const apiCall = await client.delete(libraryEndpoints.clearDownloads);
      return apiCall.data;
    }
  ),

  removeDownload: createAsyncThunk(
    'library/removeDownload',
    async (videoId: string) => {
      const apiCall = await client.delete(libraryEndpoints.removeDownload(videoId));
      return apiCall.data;
    }
  ),
};

