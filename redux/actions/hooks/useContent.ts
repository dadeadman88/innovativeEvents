import { AppDispatch, RootState } from '@/redux/store';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SeriesActions } from '../SeriesActions';
import { SmallGroupsActions } from '../SmallGroupsActions';
import { VideosActions } from '../VideosActions';

export const useContentState = () => {
  return useSelector((state: RootState) => state.content);
};

// Series Hooks
export const useSeriesHome = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params?: { q?: string; category?: string; featuredOnly?: boolean; page?: number; limit?: number }) => {
      try {
        const result = await dispatch(SeriesActions.getSeriesHome(params || {}));
        return SeriesActions.getSeriesHome.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching series home:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useLoadMoreSeries = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params?: { q?: string; category?: string; featuredOnly?: boolean; page?: number; limit?: number }) => {
      try {
        const result = await dispatch(SeriesActions.loadMoreSeries(params || {}));
        return SeriesActions.loadMoreSeries.fulfilled.match(result);
      } catch (error) {
        console.error('Error loading more series:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useSeriesList = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params?: { q?: string; category?: string; featuredOnly?: boolean }) => {
      try {
        const result = await dispatch(SeriesActions.getSeriesList(params || {}));
        return SeriesActions.getSeriesList.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching series list:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useSeriesDetail = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (id: string) => {
      try {
        const result = await dispatch(SeriesActions.getSeriesDetail(id));
        return SeriesActions.getSeriesDetail.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching series detail:', error);
        return false;
      }
    },
    [dispatch]
  );
};

// Videos Hooks
export const useFeaturedVideos = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params?: {
      sortBy?: 'publishedAt' | 'views' | 'duration' | 'title';
      order?: 'ASC' | 'DESC';
      q?: string;
      seriesId?: string;
      featured?: string;
    }) => {
      try {
        const result = await dispatch(VideosActions.getFeaturedVideos(params || {}));
        return VideosActions.getFeaturedVideos.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching featured videos:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useExploreVideos = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params?: {
      sortBy?: 'publishedAt' | 'views' | 'duration' | 'title';
      order?: 'ASC' | 'DESC';
      q?: string;
      seriesId?: string;
      featured?: string;
      page?: number;
      limit?: number;
    }) => {
      try {
        const result = await dispatch(VideosActions.getExploreVideos(params || {}));
        return VideosActions.getExploreVideos.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching explore videos:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useLoadMoreExploreVideos = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params?: {
      sortBy?: 'publishedAt' | 'views' | 'duration' | 'title';
      order?: 'ASC' | 'DESC';
      q?: string;
      seriesId?: string;
      featured?: string;
      page?: number;
      limit?: number;
    }) => {
      try {
        const result = await dispatch(VideosActions.loadMoreExploreVideos(params || {}));
        return VideosActions.loadMoreExploreVideos.fulfilled.match(result);
      } catch (error) {
        console.error('Error loading more explore videos:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useVideoDetail = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (id: string) => {
      try {
        const result = await dispatch(VideosActions.getVideoDetail(id));
        return VideosActions.getVideoDetail.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching video detail:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useVideoPlayback = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (id: string) => {
      try {
        const result = await dispatch(VideosActions.getVideoPlayback(id));
        return VideosActions.getVideoPlayback.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching video playback:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useMarkVideoView = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (id: string) => {
      try {
        const result = await dispatch(VideosActions.markVideoView(id));
        return VideosActions.markVideoView.fulfilled.match(result);
      } catch (error) {
        console.error('Error marking video view:', error);
        return false;
      }
    },
    [dispatch]
  );
};

// Small Groups Hooks
export const useSmallGroupsHome = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params?: { q?: string; featuredOnly?: boolean }) => {
      try {
        const result = await dispatch(SmallGroupsActions.getSmallGroupsHome(params || {}));
        return SmallGroupsActions.getSmallGroupsHome.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching small groups home:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useSmallGroupsList = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params?: { q?: string; featuredOnly?: boolean }) => {
      try {
        const result = await dispatch(SmallGroupsActions.getSmallGroupsList(params || {}));
        return SmallGroupsActions.getSmallGroupsList.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching small groups list:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useFeaturedSmallGroups = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params?: { q?: string; featuredOnly?: boolean }) => {
      try {
        const result = await dispatch(SmallGroupsActions.getFeaturedSmallGroups(params || {}));
        return SmallGroupsActions.getFeaturedSmallGroups.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching featured small groups:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useExploreSmallGroups = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params?: { q?: string; featuredOnly?: boolean; page?: number; limit?: number }) => {
      try {
        const result = await dispatch(SmallGroupsActions.getExploreSmallGroups(params || {}));
        return SmallGroupsActions.getExploreSmallGroups.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching explore small groups:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useLoadMoreExploreSmallGroups = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params?: { q?: string; featuredOnly?: boolean; page?: number; limit?: number }) => {
      try {
        const result = await dispatch(SmallGroupsActions.loadMoreExploreSmallGroups(params || {}));
        return SmallGroupsActions.loadMoreExploreSmallGroups.fulfilled.match(result);
      } catch (error) {
        console.error('Error loading more explore small groups:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useSmallGroupDetail = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (id: string) => {
      try {
        const result = await dispatch(SmallGroupsActions.getSmallGroupDetail(id));
        return SmallGroupsActions.getSmallGroupDetail.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching small group detail:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useRelatedSmallGroups = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (id: string) => {
      try {
        const result = await dispatch(SmallGroupsActions.getRelatedSmallGroups(id));
        return SmallGroupsActions.getRelatedSmallGroups.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching related small groups:', error);
        return false;
      }
    },
    [dispatch]
  );
};

