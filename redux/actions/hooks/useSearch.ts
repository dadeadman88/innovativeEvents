import { AppDispatch, RootState } from '@/redux/store';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchActions } from '../SearchActions';

export const useSearchState = () => {
  return useSelector((state: RootState) => state.search);
};

export const useSearchHome = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params: { heroLimit?: number; videosLimit?: number } = {}) => {
      try {
        const result = await dispatch(
          SearchActions.getSearchHome({
            heroLimit: params.heroLimit || 6,
            videosLimit: params.videosLimit || 12,
          })
        );
        return SearchActions.getSearchHome.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching search home:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useSearchSuggestions = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (q: string, limit: number = 6) => {
      try {
        const result = await dispatch(SearchActions.getSuggestions({ q, limit }));
        return SearchActions.getSuggestions.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useTrending = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(async () => {
    try {
      const result = await dispatch(SearchActions.getTrending());
      return SearchActions.getTrending.fulfilled.match(result);
    } catch (error) {
      console.error('Error fetching trending:', error);
      return false;
    }
  }, [dispatch]);
};

export const useSearch = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
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
      try {
        const result = await dispatch(SearchActions.search(params));
        return SearchActions.search.fulfilled.match(result);
      } catch (error) {
        console.error('Error searching:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useLoadMoreSearch = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
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
      try {
        const result = await dispatch(SearchActions.loadMoreSearch(params));
        return SearchActions.loadMoreSearch.fulfilled.match(result);
      } catch (error) {
        console.error('Error loading more search results:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useWordPressPosts = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params: { page?: number; per_page?: number } = {}) => {
      try {
        const result = await dispatch(SearchActions.getWordPressPosts(params));
        return SearchActions.getWordPressPosts.fulfilled.match(result);
      } catch (error) {
        console.error('Error fetching WordPress posts:', error);
        return false;
      }
    },
    [dispatch]
  );
};

export const useLoadMoreWordPressPosts = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    async (params: { page?: number; per_page?: number } = {}) => {
      try {
        const result = await dispatch(SearchActions.loadMoreWordPressPosts(params));
        return SearchActions.loadMoreWordPressPosts.fulfilled.match(result);
      } catch (error) {
        console.error('Error loading more WordPress posts:', error);
        return false;
      }
    },
    [dispatch]
  );
};

