/**
 * Strongly-typed environment configuration.
 */
export interface Environment {
  /** Whether this is a production build */
  production: boolean;

  /** Base API URL (recommended) - includes /api when applicable */
  apiUrl: string;

  /** Backwards-compatible alias used in some code (optional) */
  apiBaseUrl?: string;
}
