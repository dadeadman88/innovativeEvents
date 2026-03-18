import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import client from '../../utils/AxiosInterceptor';
import { searchEndpoints } from '../../utils/Endpoints';

export const SearchActions = {
  getSearchHome: createAsyncThunk(
    'search/getSearchHome',
    async (params: { heroLimit: number; videosLimit: number }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${searchEndpoints.home}?${queryParams}`);
      return apiCall.data;
    }
  ),

  getSuggestions: createAsyncThunk(
    'search/getSuggestions',
    async (params: { q: string; limit: number }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${searchEndpoints.suggest}?${queryParams}`);
      return apiCall.data;
    }
  ),

  getTrending: createAsyncThunk(
    'search/getTrending',
    async (_) => {
      const apiCall = await client.get(searchEndpoints.trending);
      return apiCall.data;
    }
  ),

  search: createAsyncThunk(
    'search/search',
    async (params: {
      q: string;
      type?: 'all' | 'video' | 'series' | 'group' | 'attachment';
      page?: number;
      limit?: number;
      sort?: 'relevance' | 'newest' | 'popular';
      category?: string;
      minDuration?: number;
      maxDuration?: number;
      inSeriesId?: string;
      inGroupId?: string;
      onlyNew?: 'true' | 'false';
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${searchEndpoints.search}?${queryParams}`);
      return apiCall.data;
    }
  ),

  loadMoreSearch: createAsyncThunk(
    'search/loadMoreSearch',
    async (params: {
      q: string;
      type?: 'all' | 'video' | 'series' | 'group' | 'attachment';
      page?: number;
      limit?: number;
      sort?: 'relevance' | 'newest' | 'popular';
      category?: string;
      minDuration?: number;
      maxDuration?: number;
      inSeriesId?: string;
      inGroupId?: string;
      onlyNew?: 'true' | 'false';
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${searchEndpoints.search}?${queryParams}`);
      return apiCall.data;
    }
  ),

  getWordPressPosts: createAsyncThunk(
    'search/getWordPressPosts',
    async (params: { page?: number; per_page?: number } = {}) => {
      const { page = 1, per_page = 10 } = params;
      // Use axios directly for external WordPress API
      const apiCall = await axios.get(`https://renew.org/wp-json/wp/v2/posts?_embed&per_page=${per_page}&page=${page}`);
      const totalPages = parseInt(apiCall.headers['x-wp-totalpages'] || '1');
      const total = parseInt(apiCall.headers['x-wp-total'] || '0');
      
      return {
        items: apiCall.data,
        page,
        per_page,
        total,
        totalPages,
        hasNext: page < totalPages,
      };
    }
  ),

  loadMoreWordPressPosts: createAsyncThunk(
    'search/loadMoreWordPressPosts',
    async (params: { page?: number; per_page?: number } = {}) => {
      const { page = 1, per_page = 10 } = params;
      // Use axios directly for external WordPress API
      const apiCall = await axios.get(`https://renew.org/wp-json/wp/v2/posts?_embed&per_page=${per_page}&page=${page}`);
      const totalPages = parseInt(apiCall.headers['x-wp-totalpages'] || '1');
      const total = parseInt(apiCall.headers['x-wp-total'] || '0');
      
      return {
        items: apiCall.data,
        page,
        per_page,
        total,
        totalPages,
        hasNext: page < totalPages,
      };
    }
  ),
};

