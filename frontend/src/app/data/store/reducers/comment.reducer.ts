import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VoteResponse } from "../../models";
import type { Comment } from "../../../models";

interface CommentState {
  byThread: Record<string, Comment[]>;
  loading: Record<string, boolean>;
  saving: boolean;
  saveError: string | null;
}

const initialState: CommentState = {
  byThread: {},
  loading: {},
  saving: false,
  saveError: null,
};

function insertReply(
  comments: Comment[],
  parentId: number,
  reply: Comment,
): Comment[] {
  return comments.map((c) => {
    if (c.id === parentId) {
      return { ...c, replies: [...(c.replies ?? []), reply] };
    }
    if (c.replies?.length) {
      return { ...c, replies: insertReply(c.replies, parentId, reply) };
    }
    return c;
  });
}

function updateVoteInTree(
  comments: Comment[],
  id: number | string,
  result: VoteResponse,
): Comment[] {
  return comments.map((c) => {
    if (String(c.id) === String(id)) {
      return {
        ...c,
        upvotes_count: result.upvotes_count,
        downvotes_count: result.downvotes_count,
      };
    }
    if (c.replies?.length) {
      return { ...c, replies: updateVoteInTree(c.replies, id, result) };
    }
    return c;
  });
}

function updateBodyInTree(
  comments: Comment[],
  id: number,
  updated: Comment,
): Comment[] {
  return comments.map((c) => {
    if (c.id === id) return { ...c, ...updated };
    if (c.replies?.length) {
      return { ...c, replies: updateBodyInTree(c.replies, id, updated) };
    }
    return c;
  });
}

function markDeletedInTree(comments: Comment[], commentId: number): Comment[] {
  return comments.map((c) => {
    if (c.id === commentId) {
      return { ...c, is_deleted: true, body: "[deleted]" };
    }
    if (c.replies?.length) {
      return { ...c, replies: markDeletedInTree(c.replies, commentId) };
    }
    return c;
  });
}

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    fetchCommentsStart(state, action: PayloadAction<string>) {
      state.loading[action.payload] = true;
    },
    fetchCommentsSuccess(
      state,
      action: PayloadAction<{ threadId: string | number; comments: Comment[] }>,
    ) {
      const { threadId, comments } = action.payload;
      state.byThread[threadId] = comments;
      state.loading[threadId] = false;
    },
    fetchCommentsFailure(state, action: PayloadAction<string>) {
      state.loading[action.payload] = false;
    },

    addCommentSuccess(
      state,
      action: PayloadAction<{ threadId: string; comment: Comment }>,
    ) {
      const { threadId, comment } = action.payload;
      const existing = state.byThread[threadId] ?? [];
      state.byThread[threadId] = [...existing, { ...comment, replies: [] }];
      state.saving = false;
    },

    addReplySuccess(
      state,
      action: PayloadAction<{
        threadId: string;
        parentId: number;
        reply: Comment;
      }>,
    ) {
      const { threadId, parentId, reply } = action.payload;

      const existing = state.byThread[threadId] ?? [];
      state.byThread[threadId] = insertReply(existing, parentId, {
        ...reply,
        replies: reply.replies ?? [],
      });
      state.saving = false;
    },

    updateCommentSuccess(
      state,
      action: PayloadAction<{
        threadId: string;
        commentId: number;
        updated: Comment;
      }>,
    ) {
      const { threadId, commentId, updated } = action.payload;
      const existing = state.byThread[threadId] ?? [];
      state.byThread[threadId] = updateBodyInTree(existing, commentId, updated);
      state.saving = false;
    },

    deleteCommentSuccess(
      state,
      action: PayloadAction<{ threadId: string; commentId: number }>,
    ) {
      const { threadId, commentId } = action.payload;
      state.byThread[threadId] = markDeletedInTree(
        state.byThread[threadId] ?? [],
        commentId,
      );
    },

    voteCommentSuccess(
      state,
      action: PayloadAction<{
        threadId: string;
        commentId: number | string;
        result: VoteResponse;
      }>,
    ) {
      const { threadId, commentId, result } = action.payload;
      const existing = state.byThread[threadId] ?? [];
      state.byThread[threadId] = updateVoteInTree(existing, commentId, result);
    },

    savingStart(state) {
      state.saving = true;
      state.saveError = null;
    },
    savingFailure(state, action: PayloadAction<string>) {
      state.saving = false;
      state.saveError = action.payload;
    },
  },
});

export const commentActions = commentSlice.actions;
export default commentSlice.reducer;
