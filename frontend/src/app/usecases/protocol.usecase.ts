import type {
  CreateProtocolPayload,
  CreateReviewPayload,
  ProtocolListParams,
} from "../data/models";
import {
  createProtocol,
  createReview,
  deleteReview,
  fetchProtocol,
  fetchProtocolReviews,
  fetchProtocols,
  fetchProtocolThreads,
  updateReview,
  voteProtocol,
  type AppDispatch,
} from "../data/store";

export class ProtocolsUsecase {
  constructor(private dispatch: AppDispatch) {}

  execute(params?: ProtocolListParams): void {
    this.dispatch(fetchProtocols(params));
  }

  createNewProtocol(data: CreateProtocolPayload) {
    this.dispatch(createProtocol(data));
  }

  loadProtocol(slug: string | number): void {
    this.dispatch(fetchProtocol(slug));
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

  upvoteProtocol(data: {
    slug: string;
    id: number;
    voteType: "upvote" | "downvote";
  }) {
    this.dispatch(
      voteProtocol({
        id: data.id,
        voteType: data.voteType,
        slug: data.slug,
      }),
    );
  }
}
