import { createSlice } from '@reduxjs/toolkit';
import { LibraryActions } from '../actions/LibraryActions';

interface LibraryState {
  libraryHome: any | null;
  bookmarks: any | null;
  history: any | null;
  downloads: any | null;
}

const initialState: LibraryState = {
  libraryHome: null,
  bookmarks: null,
  history: null,
  downloads: null,
};

const LibrarySlice = createSlice({
  name: 'Library',
  initialState,
  reducers: {
    clearLibrary: (state) => {
      state.libraryHome = null;
      state.bookmarks = null;
      state.history = null;
      state.downloads = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LibraryActions.getLibraryHome.fulfilled, (state, action) => {
      state.libraryHome = action.payload?.data || action.payload;
    });

    builder.addCase(LibraryActions.getBookmarks.fulfilled, (state, action) => {
      const bookmarksData = action.payload?.data || action.payload;
      const meta = action.payload?.meta || bookmarksData?.meta || {};
      
      if (bookmarksData?.page === 1 || action.payload?.page === 1 || !state.bookmarks) {
        state.bookmarks = {
          items: bookmarksData?.items || bookmarksData?.data || [],
          data: bookmarksData?.items || bookmarksData?.data || [],
          page: meta.page || bookmarksData?.page || 1,
          limit: meta.limit || bookmarksData?.limit || 20,
          total: meta.total || bookmarksData?.total || 0,
          hasNext: meta.hasNext !== undefined ? meta.hasNext : bookmarksData?.hasNext !== undefined ? bookmarksData.hasNext : true,
        };
      }
    });

    builder.addCase(LibraryActions.loadMoreBookmarks.fulfilled, (state, action) => {
      const bookmarksData = action.payload?.data || action.payload;
      const meta = action.payload?.meta || bookmarksData?.meta || {};
      const newItems = bookmarksData?.items || bookmarksData?.data || [];
      
      if (state.bookmarks && Array.isArray(newItems)) {
        const currentItems = state.bookmarks?.items || state.bookmarks?.data || [];
        state.bookmarks = {
          ...state.bookmarks,
          items: [...currentItems, ...newItems],
          data: [...currentItems, ...newItems],
          page: meta.page || bookmarksData?.page || state.bookmarks.page,
          limit: meta.limit || bookmarksData?.limit || state.bookmarks.limit,
          total: meta.total || bookmarksData?.total || state.bookmarks.total,
          hasNext: meta.hasNext !== undefined ? meta.hasNext : bookmarksData?.hasNext !== undefined ? bookmarksData.hasNext : false,
        };
      }
    });

    builder.addCase(LibraryActions.getHistory.fulfilled, (state, action) => {
      console.warn("LibrarySlice - getHistory.fulfilled");
      console.warn("Action payload:", JSON.stringify(action.payload, null, 2));
      state.history = action.payload?.data || action.payload;
    });

    builder.addCase(LibraryActions.loadMoreHistory.fulfilled, (state, action) => {
      const historyData = action.payload?.data || [];
      const meta = action.payload?.meta || {};
      
      if (state.history && Array.isArray(historyData)) {
        const currentItems = state.history?.items || state.history?.data || [];
        state.history = {
          ...state.history,
          items: [...currentItems, ...historyData],
          data: [...currentItems, ...historyData],
          page: meta.page || state.history.page,
          limit: meta.limit || state.history.limit,
          total: meta.total || state.history.total,
          hasNext: meta.hasNext,
        };
      }
    });

    builder.addCase(LibraryActions.getDownloads.fulfilled, (state, action) => {
      if (action.payload?.data?.page === 1 || action.payload?.page === 1) {
        state.downloads = action.payload?.data || action.payload;
      } else {
        const currentData = state.downloads?.data || state.downloads?.items || [];
        const newData = action.payload?.data?.data || action.payload?.data?.items || action.payload?.items || [];
        state.downloads = {
          ...(action.payload?.data || action.payload),
          data: [...currentData, ...newData],
          items: [...currentData, ...newData],
        };
      }
    });
  },
});

export const { clearLibrary } = LibrarySlice.actions;
export default LibrarySlice.reducer;

