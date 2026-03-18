import { createSlice } from '@reduxjs/toolkit';
import { NotificationsActions } from '../actions/NotificationsActions';

interface NotificationsState {
  notifications: {
    items: any[];
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  } | null;
  settings: any | null;
}

const initialState: NotificationsState = {
  notifications: null,
  settings: null,
};

const NotificationsSlice = createSlice({
  name: 'Notifications',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(NotificationsActions.getNotifications.fulfilled, (state, action) => {
      console.warn("NotificationsSlice - getNotifications.fulfilled");
      console.warn("Action payload:", JSON.stringify(action.payload, null, 2));
      
      const notificationsData = action.payload?.data || [];
      const meta = action.payload?.meta || {};
      
      state.notifications = {
        items: Array.isArray(notificationsData) ? notificationsData : [],
        page: meta?.page || 1,
        limit: meta?.limit || 20,
        total: meta?.total || 0,
        hasNext: meta?.hasNext || false,
      };
    });

    builder.addCase(NotificationsActions.loadMoreNotifications.fulfilled, (state, action) => {
      const notificationsData = action.payload?.data || [];
      const meta = action.payload?.meta || {};
      
      if (state.notifications && Array.isArray(notificationsData)) {
        state.notifications.items = [
          ...state.notifications.items,
          ...notificationsData
        ];
        state.notifications.page = meta.page || state.notifications.page;
        state.notifications.limit = meta.limit || state.notifications.limit;
        state.notifications.total = meta.total || state.notifications.total;
        state.notifications.hasNext = meta.hasNext || false;
      }
    });

    builder.addCase(NotificationsActions.getSettings.fulfilled, (state, action) => {
      state.settings = action.payload?.data || action.payload;
    });
  },
});

export const { clearNotifications } = NotificationsSlice.actions;
export default NotificationsSlice.reducer;

