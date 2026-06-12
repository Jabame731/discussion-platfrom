import {
  api,
  type CreateProtocolPayload,
  type CreateReviewPayload,
  type PaginatedResponse,
  type Protocol,
  type ProtocolDatasourceInterface,
  type ProtocolListParams,
  type Review,
  type Thread,
  type UpdateProtocolPayload,
  type VoteResponse,
} from "../../models";
import { toDomainError } from "../../errors/domain-error";

export class ProtocolDatasource implements ProtocolDatasourceInterface {
  async getProtocols(
    params?: ProtocolListParams,
  ): Promise<PaginatedResponse<Protocol>> {
    try {
      const res = await api.get<PaginatedResponse<Protocol>>("/protocols", {
        params,
      });

      return res.data;
    } catch (error) {
      throw toDomainError(error);
    }
  }

  async getProtocol(slug: string | number): Promise<Protocol> {
    try {
      const res = await api.get<Protocol>(`/protocols/${slug}`);

      return res.data;
    } catch (error) {
      throw toDomainError(error);
    }
  }

  async createProtocol(payload: CreateProtocolPayload): Promise<Protocol> {
    try {
      const res = await api.post<Protocol>("/protocols", payload);
      return res.data;
    } catch (error) {
      throw toDomainError(error);
    }
  }

  async updateProtocol(
    id: number | string,
    payload: UpdateProtocolPayload,
  ): Promise<Protocol> {
    try {
      const res = await api.put<Protocol>(`/protocols/${id}`, payload);
      return res.data;
    } catch (error) {
      throw toDomainError(error);
    }
  }

  async deleteProtocol(id: number): Promise<void> {
    try {
      await api.delete(`/protocols/${id}`);
    } catch (error) {
      throw toDomainError(error);
    }
  }

  async getReviews(
    protocolId: number | string,
  ): Promise<PaginatedResponse<Review>> {
    try {
      const res = await api.get<PaginatedResponse<Review>>(
        `/protocols/${protocolId}/reviews`,
      );
      return res.data;
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async createReview(
    protocolId: number | string,
    payload: CreateReviewPayload,
  ): Promise<Review> {
    try {
      const res = await api.post<Review>(
        `/protocols/${protocolId}/reviews`,
        payload,
      );
      return res.data;
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async updateReview(
    reviewId: number,
    payload: CreateReviewPayload,
  ): Promise<Review> {
    try {
      const res = await api.put<Review>(`/reviews/${reviewId}`, payload);
      return res.data;
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async deleteReview(reviewId: number): Promise<void> {
    try {
      await api.delete(`/reviews/${reviewId}`);
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async getThreads(
    protocolId: number | string,
  ): Promise<PaginatedResponse<Thread>> {
    try {
      const res = await api.get<PaginatedResponse<Thread>>(
        `/protocols/${protocolId}/threads`,
      );
      return res.data;
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async voteProtocol(
    slug: number | string,
    type: "upvote" | "downvote",
  ): Promise<VoteResponse> {
    try {
      const { data } = await api.post<VoteResponse>(`/protocols/${slug}/vote`, {
        type,
      });
      return data;
    } catch (err) {
      throw toDomainError(err);
    }
  }
}
