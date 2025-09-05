// Prefer same-origin paths via Next.js rewrites to avoid CORS.
export const API_BASE_PATH = "/v1";
export const AUTH_SIGNED_PATH = "/auth/signed";

// Optional absolute URL fallback (avoid using in browser fetch directly).
// export const API_BASE_URL = "https://fxrate-api.sunyz.net/v1";
// export const API_ORIGIN = new URL(API_BASE_URL).origin;
