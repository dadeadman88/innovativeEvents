import { Series, SeriesDetail, SeriesHomeResponse, VideoDetail } from '@/utils/types';
import { createSlice } from '@reduxjs/toolkit';
import { SeriesActions } from '../actions/SeriesActions';
import { SmallGroupsActions } from '../actions/SmallGroupsActions';
import { VideosActions } from '../actions/VideosActions';

interface ContentState {
  // Series
  seriesHome: SeriesHomeResponse | null;
  seriesList: Series[];
  seriesDetail: SeriesDetail | null;
  seriesProgress: any | null;
  
  // Videos
  featuredVideos: any[];
  exploreVideos: {
    items: any[];
    page: number;
    limit: number;
    total: number;
  } | null;
  videoDetail: VideoDetail | null;
  videoPlayback: any | null;
  
  // Small Groups
  smallGroupsHome: any | null;
  featuredSmallGroups: any[];
  exploreSmallGroups: {
    items: any[];
    page: number;
    limit: number;
    total: number;
  } | null;
  smallGroupsList: any[];
  smallGroupDetail: any | null;
  relatedSmallGroups: any[];
}

const initialState: ContentState = {
  seriesHome: null,
  seriesList: [],
  seriesDetail: null,
  seriesProgress: null,
  featuredVideos: [],
  exploreVideos: null,
  videoDetail: null,
  videoPlayback: null,
  smallGroupsHome: null,
  featuredSmallGroups: [],
  exploreSmallGroups: null,
  smallGroupsList: [],
  smallGroupDetail: null,
  relatedSmallGroups: [],
};

const ContentSlice = createSlice({
  name: 'Content',
  initialState,
  reducers: {
    clearSeriesDetail: (state) => {
      state.seriesDetail = null;
    },
    clearVideoDetail: (state) => {
      state.videoDetail = null;
    },
    clearSmallGroupDetail: (state) => {
      state.smallGroupDetail = null;
    },
  },
  extraReducers: (builder) => {
    // Series
    builder.addCase(SeriesActions.getSeriesHome.fulfilled, (state, action) => {
      state.seriesHome = action.payload?.data || action.payload;
    });

    builder.addCase(SeriesActions.loadMoreSeries.fulfilled, (state, action) => {
      const newData = action.payload?.data || action.payload;
      if (state.seriesHome && newData?.explore?.data) {
        state.seriesHome.explore.data = [
          ...state.seriesHome.explore.data,
          ...newData.explore.data
        ];
        state.seriesHome.explore.page = newData.explore.page;
        state.seriesHome.explore.total = newData.explore.total;
        state.seriesHome.explore.limit = newData.explore.limit;
      }
    });

    builder.addCase(SeriesActions.getSeriesList.fulfilled, (state, action) => {
      state.seriesList = action.payload?.data || action.payload;
    });

    builder.addCase(SeriesActions.getSeriesDetail.fulfilled, (state, action) => {
      state.seriesDetail = action.payload?.data || action.payload;
    });

    builder.addCase(SeriesActions.getSeriesProgress.fulfilled, (state, action) => {
      state.seriesProgress = action.payload?.data || action.payload;
    });

    // Videos
    builder.addCase(VideosActions.getFeaturedVideos.fulfilled, (state, action) => {
      state.featuredVideos = action.payload?.data?.items || action.payload?.data || action.payload;
    });

    builder.addCase(VideosActions.getExploreVideos.fulfilled, (state, action) => {
      const responseData = action.payload?.data || action.payload;
      state.exploreVideos = {
        items: responseData?.items || [],
        page: responseData?.page || 1,
        limit: responseData?.limit || 12,
        total: responseData?.total || 0,
      };
    });

    builder.addCase(VideosActions.loadMoreExploreVideos.fulfilled, (state, action) => {
      const responseData = action.payload?.data || action.payload;
      if (state.exploreVideos && responseData?.items) {
        state.exploreVideos.items = [
          ...state.exploreVideos.items,
          ...responseData.items
        ];
        state.exploreVideos.page = responseData.page;
        state.exploreVideos.limit = responseData.limit;
        state.exploreVideos.total = responseData.total;
      }
    });

    builder.addCase(VideosActions.getVideoDetail.fulfilled, (state, action) => {
      state.videoDetail = action.payload?.data || action.payload;
    });

    builder.addCase(VideosActions.getVideoPlayback.fulfilled, (state, action) => {
      state.videoPlayback = action.payload?.data || action.payload;
    });

    // Small Groups
    builder.addCase(SmallGroupsActions.getSmallGroupsHome.fulfilled, (state, action) => {
      state.smallGroupsHome = action.payload?.data || action.payload;
    });

    builder.addCase(SmallGroupsActions.getFeaturedSmallGroups.fulfilled, (state, action) => {
      const responseData = action.payload?.data || action.payload;
      state.featuredSmallGroups = responseData?.data || responseData?.items || [];
    });

    builder.addCase(SmallGroupsActions.getExploreSmallGroups.fulfilled, (state, action) => {
      const responseData = action.payload?.data || action.payload;
      state.exploreSmallGroups = {
        items: responseData?.data || [],
        page: responseData?.page || 1,
        limit: responseData?.limit || 12,
        total: responseData?.total || 0,
      };
    });

    builder.addCase(SmallGroupsActions.loadMoreExploreSmallGroups.fulfilled, (state, action) => {
      const responseData = action.payload?.data || action.payload;
      if (state.exploreSmallGroups && responseData?.data) {
        state.exploreSmallGroups.items = [
          ...state.exploreSmallGroups.items,
          ...responseData.data
        ];
        state.exploreSmallGroups.page = responseData.page;
        state.exploreSmallGroups.limit = responseData.limit;
        state.exploreSmallGroups.total = responseData.total;
      }
    });

    builder.addCase(SmallGroupsActions.getSmallGroupsList.fulfilled, (state, action) => {
      state.smallGroupsList = action.payload?.data || action.payload;
    });

    builder.addCase(SmallGroupsActions.getSmallGroupDetail.fulfilled, (state, action) => {
      state.smallGroupDetail = action.payload?.data || action.payload;
    });

    builder.addCase(SmallGroupsActions.getRelatedSmallGroups.fulfilled, (state, action) => {
      state.relatedSmallGroups = action.payload?.data || action.payload;
    });
  },
});

export const { clearSeriesDetail, clearVideoDetail, clearSmallGroupDetail } = ContentSlice.actions;
export default ContentSlice.reducer;

