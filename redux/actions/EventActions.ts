import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../utils/AxiosInterceptor";
import { eventEndpoints } from "../../utils/Endpoints";
import type { RootState } from "../store";
import { upsertEvents } from "../slices/EventSlice";
import { setLoading } from "../slices/OtherSlice";

/**
 * One contractor assignment row inside `assigned_list` on an event.
 * `status` is normalized to lowercase ("assigned" | "accepted" | "completed" | …).
 */
export type AssignedListItem = {
  contractorId: string;
  status: string;
};

/** Normalized row for customer “My Events” list + detail (from GET event/all items) */
export type CustomerEventListItem = {
  id: string;
  title: string;
  address: string;
  status: string;
  description?: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  service?: string;
  contactPhone?: string;
  contactEmail?: string;
  /** If API sends a host/company name; otherwise detail falls back to `service` */
  organizerName?: string;
  /** Contractor assignments returned by the contractor endpoints. */
  assignedList?: AssignedListItem[];
};

function extractEventsArray(data: unknown): Record<string, unknown>[] {
  const d = data as Record<string, unknown> | unknown[] | null | undefined;
  if (Array.isArray(d)) return d as Record<string, unknown>[];
  if (d && typeof d === "object") {
    const o = d as Record<string, unknown>;
    const candidates = [o.response, o.data, o.events, o.result];
    for (const c of candidates) {
      if (Array.isArray(c)) return c as Record<string, unknown>[];
      if (c && typeof c === "object" && Array.isArray((c as Record<string, unknown>).data)) {
        return (c as { data: Record<string, unknown>[] }).data;
      }
    }
  }
  return [];
}

function strField(row: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

/** Map API status to short labels used by list badges (Completed / Waiting). */
function mapEventStatus(raw: unknown): string {
  if (raw == null || raw === "") return "Waiting";
  const s = String(raw).trim().toLowerCase().replace(/_/g, " ");
  if (/\b(completed?|done|closed)\b/.test(s)) return "Completed";
  if (/\b(wait|waiting|pending|open|active|progress|new|booked|scheduled)\b/.test(s)) return "Waiting";
  return String(raw).trim();
}

function optField(row: Record<string, unknown>, ...keys: string[]): string | undefined {
  const s = strField(row, ...keys);
  return s || undefined;
}

/**
 * Extract the `assigned_list` array from an event row.
 *
 * Each entry is reduced to `{ contractorId, status }`. We ONLY look at
 * `contractor_id` / `contractorId` (NOT the assignment row's own `id`,
 * `user_id`, etc.) so that matching the current contractor never produces
 * a false positive against an unrelated row identifier.
 *
 * `status` is kept exactly as the backend sends it (no casing normalization);
 * callers should compare case-insensitively.
 */
function mapAssignedList(row: Record<string, unknown>): AssignedListItem[] | undefined {
  const raw =
    (row.assigned_list as unknown) ??
    (row.assignedList as unknown) ??
    (row.assignments as unknown);
  if (!Array.isArray(raw)) return undefined;

  const items: AssignedListItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const o = entry as Record<string, unknown>;
    const contractorId = strField(o, "contractor_id", "contractorId");
    if (!contractorId) continue;
    items.push({
      contractorId,
      status: strField(o, "status", "assignment_status", "state"),
    });
  }
  return items.length ? items : undefined;
}

function mapRowToListItem(row: Record<string, unknown>, index: number): CustomerEventListItem {
  const id = strField(row, "id", "event_id", "eventId");
  const title =
    strField(row, "event_name", "eventName", "title", "name", "event_title") || "Untitled event";
  const address = strField(row, "address", "event_address", "location", "venue_address") || "—";
  const status = mapEventStatus(row.status ?? row.event_status ?? row.state ?? row.event_status_name);
  return {
    id: id || `event-${index}`,
    title,
    address,
    status,
    description: optField(row, "event_description", "description", "details", "about"),
    eventDate: optField(row, "event_date", "eventDate", "date"),
    startTime: optField(row, "event_start_time", "start_time", "startTime"),
    endTime: optField(row, "event_end_time", "end_time", "endTime"),
    service: optField(row, "event_service", "service"),
    contactPhone: optField(row, "event_phone", "phone", "mobile", "mobile_number"),
    contactEmail: optField(row, "event_email", "email"),
    organizerName: optField(
      row,
      "organizer_name",
      "organizer",
      "company",
      "host_name",
      "user_name",
      "fullname"
    ),
    assignedList: mapAssignedList(row),
  };
}

export type CreateEventPayload = {
  event_name: string;
  event_phone: string;
  event_email: string;
  event_staff: string;
  event_service: string;
  address: string;
  event_date: string;
  event_start_time: string;
  event_end_time: string;
  event_description: string;
};

/** GET event/all — my events list: `?input_id=` only (My Events tab) */
export type FetchMyEventsParams = {
  input_id: string;
};

/** GET event/contractor/assigned/all — provider home calendar (Available + Active tabs). */
export type FetchEventsByDateParams = {
  date: string;
};

/**
 * Network helper for the provider home tabs. Both Available Jobs and Active
 * Jobs hit `event/contractor/assigned/all`; only the `is_assigned` flag
 * differs (0 = available to claim, 1 = already assigned).
 *
 * Pre-conditions (validated by callers): `date` is non-empty and `userId`
 * is non-empty. The Authorization Bearer token is attached automatically
 * by the axios request interceptor.
 */
