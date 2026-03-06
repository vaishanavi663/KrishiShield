import { useAppStore } from "../store/useAppStore";

export async function apiFetch(url, options = {}) {
  const lang = useAppStore.getState().language || "en";
  const separator = url.includes("?") ? "&" : "?";

  try {
    const res = await fetch(`${url}${separator}lang=${lang}`, options);

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Non-JSON response received:", text.substring(0, 200));
      throw new Error("API returned non-JSON response. Check server logs.");
    }

    return res.json();
  } catch (error) {
    console.error("apiFetch error:", error);
    throw error;
  }
}