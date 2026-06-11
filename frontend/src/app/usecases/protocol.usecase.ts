import type { CreateReviewPayload, ProtocolListParams } from "../data/models";
import {
  createReview,
  deleteReview,
  fetchProtocol,
  fetchProtocolReviews,
  fetchProtocols,
  fetchProtocolThreads,
  updateReview,
  type AppDispatch,
} from "../data/store";

export class ProtocolsUsecase {
  constructor(private dispatch: AppDispatch) {}

  execute(params?: ProtocolListParams): void {
    this.dispatch(fetchProtocols(params));
  }

  loadAll(slug: string | number): void {
    this.dispatch(fetchProtocol(slug));
    this.dispatch(fetchProtocolReviews(slug));
    this.dispatch(fetchProtocolThreads(slug));
  }

  createReview(protocolId: string | number, payload: CreateReviewPayload) {
    this.dispatch(createReview({ protocolId, payload }));
  }

  updateReview(reviewId: number, payload: CreateReviewPayload) {
    this.dispatch(updateReview({ reviewId, payload }));
  }

  deleteReview(reviewId: number) {
    this.dispatch(deleteReview({ reviewId }));
  }
}
