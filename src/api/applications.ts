import client from "./client";

export type ApplicationStatus =
  | "WISHLIST"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED";

export type JobType = "ONSITE" | "REMOTE" | "HYBRID";

export interface Application {
  id: number;
  owner: number;
  company: string;
  position: string;
  status: ApplicationStatus;
  job_type: JobType;
  applied_on: string | null;
  expected_salary: number | null;
  job_link: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationPayload {
  company: string;
  position: string;
  status: ApplicationStatus;
  job_type: JobType;
  applied_on: string | null;
  expected_salary: number | null;
  job_link: string;
  notes: string;
}

type OrderingField =
  | "created_at"
  | "applied_on"
  | "expected_salary";

export interface ApplicationQuery {
  status?: ApplicationStatus;
  job_type?: JobType;
  search?: string;
  ordering?: OrderingField | `-${OrderingField}`;
  page?: number;
}

export interface PaginatedApplications {
  count: number;
  next: string | null;
  previous: string | null;
  results: Application[];
}

export interface ApplicationStats {
  total: number;
  wishlist: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
}

export const listApplications = (params?: ApplicationQuery) =>
  client
    .get<PaginatedApplications>("/applications/", { params })
    .then((response) => response.data);

export const getApplication = (id: number | string) =>
  client
    .get<Application>(`/applications/${id}/`)
    .then((response) => response.data);

export const createApplication = (payload: ApplicationPayload) =>
  client
    .post<Application>("/applications/", payload)
    .then((response) => response.data);

export const updateApplication = (
  id: number | string,
  payload: Partial<ApplicationPayload>,
) =>
  client
    .patch<Application>(`/applications/${id}/`, payload)
    .then((response) => response.data);

export const deleteApplication = (id: number | string) =>
  client.delete(`/applications/${id}/`);

export const getStats = () =>
  client
    .get<ApplicationStats>("/stats/")
    .then((response) => response.data);