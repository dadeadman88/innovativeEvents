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

/**
 * One required-task entry attached to an event. `id` is the backend-issued
 * id used in checkout payloads (e.g. `tasks[]`). `name` is the
 * human-readable label shown in the UI. `id` may be missing when the
 * backend returns the older string-only shape — see `mapTasks`.
 */
export type EventTask = {
  id?: string;
  name: string;
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
  /**
   * GPS coordinates of the event location, when available. The backend
   * may send them as numbers OR as numeric strings — `mapRowToListItem`
   * normalizes both to `number` here. Older events (created before the
   * map picker shipped) may not have coords at all, in which case
   * geofencing checks (check-in / checkout proximity) are skipped.
   */
  latitude?: number;
  longitude?: number;
  /**
   * Display name of the customer who created the event. Read primarily from
   * the nested `user.fullname` field returned by the backend, with several
   * fallbacks for older payload shapes.
   */
  organizerName?: string;
  /** Customer's job title (e.g. "Lead developer"), from the nested `user`. */
  organizerTitle?: string;
  /** Customer's company (e.g. "Al Ghurair"), from the nested `user`. */
  organizerCompany?: string;
  /** Contractor assignments returned by the contractor endpoints. */
  assignedList?: AssignedListItem[];
  /**
   * Required tasks attached to the event. Each entry carries the
   * backend-issued `id` (used in the `event/checkout/add` payload) and the
   * human-readable `name` shown in the UI. Older API shapes that returned
   * plain strings produce entries with no `id`. See `mapTasks`.
   */
  tasks?: EventTask[];
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

/**
 * Parse the `tasks` field on an event row.
 *
 * The backend stores the strings we send up under `tasks[]`, but it can come
 * back in several shapes depending on the endpoint:
 *   - `["Task A", "Task B"]`                                       (no ids)
 *   - `[{ id: "...", task_name: "Clean the hall" }, ...]`          ← current API
 *   - `[{ task: "Task A" }, { title: "Task B" }]`
 *   - mixed
 *
 * We coerce everything to `EventTask[]`, preserving the backend `id` when
 * present (needed for the `event/checkout/add` payload) and dropping
 * entries with no usable label. Returns `undefined` when nothing parses.
 */
function mapTasks(row: Record<string, unknown>): EventTask[] | undefined {
  const raw =
    (row.tasks as unknown) ??
    (row.task_list as unknown) ??
    (row.event_tasks as unknown);
  if (!Array.isArray(raw)) return undefined;

  const items: EventTask[] = [];
  for (const entry of raw) {
    if (entry == null) continue;
    if (typeof entry === "string") {
      const s = entry.trim();
      if (s) items.push({ name: s });
    } else if (typeof entry === "object") {
      const o = entry as Record<string, unknown>;
      const name = strField(
        o,
        "task_name",
        "taskName",
        "task",
        "title",
        "name",
        "label",
        "value",
        "description"
      );
      if (!name) continue;
      const id = strField(o, "id", "task_id", "taskId");
      items.push(id ? { id, name } : { name });
    } else {
      const s = String(entry).trim();
      if (s) items.push({ name: s });
    }
  }
  return items.length ? items : undefined;
}

/**
 * Pull the embedded `user` object off an event row if present.
 *
 * The contractor-side endpoints return the customer who created the event
 * as a nested `user: { first_name, last_name, fullname, company, title,
 * email, mobile_number, ... }` object. Some older endpoints flatten these
 * onto the row itself, so callers should treat this as an OPTIONAL extra
 * source and still read top-level keys first.
 */
function getUserObject(row: Record<string, unknown>): Record<string, unknown> | null {
  const u = row.user;
  if (u && typeof u === "object" && !Array.isArray(u)) {
    return u as Record<string, unknown>;
  }
  return null;
}

/** Build a "First Last" string out of a user object, ignoring blanks. */
function joinName(user: Record<string, unknown> | null): string {
  if (!user) return "";
  const first = strField(user, "first_name", "firstName", "given_name");
  const last = strField(user, "last_name", "lastName", "family_name");
  return [first, last].filter(Boolean).join(" ").trim();
}

function mapRowToListItem(row: Record<string, unknown>, index: number): CustomerEventListItem {
  const id = strField(row, "id", "event_id", "eventId");
  const title =
    strField(row, "event_name", "eventName", "title", "name", "event_title") || "Untitled event";
  const address = strField(row, "address", "event_address", "location", "venue_address") || "—";
  const status = mapEventStatus(row.status ?? row.event_status ?? row.state ?? row.event_status_name);

  const user = getUserObject(row);

  // Prefer top-level fields (older API shape), fall back to nested `user`.
  const organizerName =
    optField(row, "organizer_name", "organizer", "host_name", "user_name") ||
    (user
      ? strField(user, "fullname", "full_name") || joinName(user) || undefined
      : undefined) ||
    optField(row, "fullname");

  const organizerTitle =
    optField(row, "organizer_title", "user_title") ||
    (user ? optField(user, "title", "designation", "role_title") : undefined);

  const organizerCompany =
    optField(row, "organizer_company", "company", "user_company") ||
    (user ? optField(user, "company", "company_name", "organization") : undefined);

  const contactPhone =
    optField(row, "event_phone", "phone", "mobile", "mobile_number") ||
    (user
      ? optField(user, "full_mobile_number", "mobile_number", "phone")
      : undefined);

  const contactEmail =
    optField(row, "event_email", "email") ||
    (user ? optField(user, "email") : undefined);

  // Coordinates can come in as numbers or as numeric strings — accept
  // either, but only keep finite results so downstream callers can rely
  // on `Number.isFinite(latitude)` as the "has coords" check.
  const latRaw = row.latitude ?? row.lat ?? row.event_latitude;
  const lngRaw = row.longitude ?? row.lng ?? row.lon ?? row.event_longitude;
  const latNum =
    typeof latRaw === "number" ? latRaw : latRaw != null ? Number(latRaw) : NaN;
  const lngNum =
    typeof lngRaw === "number" ? lngRaw : lngRaw != null ? Number(lngRaw) : NaN;
  const latitude = Number.isFinite(latNum) ? latNum : undefined;
  const longitude = Number.isFinite(lngNum) ? lngNum : undefined;

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
    contactPhone,
    contactEmail,
    latitude,
    longitude,
    organizerName,
    organizerTitle,
    organizerCompany,
    assignedList: mapAssignedList(row),
    tasks: mapTasks(row),
  };
}

