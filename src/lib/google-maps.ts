const GOOGLE_MAPS_SEARCH_URL = "https://www.google.com/maps/search/";

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
