import { createAction } from "@reduxjs/toolkit";
import type {
  CreateProtocolPayload,
  CreateReviewPayload,
  PaginatedResponse,
  Protocol,
  ProtocolListParams,
  Review,
  Thread,
  UpdateProtocolPayload,
} from "../../models";

const ns = "[Protocol]";

// Load list
export const loadProtocolsAttempted = createAction<
  ProtocolListParams | undefined
>(`${ns} Load Attempted`);
export const loadProtocolsSucceeded = createAction<PaginatedResponse<Protocol>>(
  `${ns} Load Succeeded`,
);
export const loadProtocolsFailed = createAction<string>(`${ns} Load Failed`);

// Load single
export const loadProtocolAttempted = createAction<string | number>(
  `${ns} Load One Attempted`,
);
export const loadProtocolSucceeded = createAction<Protocol>(
  `${ns} Load One Succeeded`,
);
export const loadProtocolFailed = createAction<string>(`${ns} Load One Failed`);

// Create
export const createProtocolAttempted = createAction<CreateProtocolPayload>(
  `${ns} Create Attempted`,
);
export const createProtocolSucceeded = createAction<Protocol>(
  `${ns} Create Succeeded`,
);
export const createProtocolFailed = createAction<string>(`${ns} Create Failed`);

// Update
export const updateProtocolAttempted = createAction<{
  id: number;
  payload: UpdateProtocolPayload;
}>(`${ns} Update Attempted`);
export const updateProtocolSucceeded = createAction<Protocol>(
  `${ns} Update Succeeded`,
);
export const updateProtocolFailed = createAction<string>(`${ns} Update Failed`);

// Delete
export const deleteProtocolAttempted = createAction<number>(
  `${ns} Delete Attempted`,
);
export const deleteProtocolSucceeded = createAction<number>(
  `${ns} Delete Succeeded`,
);
export const deleteProtocolFailed = createAction<string>(`${ns} Delete Failed`);

// Reviews
export const loadReviewsAttempted = createAction<number | string>(
  `${ns} Load Reviews Attempted`,
);
export const loadReviewsSucceeded = createAction<{
  protocolId: number | string;
  reviews: PaginatedResponse<Review>;
}>(`${ns} Load Reviews Succeeded`);
export const loadReviewsFailed = createAction<string>(
  `${ns} Load Reviews Failed`,
);

export const createReviewAttempted = createAction<{
  protocolId: number | string;
  payload: CreateReviewPayload;
}>(`${ns} Create Review Attempted`);
export const createReviewSucceeded = createAction<{
  protocolId: number | string;
  review: Review;
}>(`${ns} Create Review Succeeded`);
export const createReviewFailed = createAction<string>(
  `${ns} Create Review Failed`,
);

// Protocol threads
export const loadProtocolThreadsAttempted = createAction<number | string>(
  `${ns} Load Threads Attempted`,
);
export const loadProtocolThreadsSucceeded = createAction<{
  protocolId: number | string;
  threads: PaginatedResponse<Thread>;
}>(`${ns} Load Threads Succeeded`);
export const loadProtocolThreadsFailed = createAction<string>(
  `${ns} Load Threads Failed`,
);
