import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PaginatedMeta, Protocol, Review, Thread } from "../../models";

interface ProtocolState {
  // list
  items: Protocol[];
  meta: Partial<PaginatedMeta>;
  listLoading: boolean;
  listError: string | null;
  // detail
  current: Protocol | null;
  detailLoading: boolean;
  detailError: string | null;
  // reviews
  reviews: Review[];
  reviewsLoading: boolean;

  // add reviews
  addReviewStart: boolean;
  addReviewSucceeded: boolean;
  addReviewFailure: string | null;

  editReviewLoading: boolean;
  editReviewError: string | null;
  deleteReviewLoading: boolean;

  // protocol threads
  protocolThreads: Thread[];
  protocolThreadsLoading: boolean;
  // mutation
  saving: boolean;
  saveError: string | null;
}

const initialState: ProtocolState = {
  items: [],
  meta: {},
  listLoading: false,
  listError: null,

  current: null,
  detailLoading: false,
  detailError: null,

  reviews: [],
  reviewsLoading: false,

  addReviewStart: false,
  addReviewSucceeded: false,
  addReviewFailure: null,

  editReviewLoading: false,
  editReviewError: null,
  deleteReviewLoading: false,

  protocolThreads: [],
  protocolThreadsLoading: false,

  saving: false,
  saveError: null,
};

const protocolSlice = createSlice({
  name: "protocols",
  initialState,
  reducers: {
    // List
    fetchProtocolsStart(state) {
      state.listLoading = true;
      state.listError = null;
    },
    fetchProtocolsSuccess(
      state,
      action: PayloadAction<{
        items: Protocol[];
        meta: Partial<PaginatedMeta>;
      }>,
    ) {
      state.items = action.payload.items;
      state.meta = action.payload.meta;
      state.listLoading = false;
    },
    fetchProtocolsFailure(state, action: PayloadAction<string>) {
      state.listLoading = false;
      state.listError = action.payload;
    },

    // Detail
    fetchProtocolStart(state) {
      state.detailLoading = true;
      state.detailError = null;
      state.current = null;
    },
    fetchProtocolSuccess(state, action: PayloadAction<Protocol>) {
      state.current = action.payload;
      state.detailLoading = false;
    },
    fetchProtocolFailure(state, action: PayloadAction<string>) {
      state.detailLoading = false;
      state.detailError = action.payload;
    },

    // Create
    saveProtocolStart(state) {
      state.saving = true;
      state.saveError = null;
    },
    createProtocolSuccess(state, action: PayloadAction<Protocol>) {
      state.items = [action.payload, ...state.items];
      state.saving = false;
      state.current = action.payload;
    },
    updateProtocolSuccess(state, action: PayloadAction<Protocol>) {
      state.saving = false;
      state.current = action.payload;
      state.items = state.items.map((p) =>
        p.id === action.payload.id ? action.payload : p,
      );
    },
    deleteProtocolSuccess(state, action: PayloadAction<number | string>) {
      state.saving = false;
      state.items = state.items.filter((p) => p.id !== action.payload);
      if (state.current?.id === action.payload) state.current = null;
    },
    saveProtocolFailure(state, action: PayloadAction<string>) {
      state.saving = false;
      state.saveError = action.payload;
    },

    // Reviews
    fetchReviewsStart(state) {
      state.reviewsLoading = true;
    },
    fetchReviewsSuccess(state, action: PayloadAction<Review[]>) {
      state.reviews = action.payload;
      state.reviewsLoading = false;
    },
    fetchReviewsFailure(state) {
      state.reviewsLoading = false;
    },
    addReviewStart(state) {
      state.addReviewStart = true;
      state.addReviewFailure = null;
    },
    addReviewSuccess(state, action: PayloadAction<Review>) {
      // upsert — replace if user already reviewed, else prepend
      state.addReviewSucceeded = true;
      state.addReviewStart = false;
      if (!state.current?.reviews) return;
      const idx = state.current.reviews.findIndex(
        (r) => r.user_id === action.payload.user_id,
      );
      if (idx >= 0) {
        state.current.reviews[idx] = action.payload;
      } else {
        state.current.reviews = [action.payload, ...state.current.reviews];
      }
    },
    addReviewFailure(state, action: PayloadAction<string>) {
      state.addReviewStart = false;
      state.addReviewSucceeded = false;
      state.addReviewFailure = action.payload;
    },
    // Update review
    editReviewStart(state) {
      state.editReviewLoading = true;
      state.editReviewError = null;
    },
    updateReviewSuccess(state, action: PayloadAction<Review>) {
      state.editReviewLoading = false;
      if (!state.current?.reviews) return;
      const idx = state.current.reviews.findIndex(
        (r) => r.id === action.payload.id,
      );
      if (idx >= 0) state.current.reviews[idx] = action.payload;
    },
    editReviewFailure(state, action: PayloadAction<string>) {
      state.editReviewLoading = false;
      state.editReviewError = action.payload;
    },

    // Delete review
    deleteReviewStart(state) {
      state.deleteReviewLoading = true;
    },
    deleteReviewSuccess(state, action: PayloadAction<number>) {
      state.deleteReviewLoading = false;
      state.addReviewSucceeded = false;
      state.addReviewStart = false;
      state.addReviewFailure = null;
      if (!state.current?.reviews) return;
      state.current.reviews = state.current.reviews.filter(
        (r) => r.id !== action.payload,
      );
    },
    deleteReviewFailure(state) {
      state.deleteReviewLoading = false;
    },

    // Protocol threads
    fetchProtocolThreadsStart(state) {
      state.protocolThreadsLoading = true;
    },
    fetchProtocolThreadsSuccess(state, action: PayloadAction<Thread[]>) {
      state.protocolThreads = action.payload;
      state.protocolThreadsLoading = false;
    },
    fetchProtocolThreadsFailure(state) {
      state.protocolThreadsLoading = false;
    },
    prependProtocolThread(state, action: PayloadAction<Thread>) {
      if (!state.current) return;
      state.current.threads = [
        action.payload,
        ...(state.current.threads ?? []),
      ];
    },
  },
});

export const protocolActions = protocolSlice.actions;
export default protocolSlice.reducer;
