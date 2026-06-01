import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * A single location pick (address + GPS coordinates) committed by the
 * user from the `chooseLocation` screen. Stored at the slice level so
 * the screen that requested the pick (e.g. `createEvent`) can read it
 * back on focus, even though `router.back()` doesn't carry params.
 */
export type PickedLocation = {
  address: string;
  latitude: number;
  longitude: number;
};

/**
 * `pickToken` increments every time a pick is committed. Consumers
 * remember the token they last applied and reapply only when it changes,
 * so re-rendering the same picked address doesn't re-trigger work.
 */
type LocationState = {
  picked: PickedLocation | null;
  pickToken: number;
};

const initialState: LocationState = {
  picked: null,
  pickToken: 0,
};

const LocationSlice = createSlice({
  name: "Location",
  initialState,
  reducers: {
    setPickedLocation(state, action: PayloadAction<PickedLocation>) {
      state.picked = action.payload;
      state.pickToken += 1;
    },
    clearPickedLocation(state) {
      state.picked = null;
    },
  },
});

export const { setPickedLocation, clearPickedLocation } = LocationSlice.actions;
export default LocationSlice.reducer;
