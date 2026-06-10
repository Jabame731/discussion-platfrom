import type { RootState } from "../index";

export const selectCommentsByThread =
  (threadId: string) => (state: RootState) =>
    state.comments.byThread[threadId] ?? [];

export const selectCommentsLoading = (threadId: string) => (state: RootState) =>
  state.comments.loading[threadId] ?? false;

export const selectCommentsSaving = (state: RootState) => state.comments.saving;

export const selectCommentsSaveError = (state: RootState) =>
  state.comments.saveError;
