import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerEventListItem } from "../actions/EventActions";

/**
 * Caches the latest fetched events by id so the detail screen always reads
 * the freshest `assigned_list` (and other fields) from a single source of
 * truth, instead of relying on a snapshot stuffed into URL params.
 *
 * `checkInStartedAtById` records the wall-clock timestamp (ms since epoch)
 * of the contractor's FIRST successful check-in for an event. Subsequent
 * check-ins don't reset it, which is what makes the StartJob session timer
 * "resume" — elapsed is just `Date.now() - startedAt`, so it keeps growing
 * naturally even while the StartJob screen is unmounted.
 */
type EventState = {
  byId: Record<string, CustomerEventListItem>;
  checkInStartedAtById: Record<string, number>;
};

const initialState: EventState = {
  byId: {},
  checkInStartedAtById: {},
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
    /**
     * Mark an event's check-in as "started" the first time it succeeds.
     * No-op on subsequent calls so the cumulative session timer survives
     * navigating away and re-entering the StartJob screen.
     */
    startCheckIn(
      state,
      action: PayloadAction<{ eventId: string; at?: number }>
    ) {
      const { eventId, at } = action.payload;
      if (!eventId) return;
      if (state.checkInStartedAtById[eventId] != null) return;
      state.checkInStartedAtById[eventId] = at ?? Date.now();
    },
    resetCheckIn(state, action: PayloadAction<{ eventId: string }>) {
      delete state.checkInStartedAtById[action.payload.eventId];
    },
  },
});

export const { upsertEvents, clearEvents, startCheckIn, resetCheckIn } =
  EventSlice.actions;
export default EventSlice.reducer;
