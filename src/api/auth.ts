import client from "./client";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface RegisteredUser {
  id: number;
  username: string;
  email: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

interface AccessTokenResponse {
  access: string;
}

export const register = (payload: RegisterPayload) =>
  client
    .post<RegisteredUser>("/register/", payload)
    .then((response) => response.data);

export const login = (payload: LoginPayload) =>
  client
    .post<TokenPair>("/login/", payload)
    .then((response) => response.data);

export const refreshAccessToken = (refresh: string) =>
  client
    .post<AccessTokenResponse>("/token/refresh/", { refresh })
    .then((response) => response.data);