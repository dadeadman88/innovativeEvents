/**
 * Maps API `role` values to app main routes.
 * Extend as backend adds roles.
 */
export function getMainRouteForRole(role: string | undefined | null): string {
  const r = (role ?? "").toLowerCase();
  if (r === "contractor" || r === "provider" || r === "brand_ambassador") {
    return "/(main)/(provider)/(tabs)/home";
  }
  return "/(main)/(customer)/(tabs)/home";
}
