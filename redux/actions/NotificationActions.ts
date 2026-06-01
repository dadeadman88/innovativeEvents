import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../utils/AxiosInterceptor";
import { notificationEndpoints } from "../../utils/Endpoints";

/**
 * One row in the notifications list, normalized for the UI. The backend
 * returns a richer `from_details` object (account fields for the user
 * who triggered the notification); we project just the parts we render.
 *
 * `createdAtIso` is the parsed `created_date` re-serialized as a real
 * ISO string. The backend sends it as UTC (`YYYY-MM-DD` or
 * `YYYY-MM-DD HH:MM:SS` without a TZ suffix), and `parseCreatedDateUTC`
 * forces UTC interpretation so JS doesn't accidentally read it as local.
 */
export type Notification = {
  id: string;
  title: string;
  message: string;
  /** UTC ISO string. May be empty if the backend didn't send one. */
  createdAtIso: string;
  from?: {
    firstName?: string;
    lastName?: string;
    fullname?: string;
    email?: string;
  };
};

/**
 * Pull the notification rows array out of whatever envelope the backend
 * returned. The current `notification/all` response wraps the array in
 * `{ response: { data: [...] } }`, but we also accept a few common
 * fallbacks so this stays resilient if the shape shifts.
 */
function extractNotificationsArray(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === "object") {
    const top = data as Record<string, unknown>;
    const candidates = [top.response, top.data, top.notifications, top.result];
    for (const c of candidates) {
      if (Array.isArray(c)) return c as Record<string, unknown>[];
      if (c && typeof c === "object") {
        const inner = (c as Record<string, unknown>).data;
        if (Array.isArray(inner)) return inner as Record<string, unknown>[];
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

function optField(row: Record<string, unknown>, ...keys: string[]): string | undefined {
  const s = strField(row, ...keys);
  return s || undefined;
}

/**
 * Parse a `created_date` string (or any "datetime-ish" string) and return
 * a real `Date` in **UTC**.
 *
 * The backend sends timestamps WITHOUT a timezone suffix (e.g.
 * `"2026-05-25"` or `"2026-05-25 17:28:16"`). JavaScript's `new Date()`
 * parses those formats inconsistently across platforms — sometimes as
 * local time on Android — so we explicitly normalize to ISO with a `Z`
 * suffix to force UTC interpretation. ISO inputs that already carry a
 * timezone offset are passed through unchanged.
 */
function parseCreatedDateUTC(raw?: string | null): Date | null {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;

  // YYYY-MM-DD[ T]HH:MM:SS[.fff][Z|±HH:MM]
  const dt =
    /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/.exec(
      trimmed
    );
  if (dt) {
    const tz = dt[3] ?? "Z"; // assume UTC if backend didn't say otherwise
    const iso = `${dt[1]}T${dt[2]}${tz}`;
    const d = new Date(iso);
    return Number.isFinite(d.getTime()) ? d : null;
  }

  // Date-only (YYYY-MM-DD) — pin to UTC midnight.
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const d = new Date(`${trimmed}T00:00:00Z`);
    return Number.isFinite(d.getTime()) ? d : null;
  }

  // Fallback: trust the platform parser.
  const d = new Date(trimmed);
  return Number.isFinite(d.getTime()) ? d : null;
}

/** Map a raw row object into the normalized `Notification` shape. */
function mapRowToNotification(
  row: Record<string, unknown>,
  index: number
): Notification {
  const id =
    strField(row, "id", "notification_id", "notificationId") ||
    `notification-${index}`;
  const title = strField(row, "title", "notification_title") || "Notification";
  const message = strField(
    row,
    "message",
    "body",
    "notification_message",
    "description"
  );

  const fromRaw = row.from_details ?? row.fromDetails ?? row.from;
  let from: Notification["from"] | undefined;
  if (fromRaw && typeof fromRaw === "object" && !Array.isArray(fromRaw)) {
    const f = fromRaw as Record<string, unknown>;
    const firstName = optField(f, "first_name", "firstName");
    const lastName = optField(f, "last_name", "lastName");
    const fullname = optField(f, "fullname", "full_name");
    const email = optField(f, "email");
    if (firstName || lastName || fullname || email) {
      from = { firstName, lastName, fullname, email };
    }
  }

  const createdRaw = strField(
    row,
    "created_date",
    "createdDate",
    "created_at",
    "createdAt"
  );
  const createdDate = parseCreatedDateUTC(createdRaw);
  const createdAtIso = createdDate ? createdDate.toISOString() : "";

  return { id, title, message, createdAtIso, from };
}

/**
 * Notification thunks. The Authorization Bearer token is added
 * automatically by the axios request interceptor.
 */
export const NotificationActions = {
  /**
   * GET notification/all
   *
   * Returns a flat list of `Notification`s ordered as the backend sent
   * them (typically newest-first). Grouping into Today / Earlier is the
   * caller's job — see `notifications.tsx`.
   */
  FetchNotifications: createAsyncThunk<
    Notification[],
    void,
    { rejectValue: string }
  >("notification/fetchAll", async (_args, { rejectWithValue }) => {
    try {
      const { data } = await client.get<unknown>(notificationEndpoints.all);
      console.log(
        "[Notifications] raw response:",
        JSON.stringify(data, null, 2)
      );
      const rows = extractNotificationsArray(data);
      return rows.map(mapRowToNotification);
    } catch (err) {
      console.log("[Notifications] failed", err);
      return rejectWithValue("Failed to load notifications");
    }
  }),
};
