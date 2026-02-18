/**
 * Server-side geocoding utility using OpenStreetMap Nominatim API.
 * Free for low-volume use. No API key required.
 */

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function getCoordinates(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const encoded = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        // Nominatim requires a User-Agent header identifying your app
        "User-Agent": "Metallyx/1.0 (metallyx.com)",
      },
      // Cache for 1 hour — same city will not re-fetch
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const results: NominatimResult[] = await response.json();

    if (!results || results.length === 0) return null;

    return {
      lat: parseFloat(results[0].lat),
      lng: parseFloat(results[0].lon),
    };
  } catch {
    // Geocoding is non-critical — fail silently
    return null;
  }
}
