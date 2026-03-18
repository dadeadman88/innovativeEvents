import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../utils/AxiosInterceptor';
import { seriesEndpoints } from '../../utils/Endpoints';
import { convertDataToFormData } from '../../utils/constants';

export const SeriesActions = {
  getSeriesHome: createAsyncThunk(
    'series/getSeriesHome',
    async (params: { q?: string; category?: string; featuredOnly?: boolean; page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${seriesEndpoints.home}?${queryParams}`);
      return apiCall.data?.data;
    }
  ),

  loadMoreSeries: createAsyncThunk(
    'series/loadMoreSeries',
    async (params: { q?: string; category?: string; featuredOnly?: boolean; page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${seriesEndpoints.home}?${queryParams}`);
      return apiCall.data?.data;
    }
  ),

  getSeriesList: createAsyncThunk(
    'series/getSeriesList',
    async (params: { q?: string; category?: string; featuredOnly?: boolean }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${seriesEndpoints.list}?${queryParams}`);
      return apiCall.data?.data;
    }
  ),

  getSeriesDetail: createAsyncThunk(
    'series/getSeriesDetail',
    async (id: string) => {
      const apiCall = await client.get(seriesEndpoints.detail(id));
      return apiCall.data;
    }
  ),

  getSeriesProgress: createAsyncThunk(
    'series/getSeriesProgress',
    async (id: string) => {
      const apiCall = await client.get(seriesEndpoints.progress(id));
      return apiCall.data;
    }
  ),

  bookmarkSeries: createAsyncThunk(
    'series/bookmarkSeries',
    async (id: string) => {
      const apiCall = await client.post(seriesEndpoints.bookmark(id));
      return apiCall.data;
    }
  ),

  startSeries: createAsyncThunk(
    'series/startSeries',
    async (id: string) => {
      const apiCall = await client.get(seriesEndpoints.start(id));
      return apiCall.data;
    }
  ),

  getSeriesDownloads: createAsyncThunk(
    'series/getSeriesDownloads',
    async (id: string) => {
      const apiCall = await client.get(seriesEndpoints.downloads(id));
      return apiCall.data;
    }
  ),

  completeSeries: createAsyncThunk(
    'series/completeSeries',
    async (data: { id: string; completed: boolean }) => {
      const formData = convertDataToFormData({ completed: data.completed });
      const apiCall = await client.post(seriesEndpoints.complete(data.id), formData);
      return apiCall.data;
    }
  ),
};