export type CreateEventPayload = {
  event_name: string;
  event_phone: string;
  event_email: string;
  event_staff: string;
  event_service: string;
  address: string;
  /** GPS coordinates of the picked address. Sent only when present. */
  latitude?: number;
  longitude?: number;
  event_date: string;
  event_start_time: string;
  event_end_time: string;
  event_description: string;
  /**
   * Free-form tasks for the event. Sent as `tasks[]` in the body
   * (axios serializes a JS string[] as that array on the wire).
   */
  tasks: string[];
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

  /**
   * Contractor check-in (start of job):
   *   POST event/checkin/add
   *   body: { event_id: "<eventId>", latitude?: number, longitude?: number }
   *
   * `latitude` / `longitude` are forwarded when the caller has a fresh
   * device fix (see `providerEventDetail` -> `handleCheckIn`). They're
   * optional so the thunk also works in environments without GPS, but the
   * backend should treat the coords as proof-of-presence at the job site.
   *
   * Authorization Bearer token is added automatically by the axios request
   * interceptor.
   */
  ContractorCheckin: createAsyncThunk<
    unknown,
    { eventId: string; latitude?: number; longitude?: number },
    { rejectValue: string }
  >("event/contractorCheckin", async (args, { rejectWithValue }) => {
    const eventId = args.eventId?.trim();
    if (!eventId) return rejectWithValue("Missing event id");
    const body: Record<string, unknown> = { event_id: eventId };
    if (typeof args.latitude === "number" && Number.isFinite(args.latitude)) {
      body.latitude = args.latitude;
    }
    if (typeof args.longitude === "number" && Number.isFinite(args.longitude)) {
      body.longitude = args.longitude;
    }
    const { data } = await client.post<unknown>(eventEndpoints.checkinAdd, body);
    return data;
  }),

  /**
   * Contractor check-out (end of job):
   *   POST event/checkout/add
   *   body: {
   *     event_id:    "<eventId>",
   *     description: "Job completed",   ← always sent by the StartJob screen
   *     tasks:       ["<taskId>", ...]  ← backend-issued task ids
   *   }
   *
   * The evidence photo is intentionally NOT sent here — the body stays
   * pure JSON so the Authorization header path in the request interceptor
   * keeps applying. If the backend later accepts a multipart upload, we
   * can add a separate thunk that posts FormData.
   *
   * Authorization Bearer token is added automatically by the axios request
   * interceptor.
   */
  ContractorCheckout: createAsyncThunk<
    unknown,
    {
      eventId: string;
      taskIds: string[];
      description?: string;
    },
    { rejectValue: string }
  >("event/contractorCheckout", async (args, { rejectWithValue }) => {
    const eventId = args.eventId?.trim();
    if (!eventId) return rejectWithValue("Missing event id");

    const taskIds = (args.taskIds ?? [])
      .map((t) => (typeof t === "string" ? t.trim() : ""))
      .filter(Boolean);

    const body: Record<string, unknown> = {
      event_id: eventId,
      description: args.description?.trim() || "Job completed",
      tasks: taskIds,
    };

    const { data } = await client.post<unknown>(eventEndpoints.checkoutAdd, body);
    return data;
  }),

  CreateEvent: createAsyncThunk(
    "event/create",
    async (payload: CreateEventPayload, thunkAPI) => {
      thunkAPI.dispatch(setLoading(true));
      const body: Record<string, unknown> = {
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
        tasks: payload.tasks,
      };
      // Backend expects coordinates as STRINGS (not numbers) — sending
      // numeric values trips a server-side validation error. Stringify
      // here so callers can keep working with proper number types.
      if (typeof payload.latitude === "number" && Number.isFinite(payload.latitude)) {
        body.latitude = String(payload.latitude);
      }
      if (typeof payload.longitude === "number" && Number.isFinite(payload.longitude)) {
        body.longitude = String(payload.longitude);
      }
      const { data } = await client.post<unknown>(eventEndpoints.add, body);
      return data;
    }
  ),
};
