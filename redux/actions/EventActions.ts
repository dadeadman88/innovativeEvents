import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../utils/AxiosInterceptor";
import { eventEndpoints } from "../../utils/Endpoints";
import { setLoading } from "../slices/OtherSlice";

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

/** GET event/all — home calendar: `?date=YYYY-MM-DD` only (no input_id) */
export type FetchEventsByDateParams = {
  date: string;
};

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

  /** Home timeline: GET event/all?date=… */
  FetchEventsByDate: createAsyncThunk(
    "event/fetchByDate",
    async (args: FetchEventsByDateParams, thunkAPI) => {
      const d = args.date?.trim();
      if (!d) {
        return thunkAPI.rejectWithValue("Missing date");
      }
      const { data } = await client.get<unknown>(eventEndpoints.all, {
        params: { date: d },
      });
      const rows = extractEventsArray(data);
      return rows.map(mapRowToListItem);
    }
  ),

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
