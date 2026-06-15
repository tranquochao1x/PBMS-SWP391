import { ApiResponse } from "../services/authService"; // Import any shared type if needed, or define here.

/**
 * Utility function to handle fetch responses safely, avoiding JSON parse errors
 * when the server returns empty bodies or plain text.
 */
export async function safeJson<T>(response: Response): Promise<T> {
  try {
    const text = await response.text();
    if (!text || text.trim() === "") {
      return {} as T;
    }
    return JSON.parse(text) as T;
  } catch (e) {
    console.warn("safeJson: failed to parse response body", e);
    return {} as T;
  }
}

/**
 * Centralized authenticated fetch.
 * - Auto-attaches Authorization header from stored token.
 * - If token is expired (caught at getToken), dispatches "session:expired".
 * - If server returns 401, also dispatches "session:expired" and throws.
 * - Merges caller-provided headers with Authorization.
 */
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Import lazily to avoid circular dependency
  const { authService } = await import("../services/authService");
  const token = authService.getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    authService.logout();
    window.dispatchEvent(new Event("session:expired"));
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }

  return response;
}

/**
 * Utility function to handle fetch responses safely, avoiding JSON parse errors
 * when the server returns empty bodies or plain text.
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  let data: any = null;
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch (e) {
      // JSON parse error, ignore and fallback to checking response.ok
      console.warn("JSON parse error despite application/json content-type", e);
    }
  } else {
    try {
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          // It's just plain text
          data = { message: text };
        }
      }
    } catch (e) {
      // Ignore text parse errors
    }
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || response.statusText || "Có lỗi xảy ra khi kết nối máy chủ.";
    throw new Error(errorMsg);
  }

  // Assuming most APIs return wrapped data, but return raw if not
  return data as T;
}
