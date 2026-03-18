import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../utils/AxiosInterceptor';
import { smallGroupsEndpoints } from '../../utils/Endpoints';
import { convertDataToFormData } from '../../utils/constants';

export const SmallGroupsActions = {
  getSmallGroupsHome: createAsyncThunk(
    'smallGroups/getSmallGroupsHome',
    async (params: { q?: string; featuredOnly?: boolean }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${smallGroupsEndpoints.home}?${queryParams}`);
      return apiCall.data;
    }
  ),

  getFeaturedSmallGroups: createAsyncThunk(
    'smallGroups/getFeaturedSmallGroups',
    async (params: { q?: string; featuredOnly?: boolean }) => {
      const queryParams = new URLSearchParams({ ...params, featuredOnly: true } as any).toString();
      const apiCall = await client.get(`${smallGroupsEndpoints.list}?${queryParams}`);
      return apiCall.data;
    }
  ),

  getExploreSmallGroups: createAsyncThunk(
    'smallGroups/getExploreSmallGroups',
    async (params: { q?: string; featuredOnly?: boolean; page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${smallGroupsEndpoints.list}?${queryParams}`);
      return apiCall.data;
    }
  ),

  loadMoreExploreSmallGroups: createAsyncThunk(
    'smallGroups/loadMoreExploreSmallGroups',
    async (params: { q?: string; featuredOnly?: boolean; page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${smallGroupsEndpoints.list}?${queryParams}`);
      return apiCall.data;
    }
  ),

  getSmallGroupsList: createAsyncThunk(
    'smallGroups/getSmallGroupsList',
    async (params: { q?: string; featuredOnly?: boolean }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${smallGroupsEndpoints.list}?${queryParams}`);
      return apiCall.data;
    }
  ),

  getSmallGroupDetail: createAsyncThunk(
    'smallGroups/getSmallGroupDetail',
    async (id: string) => {
      const apiCall = await client.get(smallGroupsEndpoints.detail(id));
      return apiCall.data;
    }
  ),

  getRelatedSmallGroups: createAsyncThunk(
    'smallGroups/getRelatedSmallGroups',
    async (id: string) => {
      const apiCall = await client.get(smallGroupsEndpoints.related(id));
      return apiCall.data;
    }
  ),

  getSmallGroupProgress: createAsyncThunk(
    'smallGroups/getSmallGroupProgress',
    async (id: string) => {
      const apiCall = await client.get(smallGroupsEndpoints.progress(id));
      return apiCall.data;
    }
  ),

  bookmarkSmallGroup: createAsyncThunk(
    'smallGroups/bookmarkSmallGroup',
    async (id: string) => {
      const apiCall = await client.post(smallGroupsEndpoints.bookmark(id));
      return apiCall.data;
    }
  ),

  startSmallGroup: createAsyncThunk(
    'smallGroups/startSmallGroup',
    async (id: string) => {
      const apiCall = await client.get(smallGroupsEndpoints.start(id));
      return apiCall.data;
    }
  ),

  getSmallGroupDownloads: createAsyncThunk(
    'smallGroups/getSmallGroupDownloads',
    async (id: string) => {
      const apiCall = await client.get(smallGroupsEndpoints.downloads(id));
      return apiCall.data;
    }
  ),

  completeSmallGroup: createAsyncThunk(
    'smallGroups/completeSmallGroup',
    async (data: { id: string; completed: boolean }) => {
      const formData = convertDataToFormData({ completed: data.completed });
      const apiCall = await client.post(smallGroupsEndpoints.complete(data.id), formData);
      return apiCall.data;
    }
  ),
};

