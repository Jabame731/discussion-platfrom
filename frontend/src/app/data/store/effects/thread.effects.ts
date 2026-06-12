import { createAsyncThunk } from "@reduxjs/toolkit";
import { commentActions, threadActions, type ThunkApi } from "../index";
import type {
  CreateThreadPayload,
  Thread,
  ThreadListParams,
  UpdateThreadPayload,
  VoteResponse,
} from "../../models";
import type { Comment } from "../../../models";

export const fetchThreads = createAsyncThunk<
  void,
  ThreadListParams | undefined,
  ThunkApi
>("threads/fetchAll", async (params, { dispatch, extra }) => {
  dispatch(threadActions.fetchThreadsStart());
  try {
    const result = await extra.threadRepository.getThreads(params);
    dispatch(
      threadActions.fetchThreadsSuccess({
        items: result.data,
        meta: result.meta,
      }),
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load threads";
    dispatch(threadActions.fetchThreadsFailure(message));
    throw err;
  }
});

export const fetchThread = createAsyncThunk<void, string | number, ThunkApi>(
  "threads/fetchOne",
  async (id, { dispatch, extra }) => {
    dispatch(threadActions.fetchThreadStart());
    try {
      const thread = await extra.threadRepository.getThread(id);
      dispatch(threadActions.fetchThreadSuccess(thread));
      dispatch(
        commentActions.fetchCommentsSuccess({
          threadId: id,
          comments: thread.root_comments as Comment[],
        }),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load thread";
      dispatch(threadActions.fetchThreadFailure(message));
      throw err;
    }
  },
);

export const createThread = createAsyncThunk<
  Thread | undefined,
  CreateThreadPayload,
  ThunkApi
>("threads/create", async (payload, { dispatch, extra }) => {
  dispatch(threadActions.saveThreadStart());
  try {
    const thread = await extra.threadRepository.createThread(payload);
    dispatch(threadActions.createThreadSuccess(thread));
    return thread;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create thread";
    dispatch(threadActions.saveThreadFailure(message));
    throw err;
  }
});

export const updateThread = createAsyncThunk<
  Thread | undefined,
  { slug: string; payload: UpdateThreadPayload },
  ThunkApi
>("threads/update", async ({ slug, payload }, { dispatch, extra }) => {
  dispatch(threadActions.saveThreadStart());
  try {
    const thread = await extra.threadRepository.updateThread(slug, payload);
    dispatch(threadActions.updateThreadSuccess(thread));
    return thread;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update thread";
    dispatch(threadActions.saveThreadFailure(message));
    throw err;
  }
});

export const deleteThread = createAsyncThunk<
  void,
  {
    id: number;
    slug: string;
  },
  ThunkApi
>("threads/delete", async ({ id, slug }, { dispatch, extra }) => {
  dispatch(threadActions.saveThreadStart());
  try {
    await extra.threadRepository.deleteThread(slug);
    dispatch(threadActions.deleteThreadSuccess(id));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete thread";
    dispatch(threadActions.saveThreadFailure(message));
    throw err;
  }
});

export const voteThread = createAsyncThunk<
  VoteResponse | undefined,
  { id: number | string; voteType: "upvote" | "downvote" },
  ThunkApi
>("threads/vote", async ({ id, voteType }, { dispatch, extra }) => {
  try {
    const result = await extra.threadRepository.voteThread(id, voteType);
    dispatch(threadActions.voteThreadSuccess({ id, result }));
    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to vote";
    dispatch(threadActions.saveThreadFailure(message));
    throw err;
  }
});
