import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../utils/AxiosInterceptor';
import { notificationsEndpoints } from '../../utils/Endpoints';
import { convertDataToFormData } from '../../utils/constants';

export const NotificationsActions = {
  registerDevice: createAsyncThunk(
    'notifications/registerDevice',
    async (data: { deviceToken: string; platform: string; deviceId: string }) => {
      const formData = convertDataToFormData(data);
      const apiCall = await client.post(notificationsEndpoints.registerDevice, formData);
      return apiCall.data;
    }
  ),

  deactivateDevice: createAsyncThunk(
    'notifications/deactivateDevice',
    async (data: { deviceId: string }) => {
      const formData = convertDataToFormData(data);
      const apiCall = await client.post(notificationsEndpoints.deactivate, formData);
      return apiCall.data;
    }
  ),

  getNotifications: createAsyncThunk(
    'notifications/getNotifications',
    async (params: {
      read?: 'all' | 'read' | 'unread';
      type?: 'ONBOARDING' | 'NEW_VIDEO' | 'NEW_SERIES' | 'NEW_SMALL_GROUP' | 'ANNOUNCEMENT' | 'SYSTEM';
      page?: number;
      limit?: number;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${notificationsEndpoints.list}?${queryParams}`);
      console.warn("=== NOTIFICATIONS API RESPONSE ===");
      console.warn("Full Response:", JSON.stringify(apiCall.data, null, 2));
      console.warn("Response.data:", JSON.stringify(apiCall.data?.data, null, 2));
      console.warn("==================================");
      return apiCall.data;
    }
  ),

  loadMoreNotifications: createAsyncThunk(
    'notifications/loadMoreNotifications',
    async (params: {
      read?: 'all' | 'read' | 'unread';
      type?: 'ONBOARDING' | 'NEW_VIDEO' | 'NEW_SERIES' | 'NEW_SMALL_GROUP' | 'ANNOUNCEMENT' | 'SYSTEM';
      page?: number;
      limit?: number;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${notificationsEndpoints.list}?${queryParams}`);
      return apiCall.data;
    }
  ),

  markRead: createAsyncThunk(
    'notifications/markRead',
    async (notificationIds: string[]) => {
      const formData = convertDataToFormData({ notificationIds });
      const apiCall = await client.post(notificationsEndpoints.markRead, formData);
      return apiCall.data;
    }
  ),

  markAllRead: createAsyncThunk(
    'notifications/markAllRead',
    async (data: { upToDate?: string }) => {
      const formData = convertDataToFormData(data);
      const apiCall = await client.post(notificationsEndpoints.markAllRead, formData);
      return apiCall.data;
    }
  ),

  removeNotification: createAsyncThunk(
    'notifications/removeNotification',
    async (id: string) => {
      const apiCall = await client.delete(notificationsEndpoints.remove(id));
      return apiCall.data;
    }
  ),

  getSettings: createAsyncThunk(
    'notifications/getSettings',
    async (_) => {
      const apiCall = await client.get(notificationsEndpoints.getSettings);
      return apiCall.data;
    }
  ),

  updateSettings: createAsyncThunk(
    'notifications/updateSettings',
    async (data: {
      emailNotifications?: boolean;
      pushNotifications?: boolean;
      smsNotifications?: boolean;
    }) => {
      const formData = convertDataToFormData(data);
      const apiCall = await client.post(notificationsEndpoints.updateSettings, formData);
      return apiCall.data;
    }
  ),
};

