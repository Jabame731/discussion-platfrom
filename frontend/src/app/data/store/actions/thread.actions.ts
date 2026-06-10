import { createAction } from "@reduxjs/toolkit";
import type {
  CreateThreadPayload,
  PaginatedResponse,
  Thread,
  ThreadListParams,
  UpdateThreadPayload,
  VoteResponse,
} from "../../models";

const ns = "[Thread]";

export const loadThreadsAttempted = createAction<ThreadListParams | undefined>(
  `${ns} Load Attempted`,
);
export const loadThreadsSucceeded = createAction<PaginatedResponse<Thread>>(
  `${ns} Load Succeeded`,
);
export const loadThreadsFailed = createAction<string>(`${ns} Load Failed`);

export const loadThreadAttempted = createAction<string | number>(
  `${ns} Load One Attempted`,
);
export const loadThreadSucceeded = createAction<Thread>(
  `${ns} Load One Succeeded`,
);
export const loadThreadFailed = createAction<string>(`${ns} Load One Failed`);

export const createThreadAttempted = createAction<CreateThreadPayload>(
  `${ns} Create Attempted`,
);
export const createThreadSucceeded = createAction<Thread>(
  `${ns} Create Succeeded`,
);
export const createThreadFailed = createAction<string>(`${ns} Create Failed`);

export const updateThreadAttempted = createAction<{
  id: number;
  payload: UpdateThreadPayload;
}>(`${ns} Update Attempted`);
export const updateThreadSucceeded = createAction<Thread>(
  `${ns} Update Succeeded`,
);
export const updateThreadFailed = createAction<string>(`${ns} Update Failed`);

export const deleteThreadAttempted = createAction<number>(
  `${ns} Delete Attempted`,
);
export const deleteThreadSucceeded = createAction<number>(
  `${ns} Delete Succeeded`,
);
export const deleteThreadFailed = createAction<string>(`${ns} Delete Failed`);

export const voteThreadAttempted = createAction<{
  id: number | string;
  voteType: "upvote" | "downvote";
}>(`${ns} Vote Attempted`);
export const voteThreadSucceeded = createAction<{
  id: number | string;
  result: VoteResponse;
}>(`${ns} Vote Succeeded`);
export const voteThreadFailed = createAction<string>(`${ns} Vote Failed`);
