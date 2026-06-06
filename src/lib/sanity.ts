import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-07";

export const isSanityConfigured = Boolean(projectId);

// Initialize client only if projectId is present
export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

if (!isSanityConfigured) {
  if (typeof window === "undefined") {
    console.warn(
      "Sanity NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is missing. Sanity CMS integration will fall back to local static catalog data."
    );
  }
}

/**
 * Safe fetch function that queries Sanity and handles missing config or failures gracefully.
 */
export async function safeSanityFetch<T>(query: string, params: Record<string, any> = {}): Promise<T | null> {
  if (!isSanityConfigured || !sanityClient) {
    return null;
  }
  try {
    const data = await sanityClient.fetch<T>(query, params);
    return data;
  } catch (error) {
    console.error("Sanity API fetch error:", error);
    return null;
  }
}
