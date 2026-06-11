import { ProtocolDatasource } from "../../datasources";
import type {
  CreateProtocolPayload,
  CreateReviewPayload,
  IProtocolRepository,
  PaginatedResponse,
  Protocol,
  ProtocolListParams,
  Review,
  Thread,
  UpdateProtocolPayload,
} from "../../models";

export class ProtocolRepository implements IProtocolRepository {
  constructor(private datasource: ProtocolDatasource) {}

  getProtocols(
    params?: ProtocolListParams,
  ): Promise<PaginatedResponse<Protocol>> {
    return this.datasource.getProtocols(params);
  }

  getProtocol(slug: string | number): Promise<Protocol> {
    return this.datasource.getProtocol(slug);
  }

  createProtocol(payload: CreateProtocolPayload): Promise<Protocol> {
    return this.datasource.createProtocol(payload);
  }

  updateProtocol(
    id: number | string,
    payload: UpdateProtocolPayload,
  ): Promise<Protocol> {
    return this.datasource.updateProtocol(id, payload);
  }

  deleteProtocol(id: number): Promise<void> {
    return this.datasource.deleteProtocol(id);
  }

  getReviews(protocolId: number | string): Promise<PaginatedResponse<Review>> {
    return this.datasource.getReviews(protocolId);
  }

  createReview(
    protocolId: number | string,
    payload: CreateReviewPayload,
  ): Promise<Review> {
    return this.datasource.createReview(protocolId, payload);
  }

  updateReview(
    reviewId: number,
    payload: CreateReviewPayload,
  ): Promise<Review> {
    return this.datasource.updateReview(reviewId, payload);
  }

  deleteReview(reviewId: number): Promise<void> {
    return this.datasource.deleteReview(reviewId);
  }

  getThreads(protocolId: number | string): Promise<PaginatedResponse<Thread>> {
    return this.datasource.getThreads(protocolId);
  }
}
