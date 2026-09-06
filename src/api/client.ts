import axios, { type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("VITE_API_URL is not configured.");
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface AccessTokenResponse {
  access: string;
}

function isApiEnvelope(
  value: unknown,
): value is ApiEnvelope<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    "message" in value &&
    "data" in value
  );
}

const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshRequest: Promise<string> | null = null;

function clearSession() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("username");
}

async function getFreshAccessToken() {
  const refresh = localStorage.getItem("refresh");

  if (!refresh) throw new Error("No refresh token is available.");

  const response = await axios.post<
    ApiEnvelope<AccessTokenResponse> | AccessTokenResponse
  >(`${baseURL}/token/refresh/`, { refresh });
  const payload = isApiEnvelope(response.data)
    ? response.data.data
    : response.data;

  localStorage.setItem("access", payload.access);
  return payload.access;
}

function refreshAccessTokenOnce() {
  if (!refreshRequest) {
    refreshRequest = getFreshAccessToken().finally(() => {
      refreshRequest = null;
    });
  }

  return refreshRequest;
}

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => {
    if (isApiEnvelope(response.data)) {
      response.data = response.data.data;
    }

    return response;
  },
  async (error) => {
    const responseData = error.response?.data;

    if (isApiEnvelope(responseData) && error.response) {
      error.response.data = responseData.data;
    }

    const originalRequest = error.config as RetryableRequest | undefined;
    const requestUrl = originalRequest?.url ?? "";
    const isAuthenticationRequest = [
      "/login/",
      "/register/",
      "/token/refresh/",
    ].some((path) => requestUrl.includes(path));

    if (
      error.response?.status === 401
      && originalRequest
      && !originalRequest._retry
      && !isAuthenticationRequest
      && localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;

      try {
        const access = await refreshAccessTokenOnce();
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return client(originalRequest);
      } catch {
        clearSession();

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401 && isAuthenticationRequest) {
      if (requestUrl.includes("/token/refresh/")) {
        clearSession();
      }
    } else if (error.response?.status === 401) {
      clearSession();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default client;
