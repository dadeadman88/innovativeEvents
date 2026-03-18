import { createAsyncThunk } from '@reduxjs/toolkit';
import client from '../../utils/AxiosInterceptor';
import { feedEndpoints } from '../../utils/Endpoints';

export const FeedActions = {
  getHomeFeed: createAsyncThunk(
    'feed/getHomeFeed',
    async (params: {
      includeFeatured?: boolean;
      includeRecentVideos?: boolean;
      includeSeries?: boolean;
      includeSmallGroups?: boolean;
      includeContinueWatching?: boolean;
      featuredLimit?: number;
      recentVideosLimit?: number;
      seriesLimit?: number;
      smallGroupsLimit?: number;
      newBadgeDays?: number;
    }) => {
      const queryParams = new URLSearchParams(params as any).toString();
      const apiCall = await client.get(`${feedEndpoints.home}?${queryParams}`);
      return apiCall.data;
    }
  ),
};

