export const baseUrl = "https://ambulance-booking-service-backend.onrender.com";

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add JWT only when we have one
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  // -------------------------------------------------
  // Read response safely
  // -------------------------------------------------

  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // -------------------------------------------------
  // 401 Unauthorized
  // -------------------------------------------------

  if (response.status === 401) {
    // IMPORTANT:
    // Login request with wrong credentials should
    // throw an error instead of redirecting.

    if (endpoint === "/api/login/") {
      throw new Error(data?.detail || "ইমেইল অথবা পাসওয়ার্ড ভুল");
    }

    // For other protected API requests,
    // 401 usually means the JWT is expired/invalid.
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");

    window.location.href = "/login";

    return;
  }

  // -------------------------------------------------
  // Other API errors
  // -------------------------------------------------

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "API ত্রুটি");
  }

  // -------------------------------------------------
  // Success
  // -------------------------------------------------

  return data;
};
