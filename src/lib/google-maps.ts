const GOOGLE_MAPS_SEARCH_URL = "https://www.google.com/maps/search/";
const GOOGLE_MAPS_DIRECTIONS_URL = "https://www.google.com/maps/dir/";

interface GoogleMapsPoint {
  readonly latitude: number;
  readonly longitude: number;
}

function serializePoint(point: GoogleMapsPoint): string {
  if (
    !Number.isFinite(point.latitude) ||
    !Number.isFinite(point.longitude) ||
    point.latitude < -90 ||
    point.latitude > 90 ||
    point.longitude < -180 ||
    point.longitude > 180
  ) {
    throw new RangeError("Google Maps point must contain valid coordinates");
  }

  return `${point.latitude},${point.longitude}`;
}

export function buildGoogleMapsSearchUrl(query: string): string {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    throw new RangeError("Google Maps search query cannot be empty");
  }

  const parameters = new URLSearchParams({
    api: "1",
    query: normalizedQuery,
  });

  return `${GOOGLE_MAPS_SEARCH_URL}?${parameters.toString()}`;
}

export function buildGoogleMapsDirectionsUrl(
  points: readonly GoogleMapsPoint[],
): string {
  if (points.length < 2) {
    throw new RangeError("Google Maps directions require at least two points");
  }

  const origin = points[0];
  const destination = points.at(-1);

  if (!origin || !destination) {
    throw new RangeError("Google Maps directions require an origin and destination");
  }

  const parameters = new URLSearchParams({
    api: "1",
    origin: serializePoint(origin),
    destination: serializePoint(destination),
    travelmode: "walking",
  });
  const waypoints = points.slice(1, -1).map(serializePoint);

  if (waypoints.length > 0) parameters.set("waypoints", waypoints.join("|"));

  return `${GOOGLE_MAPS_DIRECTIONS_URL}?${parameters.toString()}`;
}
