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
} from "./wellness-platform.model";

export interface ProtocolDatasourceInterface {
  getProtocols(
    params?: ProtocolListParams,
  ): Promise<PaginatedResponse<Protocol>>;
  getProtocol(slug: string | number): Promise<Protocol>;
  createProtocol(payload: CreateProtocolPayload): Promise<Protocol>;
  updateProtocol(id: number, payload: UpdateProtocolPayload): Promise<Protocol>;
  deleteProtocol(id: number): Promise<void>;
  getReviews(protocolId: number | string): Promise<PaginatedResponse<Review>>;
  createReview(
    protocolId: number | string,
    payload: CreateReviewPayload,
  ): Promise<Review>;
  updateReview(reviewId: number, payload: CreateReviewPayload): Promise<Review>;
  deleteReview(reviewId: number): Promise<void>;
  getThreads(protocolId: number | string): Promise<PaginatedResponse<Thread>>;
}
