import { createSlice } from '@reduxjs/toolkit';
import { Video } from '../../utils/types';
import { FeedActions } from '../actions/FeedActions';

interface FeedState {
  homeFeed: any | null;
  featured: Video[];
  recentVideos: Video[];
  series: any[];
  smallGroups: any[];
  continueWatching: any[];
}

const initialState: FeedState = {
  homeFeed: null,
  featured: [],
  recentVideos: [],
  series: [],
  smallGroups: [],
  continueWatching: [],
};

const FeedSlice = createSlice({
  name: 'Feed',
  initialState,
  reducers: {
    clearFeed: (state) => {
      state.homeFeed = null;
      state.featured = [];
      state.recentVideos = [];
      state.series = [];
      state.smallGroups = [];
      state.continueWatching = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(FeedActions.getHomeFeed.fulfilled, (state, action) => {
      state.homeFeed = action.payload?.data || action.payload;
      state.featured = action.payload?.data?.featured || [];
      state.recentVideos = action.payload?.data?.recentVideos || [];
      state.series = action.payload?.data?.series || [];
      state.smallGroups = action.payload?.data?.smallGroups || [];
      state.continueWatching = action.payload?.data?.continueWatching || [];
    });
  },
});

export const { clearFeed } = FeedSlice.actions;
export default FeedSlice.reducer;

