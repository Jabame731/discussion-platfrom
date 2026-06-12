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

// Adding a review
export const isReviewAddLoading = (s: RootState) => s.protocols.addReviewStart;
export const isReviewSucceeded = (s: RootState) =>
  s.protocols.addReviewSucceeded;
export const isReviewFailed = (s: RootState) => s.protocols.addReviewFailure;

// Editing a review
export const editReviewLoading = (s: RootState) =>
  s.protocols.editReviewLoading;
export const editReviewError = (s: RootState) => s.protocols.editReviewError;

// Deleting a review
export const deleteReviewLoading = (s: RootState) =>
  s.protocols.deleteReviewLoading;

export const getProtocolThreads = (s: RootState) =>
  s.protocols.current?.threads;
export const getProtocolReviews = (s: RootState) =>
  s.protocols.current?.reviews;

// Find protocol by slug
export const selectProtocolBySlug = (slug: string) => (state: RootState) =>
  state.protocols.items.find((p) => p.slug === slug);

// Voting
export const selectProtocolVoteLoading = (s: RootState) =>
  s.protocols.voteLoading;
export const selectProtocolVoteError = (s: RootState) => s.protocols.voteError;
