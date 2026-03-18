import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../utils/AxiosInterceptor';
import { videosEndpoints } from '../../utils/Endpoints';
import { convertDataToFormData } from '../../utils/constants';

export const VideosActions = {
  getFeaturedVideos: createAsyncThunk(
    'videos/getFeaturedVideos',
    async (params: {
      sortBy?: 'publishedAt' | 'views' | 'duration' | 'title';
      order?: 'ASC' | 'DESC';
      q?: string;
      seriesId?: string;
      featured?: string;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${videosEndpoints.featured}?${queryParams}`);
      return apiCall.data;
    }
  ),

  getExploreVideos: createAsyncThunk(
    'videos/getExploreVideos',
    async (params: {
      sortBy?: 'publishedAt' | 'views' | 'duration' | 'title';
      order?: 'ASC' | 'DESC';
      q?: string;
      seriesId?: string;
      featured?: string;
      page?: number;
      limit?: number;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${videosEndpoints.explore}?${queryParams}`);
      return apiCall.data;
    }
  ),

  loadMoreExploreVideos: createAsyncThunk(
    'videos/loadMoreExploreVideos',
    async (params: {
      sortBy?: 'publishedAt' | 'views' | 'duration' | 'title';
      order?: 'ASC' | 'DESC';
      q?: string;
      seriesId?: string;
      featured?: string;
      page?: number;
      limit?: number;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${videosEndpoints.explore}?${queryParams}`);
      return apiCall.data;
    }
  ),

  getVideoDetail: createAsyncThunk(
    'videos/getVideoDetail',
    async (id: string) => {
      const apiCall = await client.get(videosEndpoints.detail(id));
      return apiCall.data;
    }
  ),

  getVideoPlayback: createAsyncThunk(
    'videos/getVideoPlayback',
    async (id: string) => {
      const apiCall = await client.get(videosEndpoints.playback(id));
      return apiCall.data;
    }
  ),

  markVideoView: createAsyncThunk(
    'videos/markVideoView',
    async (id: string) => {
      const apiCall = await client.post(videosEndpoints.markView(id));
      return apiCall.data;
    }
  ),

  updateVideoProgress: createAsyncThunk(
    'videos/updateVideoProgress',
    async (data: { id: string; progress: number; timestamp: number }) => {
      const formData = convertDataToFormData({ progress: data.progress, timestamp: data.timestamp });
      const apiCall = await client.post(videosEndpoints.progress(data.id), formData);
      return apiCall.data;
    }
  ),

  bookmarkVideo: createAsyncThunk(
    'videos/bookmarkVideo',
    async (data: { id: string; bookmarked: boolean }) => {
      const formData = convertDataToFormData({ bookmarked: data.bookmarked });
      const apiCall = await client.post(videosEndpoints.bookmark(data.id), formData);
      return apiCall.data;
    }
  ),
};

