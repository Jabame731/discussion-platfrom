import type { RootState } from "../store-setup";

export const selectProtocolList = (state: RootState) => state.protocols.items;
export const selectProtocolMeta = (s: RootState) => s.protocols.meta;
export const selectProtocolListLoading = (s: RootState) =>
  s.protocols.listLoading;
export const selectProtocolListError = (s: RootState) => s.protocols.listError;

export const selectCurrentProtocol = (s: RootState) => s.protocols.current;
export const selectProtocolLoading = (s: RootState) =>
  s.protocols.detailLoading;
export const selectProtocolError = (s: RootState) => s.protocols.detailError;

export const selectProtocolReviews = (s: RootState) => s.protocols.reviews;
export const selectProtocolReviewsLoading = (s: RootState) =>
  s.protocols.reviewsLoading;

export const selectProtocolThreads = (s: RootState) =>
  s.protocols.protocolThreads;
export const selectProtocolThreadsLoading = (s: RootState) =>
  s.protocols.protocolThreadsLoading;

export const selectProtocolSaving = (s: RootState) => s.protocols.saving;
export const selectProtocolSaveError = (s: RootState) => s.protocols.saveError;
