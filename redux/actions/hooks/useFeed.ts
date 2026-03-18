import { AppDispatch, RootState } from '@/redux/store';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FeedActions } from '../FeedActions';

export const useFeedState = () => {
  return useSelector((state: RootState) => state.feed);
};

export const useHomeFeed = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params?: {
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
      try {
        const result = await dispatch(FeedActions.getHomeFeed(params || {}));
        return FeedActions.getHomeFeed.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching home feed:', error);
        return false;
      }
    },
    [dispatch]
  );
};

