import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PaginatedMeta, Thread, VoteResponse } from "../../models";

interface ThreadState {
  items: Thread[];
  meta: Partial<PaginatedMeta>;
  listLoading: boolean;
  listError: string | null;

  current: Thread | null;
  detailLoading: boolean;
  detailError: string | null;

  saving: boolean;
  saveError: string | null;
}

const initialState: ThreadState = {
  items: [],
  meta: {},
  listLoading: false,
  listError: null,

  current: null,
  detailLoading: false,
  detailError: null,

  saving: false,
  saveError: null,
};

const threadSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    // List
    fetchThreadsStart(state) {
      state.listLoading = true;
      state.listError = null;
    },
    fetchThreadsSuccess(
      state,
      action: PayloadAction<{ items: Thread[]; meta: Partial<PaginatedMeta> }>,
    ) {
      state.items = action.payload.items;
      state.meta = action.payload.meta;
      state.listLoading = false;
    },
    fetchThreadsFailure(state, action: PayloadAction<string>) {
      state.listLoading = false;
      state.listError = action.payload;
    },

    // Detail
    fetchThreadStart(state) {
      state.detailLoading = true;
      state.detailError = null;
      state.current = null;
    },
    fetchThreadSuccess(state, action: PayloadAction<Thread>) {
      state.current = action.payload;
      state.detailLoading = false;
    },
    fetchThreadFailure(state, action: PayloadAction<string>) {
      state.detailLoading = false;
      state.detailError = action.payload;
    },

    // Create / Update / Delete
    saveThreadStart(state) {
      state.saving = true;
      state.saveError = null;
    },
    createThreadSuccess(state, action: PayloadAction<Thread>) {
      state.items = [action.payload, ...state.items];
      state.saving = false;
      state.saveError = null;
      state.current = action.payload;
    },
    updateThreadSuccess(state, action: PayloadAction<Thread>) {
      state.saving = false;
      state.current = action.payload;
      state.saveError = null;
      state.items = state.items.map((t) =>
        t.id === action.payload.id ? action.payload : t,
      );
    },
    deleteThreadSuccess(state, action: PayloadAction<number>) {
      state.saving = false;
      state.saveError = null;
      state.items = state.items.filter((t) => t.id !== action.payload);
      if (state.current?.id === action.payload) state.current = null;
    },
    saveThreadFailure(state, action: PayloadAction<string>) {
      state.saving = false;
      state.saveError = action.payload;
    },

    resetThreadError(state) {
      state.saveError = null;
    },

    // Optimistically increment comment count on current thread
    incrementCommentCount(state) {
      if (state.current) {
        state.current = {
          ...state.current,
          comments_count: (state.current.comments_count ?? 0) + 1,
        };
      }
    },

    // Vote
    voteThreadSuccess(
      state,
      action: PayloadAction<{ id: number | string; result: VoteResponse }>,
    ) {
      const { id, result } = action.payload;
      const update = (t: Thread) =>
        String(t.id) === String(id)
          ? {
              ...t,
              upvotes_count: result.upvotes_count,
              downvotes_count: result.downvotes_count,
            }
          : t;

      state.items = state.items.map(update);
      if (state.current && String(state.current.id) === String(id)) {
        state.current = update(state.current);
      }
    },
  },
});

export const threadActions = threadSlice.actions;
export default threadSlice.reducer;
