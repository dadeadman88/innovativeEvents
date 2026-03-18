import { createSlice } from '@reduxjs/toolkit';
import { SearchActions } from '../actions/SearchActions';

interface SearchState {
  searchHome: any | null;
  suggestions: any[];
  trending: any[];
  searchResults: any | null;
  wordPressPosts: {
    items: any[];
    page: number;
    per_page: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
  } | null;
  searchParams: {
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
  } | null;
}

const initialState: SearchState = {
  searchHome: null,
  suggestions: [],
  trending: [],
  searchResults: null,
  wordPressPosts: null,
  searchParams: null,
};

const SearchSlice = createSlice({
  name: 'Search',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = null;
      state.searchParams = null;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(SearchActions.getSearchHome.fulfilled, (state, action) => {
      state.searchHome = action.payload?.data || action.payload;
    });

    builder.addCase(SearchActions.getSuggestions.fulfilled, (state, action) => {
      state.suggestions = action.payload?.data || action.payload;
    });

    builder.addCase(SearchActions.getTrending.fulfilled, (state, action) => {
      state.trending = action.payload?.data || action.payload;
    });

    builder.addCase(SearchActions.search.fulfilled, (state, action) => {
      state.searchResults = action.payload?.data || action.payload;
      // Store search params for pagination
      state.searchParams = action.meta.arg;
    });

    builder.addCase(SearchActions.loadMoreSearch.fulfilled, (state, action) => {
      if (state.searchResults && action.payload?.data) {
        const newData = action.payload.data;
        // Append videos
        if (newData.videos?.items) {
          state.searchResults.videos.items = [
            ...state.searchResults.videos.items,
            ...newData.videos.items
          ];
          state.searchResults.videos.total = newData.videos.total;
        }
        // Append series
        if (newData.series?.items) {
          state.searchResults.series.items = [
            ...state.searchResults.series.items,
            ...newData.series.items
          ];
          state.searchResults.series.total = newData.series.total;
        }
        // Append groups
        if (newData.groups?.items) {
          state.searchResults.groups.items = [
            ...state.searchResults.groups.items,
            ...newData.groups.items
          ];
          state.searchResults.groups.total = newData.groups.total;
        }
        // Update page
        state.searchResults.page = newData.page;
        state.searchResults.limit = newData.limit;
        // Update search params
        state.searchParams = action.meta.arg;
      }
    });

    builder.addCase(SearchActions.getWordPressPosts.fulfilled, (state, action) => {
      state.wordPressPosts = action.payload || null;
    });

    builder.addCase(SearchActions.loadMoreWordPressPosts.fulfilled, (state, action) => {
      if (state.wordPressPosts && action.payload?.items) {
        state.wordPressPosts.items = [
          ...state.wordPressPosts.items,
          ...action.payload.items
        ];
        state.wordPressPosts.page = action.payload.page;
        state.wordPressPosts.per_page = action.payload.per_page;
        state.wordPressPosts.total = action.payload.total;
        state.wordPressPosts.totalPages = action.payload.totalPages;
        state.wordPressPosts.hasNext = action.payload.hasNext;
      }
    });
  },
});

export const { clearSearchResults, clearSuggestions } = SearchSlice.actions;
export default SearchSlice.reducer;

