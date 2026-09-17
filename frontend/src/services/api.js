const API_BASE_URL = "http://127.0.0.1:7000/api";

async function apiRequest(endpoint, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  console.log("API request:", endpoint);
  console.log("Has access token:", Boolean(accessToken));

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  console.log("Response status:", response.status);

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    console.log("Has refresh token:", Boolean(refreshToken));

    if (!refreshToken) {
      throw new Error("Authentication required.");
    }

    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    console.log("Refresh status:", refreshResponse.status);

    const refreshData = await refreshResponse.json();

    console.log("Refresh response:", refreshData);

    if (!refreshResponse.ok) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      throw new Error("Session expired. Please login again.");
    }

    localStorage.setItem("accessToken", refreshData.access);

    headers.Authorization = `Bearer ${refreshData.access}`;

    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log("Retry status:", response.status);
  }

if (response.status === 204) {
  return null;
}
  const data = await response.json();
  

  if (!response.ok) {
  let errorMessage = "Something went wrong";

  if (data.detail) {
    errorMessage = data.detail;
  } else if (data.message) {
    errorMessage = data.message;
  } else if (data.non_field_errors) {
    errorMessage = data.non_field_errors.join(", ");
  } else {
    const firstField = Object.keys(data)[0];

    if (firstField) {
      const fieldError = data[firstField];

      if (Array.isArray(fieldError)) {
        errorMessage = fieldError.join(", ");
      } else {
        errorMessage = String(fieldError);
      }
    }
  }

  throw new Error(errorMessage);
}

  return data;
}

export default apiRequest;