/**
 * Sanitizes text inputs by stripping HTML tags and trimming whitespace.
 * For general text inputs (usernames, names, countries, etc.).
 */
export function sanitizeText(val: string): string {
  if (typeof val !== "string") return val;
  return val
    .replace(/<[^>]*>/g, "") // Strip HTML tags entirely
    .trim();
}

/**
 * Sanitizes alphanumeric inputs to permit only letters, numbers, and basic spaces/hyphens.
 * Excellent for usernames, reference codes, phone numbers, pins, etc.
 */
export function sanitizeAlphanumeric(val: string): string {
  if (typeof val !== "string") return val;
  return val
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[^\w\s-]/gi, "") // Keep alphanumeric, spaces, underscores, hyphens
    .trim();
}

/**
 * Validates and cleans email addresses to prevent injection attacks.
 */
export function sanitizeEmail(val: string): string {
  if (typeof val !== "string") return val;
  return val
    .replace(/[^a-zA-Z0-9@._+-]/g, "") // Keep only valid email characters
    .trim();
}