async function fetchAssignedEvents(
  date: string | undefined,
  userId: string,
  isAssigned: 0 | 1,
  logTag: "AvailableJobs" | "ActiveJobs" | "MyEvents"
): Promise<CustomerEventListItem[]> {
  const params: Record<string, string | number> = {
    input_id: userId,
    is_assigned: isAssigned,
  };
  if (date && date.trim()) params.date = date.trim();
  console.log(`[${logTag}] GET`, eventEndpoints.contractorAssignedAll, params);

  const { data } = await client.get<unknown>(eventEndpoints.contractorAssignedAll, {
    params,
  });
  const rows = extractEventsArray(data);
  return rows.map(mapRowToListItem);
}

/**
 * Read the logged-in user's id from redux. `state.auth.user.id` is saved
 * from `loginResponse.response.data.id` via `mapLoginDataToUser`.
 */
function getCurrentUserId(state: RootState): string {
  const raw = state.auth?.user?.id;
  return raw == null ? "" : String(raw).trim();
}

export const EventActions = {
  /** My Events tab: GET event/all?input_id=… */
  FetchMyEvents: createAsyncThunk("event/fetchMy", async (args: FetchMyEventsParams, thunkAPI) => {
    const id = args.input_id?.trim();
    if (!id) {
      return thunkAPI.rejectWithValue("Missing input_id");
    }
    const { data } = await client.get<unknown>(eventEndpoints.all, {
      params: { input_id: id },
    });
    const rows = extractEventsArray(data);
    return rows.map(mapRowToListItem);
  }),

  /**
   * Provider home — Available Jobs tab:
   *   GET event/contractor/assigned/all?input_id=<userId>&date=<YYYY-MM-DD>&is_assigned=0
   *
   * Same endpoint as Active Jobs, just with `is_assigned=0` to list jobs that
   * the contractor can still claim (i.e. not yet assigned to them).
   * The Authorization Bearer token is added automatically by the axios
   * request interceptor.
   */
  FetchEventsByDate: createAsyncThunk<
    CustomerEventListItem[],
    FetchEventsByDateParams,
    { state: RootState; rejectValue: string }
  >("event/fetchByDate", async (args, { getState, dispatch, rejectWithValue }) => {
    const d = args.date?.trim();
    if (!d) return rejectWithValue("Missing date");
    const userId = getCurrentUserId(getState());
    if (!userId) {
      console.log("[AvailableJobs] missing user id in redux");
      return rejectWithValue("Missing user id");
    }
    const list = await fetchAssignedEvents(d, userId, 0, "AvailableJobs");
    dispatch(upsertEvents(list));
    return list;
  }),

  /**
   * Provider My Events list — all jobs the contractor is assigned to,
   * across every date:
   *   GET event/contractor/assigned/all?input_id=<userId>&is_assigned=1
   *
   * Uses the same endpoint as the home Active Jobs tab; the only difference
   * is that no `date` query param is sent, so the backend returns every
   * assigned event (not just today's). Mirrors the result into the redux
   * events slice so the detail screen sees the same fresh `assigned_list`.
   */
  FetchContractorEvents: createAsyncThunk<
    CustomerEventListItem[],
    void,
    { state: RootState; rejectValue: string }
  >("event/fetchContractor", async (_args, { getState, dispatch, rejectWithValue }) => {
    const userId = getCurrentUserId(getState());
    if (!userId) {
      console.log("[MyEvents] missing user id in redux");
      return rejectWithValue("Missing user id");
    }
    const list = await fetchAssignedEvents(undefined, userId, 1, "MyEvents");
    dispatch(upsertEvents(list));
    return list;
  }),

  /**
   * Provider home — Active Jobs tab:
   *   GET event/contractor/assigned/all?input_id=<userId>&date=<YYYY-MM-DD>&is_assigned=1
   *
   * Same endpoint as Available Jobs, just with `is_assigned=1` to list jobs
   * the contractor is already assigned to.
   * `input_id` is the logged-in user's id, saved in redux from
   * `loginResponse.response.data.id` via `mapLoginDataToUser`. The
   * Authorization Bearer token is added automatically by the axios
   * request interceptor.
   */
  FetchContractorEventsByDate: createAsyncThunk<
    CustomerEventListItem[],
    FetchEventsByDateParams,
    { state: RootState; rejectValue: string }
  >("event/fetchContractorByDate", async (args, { getState, dispatch, rejectWithValue }) => {
    const d = args.date?.trim();
    if (!d) return rejectWithValue("Missing date");
    const userId = getCurrentUserId(getState());
    if (!userId) {
      console.log("[ActiveJobs] missing user id in redux");
      return rejectWithValue("Missing user id");
    }
    const list = await fetchAssignedEvents(d, userId, 1, "ActiveJobs");
    dispatch(upsertEvents(list));
    return list;
  }),

  /**
   * Contractor responds to (claims) a job:
   *   POST event/contractor/response   body: { id: "<eventId>" }
   *
   * Authorization Bearer token is added automatically by the axios request
   * interceptor.
   */
  ContractorRespondEvent: createAsyncThunk<
    unknown,
    { id: string },
    { rejectValue: string }
  >("event/contractorRespond", async (args, { rejectWithValue }) => {
    const id = args.id?.trim();
    if (!id) return rejectWithValue("Missing event id");
    const { data } = await client.post<unknown>(eventEndpoints.contractorResponse, { id });
    return data;
  }),

  CreateEvent: createAsyncThunk(
    "event/create",
    async (payload: CreateEventPayload, thunkAPI) => {
      thunkAPI.dispatch(setLoading(true));
      const { data } = await client.post<unknown>(eventEndpoints.add, {
        event_name: payload.event_name,
        event_phone: payload.event_phone,
        event_email: payload.event_email,
        event_staff: payload.event_staff,
        event_service: payload.event_service,
        address: payload.address,
        event_date: payload.event_date,
        event_start_time: payload.event_start_time,
        event_end_time: payload.event_end_time,
        event_description: payload.event_description,
      });
      return data;
    }
  ),
};
