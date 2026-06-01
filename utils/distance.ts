/**
 * Great-circle distance (meters) between two GPS points using the
 * Haversine formula.
 *
 * Mean Earth radius is used (6 371 000 m) — accurate to roughly ±0.5%
 * versus the actual ellipsoid, which is more than enough for the kind
 * of "are you within ~100 m of the event?" geofencing we use this for.
 */
export function distanceMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

/**
 * Maximum acceptable distance (meters) between the contractor's device
 * and the event's pinned location, used to gate check-in and check-out.
 * Exposed as a constant so the same threshold powers both screens and
 * the toast copy that surfaces to the user.
 */
export const CHECKIN_RADIUS_METERS = 100;
