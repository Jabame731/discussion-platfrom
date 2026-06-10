import { createAction } from "@reduxjs/toolkit";
import type { CreateCommentPayload, VoteResponse } from "../../models";

const ns = "[Comment]";

export const loadCommentsAttempted = createAction<string | number>(
  `${ns} Load Attempted`,
);

export const loadCommentsSucceeded = createAction<{
  threadId: string | number;
  comments: Comment[];
}>(`${ns} Load Succeeded`);

export const loadCommentsFailed = createAction<string>(`${ns} Load Failed`);

export const createCommentAttempted = createAction<{
  threadId: string | number;
  payload: CreateCommentPayload;
}>(`${ns} Create Attempted`);

export const createCommentSucceeded = createAction<{
  threadId: string | number;
  comment: Comment;
}>(`${ns} Create Succeeded`);

export const createCommentFailed = createAction<string>(`${ns} Create Failed`);

export const deleteCommentAttempted = createAction<number>(
  `${ns} Delete Attempted`,
);
export const deleteCommentSucceeded = createAction<number>(
  `${ns} Delete Succeeded`,
);
export const deleteCommentFailed = createAction<string>(`${ns} Delete Failed`);

export const voteCommentAttempted = createAction<{
  id: number | string;
  voteType: "upvote" | "downvote";
}>(`${ns} Vote Attempted`);

export const voteCommentSucceeded = createAction<{
  id: number | string;
  result: VoteResponse;
}>(`${ns} Vote Succeeded`);
export const voteCommentFailed = createAction<string>(`${ns} Vote Failed`);
