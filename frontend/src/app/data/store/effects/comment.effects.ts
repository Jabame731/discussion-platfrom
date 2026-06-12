import { createAsyncThunk } from "@reduxjs/toolkit";
import { commentActions, threadActions, type ThunkApi } from "../index";
import type { CreateCommentPayload, VoteResponse } from "../../models";
import type { Comment } from "../../../models";

export const fetchComments = createAsyncThunk<void, string | number, ThunkApi>(
  "comments/fetchAll",
  async (threadId, { dispatch, extra }) => {
    const key = String(threadId);
    dispatch(commentActions.fetchCommentsStart(key));
    try {
      const comments = await extra.commentRepository.getComments(threadId);
      dispatch(
        commentActions.fetchCommentsSuccess({ threadId: key, comments }),
      );
    } catch {
      dispatch(commentActions.fetchCommentsFailure(key));
    }
  },
);

export const createComment = createAsyncThunk<
  Comment | undefined,
  {
    threadId: string | number;
    payload: CreateCommentPayload;
    threadSlug: string | number;
  },
  ThunkApi
>(
  "comments/create",
  async ({ threadId, payload, threadSlug }, { dispatch, extra }) => {
    dispatch(commentActions.savingStart());
    try {
      const comment = await extra.commentRepository.createComment(
        threadSlug,
        payload,
      );
      const key = String(threadId);

      if (payload.parent_id) {
        dispatch(
          commentActions.addReplySuccess({
            threadId: key,
            parentId: payload.parent_id,
            reply: comment,
          }),
        );
      } else {
        dispatch(commentActions.addCommentSuccess({ threadId: key, comment }));
        dispatch(threadActions.incrementCommentCount());
      }

      return comment;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to post comment";
      dispatch(commentActions.savingFailure(message));
    }
  },
);

export const updateComment = createAsyncThunk<
  Comment | undefined,
  { threadId: string; commentId: number; body: string },
  ThunkApi
>(
  "comments/update",
  async ({ threadId, commentId, body }, { dispatch, extra }) => {
    dispatch(commentActions.savingStart());
    try {
      const updated = await extra.commentRepository.updateComment(
        commentId,
        body,
      );
      dispatch(
        commentActions.updateCommentSuccess({
          threadId,
          commentId,
          updated,
        }),
      );
      return updated;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update comment";
      dispatch(commentActions.savingFailure(message));
    }
  },
);

export const deleteComment = createAsyncThunk<
  void,
  { threadId: string; commentId: number },
  ThunkApi
>("comments/delete", async ({ threadId, commentId }, { dispatch, extra }) => {
  try {
    await extra.commentRepository.deleteComment(commentId);
    dispatch(commentActions.deleteCommentSuccess({ threadId, commentId }));
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete comment";
    dispatch(commentActions.savingFailure(message));
  }
});

export const voteComment = createAsyncThunk<
  VoteResponse | undefined,
  {
    threadId: string;
    commentId: number | string;
    voteType: "upvote" | "downvote";
  },
  ThunkApi
>(
  "comments/vote",
  async ({ threadId, commentId, voteType }, { dispatch, extra }) => {
    try {
      const result = await extra.commentRepository.voteComment(
        commentId,
        voteType,
      );

      dispatch(
        commentActions.voteCommentSuccess({
          threadId,
          commentId,
          result,
        }),
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to vote";
      dispatch(commentActions.savingFailure(message));
    }
  },
);
