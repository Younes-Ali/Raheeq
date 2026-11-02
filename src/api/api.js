const API_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export async function apiRequest(payload) {
  if (!API_URL) {
    throw new Error("Google Apps Script URL is not configured");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const result = await response.json();

  if (!result.ok) {
    throw new Error(result.error || "Something went wrong");
  }

  return result.data;
}
