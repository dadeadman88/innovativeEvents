import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerEventListItem } from "../actions/EventActions";

/**
 * Caches the latest fetched events by id so the detail screen always reads
 * the freshest `assigned_list` (and other fields) from a single source of
 * truth, instead of relying on a snapshot stuffed into URL params.
 */
type EventState = {
  byId: Record<string, CustomerEventListItem>;
};

const initialState: EventState = {
  byId: {},
};

const EventSlice = createSlice({
  name: "Event",
  initialState,
  reducers: {
    upsertEvents(state, action: PayloadAction<CustomerEventListItem[]>) {
      for (const evt of action.payload) {
        if (!evt?.id) continue;
        state.byId[evt.id] = evt;
      }
    },
    clearEvents(state) {
      state.byId = {};
    },
  },
});

export const { upsertEvents, clearEvents } = EventSlice.actions;
export default EventSlice.reducer;
