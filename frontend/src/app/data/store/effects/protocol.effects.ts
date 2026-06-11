import { createAsyncThunk } from "@reduxjs/toolkit";

import { protocolActions, type ThunkApi } from "../index";
import type {
  CreateProtocolPayload,
  CreateReviewPayload,
  Protocol,
  ProtocolListParams,
  Review,
  UpdateProtocolPayload,
} from "../../models";

export const fetchProtocols = createAsyncThunk<
  void,
  ProtocolListParams | undefined,
  ThunkApi
>("protocols/fetchAll", async (params, { dispatch, extra }) => {
  dispatch(protocolActions.fetchProtocolsStart());
  try {
    const result = await extra.protocolRepository.getProtocols(params);
    dispatch(
      protocolActions.fetchProtocolsSuccess({
        items: result.data,
        meta: result.meta,
      }),
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load protocols";
    dispatch(protocolActions.fetchProtocolsFailure(message));
  }
});

export const fetchProtocol = createAsyncThunk<void, string | number, ThunkApi>(
  "protocols/fetchOne",
  async (slug, { dispatch, extra }) => {
    dispatch(protocolActions.fetchProtocolStart());
    try {
      const protocol = await extra.protocolRepository.getProtocol(slug);
      dispatch(protocolActions.fetchProtocolSuccess(protocol));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load protocol";
      dispatch(protocolActions.fetchProtocolFailure(message));
    }
  },
);

export const createProtocol = createAsyncThunk<
  Protocol | undefined,
  CreateProtocolPayload,
  ThunkApi
>("protocols/create", async (payload, { dispatch, extra }) => {
  dispatch(protocolActions.saveProtocolStart());
  try {
    const protocol = await extra.protocolRepository.createProtocol(payload);
    dispatch(protocolActions.createProtocolSuccess(protocol));
    return protocol;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create protocol";
    dispatch(protocolActions.saveProtocolFailure(message));
  }
});

export const updateProtocol = createAsyncThunk<
  Protocol | undefined,
  { id: number; payload: UpdateProtocolPayload },
  ThunkApi
>("protocols/update", async ({ id, payload }, { dispatch, extra }) => {
  dispatch(protocolActions.saveProtocolStart());
  try {
    const protocol = await extra.protocolRepository.updateProtocol(id, payload);
    dispatch(protocolActions.updateProtocolSuccess(protocol));
    return protocol;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update protocol";
    dispatch(protocolActions.saveProtocolFailure(message));
  }
});

export const deleteProtocol = createAsyncThunk<void, number, ThunkApi>(
  "protocols/delete",
  async (id, { dispatch, extra }) => {
    dispatch(protocolActions.saveProtocolStart());
    try {
      await extra.protocolRepository.deleteProtocol(id);
      dispatch(protocolActions.deleteProtocolSuccess(id));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete protocol";
      dispatch(protocolActions.saveProtocolFailure(message));
    }
  },
);

export const fetchProtocolReviews = createAsyncThunk<
  void,
  number | string,
  ThunkApi
>("protocols/fetchReviews", async (protocolId, { dispatch, extra }) => {
  dispatch(protocolActions.fetchReviewsStart());
  try {
    const result = await extra.protocolRepository.getReviews(protocolId);
    dispatch(protocolActions.fetchReviewsSuccess(result.data));
  } catch {
    dispatch(protocolActions.fetchReviewsFailure());
  }
});

export const createReview = createAsyncThunk<
  Review | undefined,
  { protocolId: number | string; payload: CreateReviewPayload },
  ThunkApi
>(
  "protocols/createReview",
  async ({ protocolId, payload }, { dispatch, extra }) => {
    dispatch(protocolActions.addReviewStart());
    try {
      const review = await extra.protocolRepository.createReview(
        protocolId,
        payload,
      );
      dispatch(protocolActions.addReviewSuccess(review));
      return review;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit review";
      dispatch(protocolActions.addReviewFailure(message));
    }
  },
);

export const updateReview = createAsyncThunk<
  Review,
  {
    reviewId: number;
    payload: CreateReviewPayload;
  },
  ThunkApi
>(
  "protocols/updateReview",
  async ({ reviewId, payload }, { dispatch, extra }) => {
    dispatch(protocolActions.editReviewStart());
    try {
      const review = await extra.protocolRepository.updateReview(
        reviewId,
        payload,
      );
      dispatch(protocolActions.updateReviewSuccess(review));
      return review;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update review";
      dispatch(protocolActions.editReviewFailure(message));
      throw err;
    }
  },
);

export const deleteReview = createAsyncThunk<
  void,
  { reviewId: number },
  ThunkApi
>("protocols/deleteReview", async ({ reviewId }, { dispatch, extra }) => {
  dispatch(protocolActions.deleteReviewStart());
  try {
    await extra.protocolRepository.deleteReview(reviewId);
    dispatch(protocolActions.deleteReviewSuccess(reviewId));
  } catch (err: unknown) {
    dispatch(protocolActions.deleteReviewFailure());
    throw err;
  }
});

export const fetchProtocolThreads = createAsyncThunk<
  void,
  number | string,
  ThunkApi
>("protocols/fetchThreads", async (protocolId, { dispatch, extra }) => {
  dispatch(protocolActions.fetchProtocolThreadsStart());
  try {
    const result = await extra.protocolRepository.getThreads(protocolId);
    dispatch(protocolActions.fetchProtocolThreadsSuccess(result.data));
  } catch {
    dispatch(protocolActions.fetchProtocolThreadsFailure());
  }
});
