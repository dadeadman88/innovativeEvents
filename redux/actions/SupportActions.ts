import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../utils/AxiosInterceptor';
import { infoEndpoints, supportEndpoints } from '../../utils/Endpoints';
import { setLoading } from '../slices/OtherSlice';

export const SupportActions = {
  getFAQs: createAsyncThunk(
    'support/getFAQs',
    async (params: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      order?: 'ASC' | 'DESC';
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${infoEndpoints.faqs}?${queryParams}`);
      return apiCall.data;
    }
  ),

  getMyTickets: createAsyncThunk(
    'support/getMyTickets',
    async (_) => {
      const apiCall = await client.get(supportEndpoints.myTickets);
      return apiCall.data;
    }
  ),

  createTicket: createAsyncThunk(
    'support/createTicket',
    async (data: {
      type: 'BUG' | 'FEEDBACK' | 'CONTACT';
      subject: string;
      message: string;
      attachmentUrls?: string[];
    }, thunkAPI) => {
      thunkAPI.dispatch(setLoading(true));
      const apiCall = await client.post(supportEndpoints.createTicket, data);
      return apiCall.data;
    }
  ),
};

