import type {
  CreateProtocolPayload,
  CreateReviewPayload,
  ProtocolListParams,
  UpdateProtocolPayload,
} from "./protocol.model";
import type {
  PaginatedResponse,
  Protocol,
  Review,
  Thread,
  VoteResponse,
} from "./wellness-platform.model";

export interface IProtocolRepository {
  getProtocols(
    params?: ProtocolListParams,
  ): Promise<PaginatedResponse<Protocol>>;
  getProtocol(slug: string | number): Promise<Protocol>;
  createProtocol(payload: CreateProtocolPayload): Promise<Protocol>;
  updateProtocol(
    id: number | string,
    payload: UpdateProtocolPayload,
  ): Promise<Protocol>;
  deleteProtocol(id: number | string): Promise<void>;
  getReviews(protocolId: number | string): Promise<PaginatedResponse<Review>>;
  createReview(
    protocolId: number | string,
    payload: CreateReviewPayload,
  ): Promise<Review>;
  updateReview(reviewId: number, payload: CreateReviewPayload): Promise<Review>;
  deleteReview(reviewId: number): Promise<void>;
  getThreads(protocolId: number | string): Promise<PaginatedResponse<Thread>>;
  voteProtocol(
    slug: number | string,
    type: "upvote" | "downvote",
  ): Promise<VoteResponse>;
}
