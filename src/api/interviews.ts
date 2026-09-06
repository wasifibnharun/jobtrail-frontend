import client from "./client";

export type InterviewMode = "ONSITE" | "VIDEO" | "PHONE";
export type InterviewResult = "PENDING" | "PASSED" | "FAILED";

export interface Interview {
  id: number;
  application: number;
  position: string;
  company: string;
  round_name: string;
  scheduled_at: string;
  mode: InterviewMode;
  result: InterviewResult;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface InterviewPayload {
  application: number;
  round_name: string;
  scheduled_at: string;
  mode: InterviewMode;
  result: InterviewResult;
  notes: string;
}

export interface PaginatedInterviews {
  count: number;
  next: string | null;
  previous: string | null;
  results: Interview[];
}

export const listApplicationInterviews = (
  applicationId: number | string,
) =>
  client
    .get<PaginatedInterviews>("/interviews/", {
      params: {
        application: applicationId,
        ordering: "scheduled_at",
      },
    })
    .then((response) => response.data);

export const createInterview = (
  payload: InterviewPayload,
) =>
  client
    .post<Interview>("/interviews/", payload)
    .then((response) => response.data);

export const updateInterview = (
  id: number,
  payload: Partial<InterviewPayload>,
) =>
  client
    .patch<Interview>(`/interviews/${id}/`, payload)
    .then((response) => response.data);

export const deleteInterview = (id: number) =>
  client.delete(`/interviews/${id}/`);