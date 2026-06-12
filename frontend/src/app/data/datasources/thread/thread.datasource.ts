import { toDomainError } from "../../errors/domain-error";
import {
  api,
  type CreateThreadPayload,
  type PaginatedResponse,
  type Thread,
  type ThreadListParams,
  type UpdateThreadPayload,
  type VoteResponse,
} from "../../models";
import type { IThreadDatasource } from "../../models/thread.datasource.interface";

export class ThreadDatasource implements IThreadDatasource {
  async getThreads(
    params?: ThreadListParams,
  ): Promise<PaginatedResponse<Thread>> {
    try {
      const { data } = await api.get<PaginatedResponse<Thread>>("/threads", {
        params,
      });
      return data;
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async getThread(id: string | number): Promise<Thread> {
    try {
      const { data } = await api.get<Thread>(`/threads/${id}`);
      return data;
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async createThread(payload: CreateThreadPayload): Promise<Thread> {
    try {
      const { data } = await api.post<Thread>("/threads", payload);
      return data;
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async updateThread(
    slug: string,
    payload: UpdateThreadPayload,
  ): Promise<Thread> {
    try {
      const { data } = await api.put<Thread>(`/threads/${slug}`, payload);
      return data;
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async deleteThread(slug: string): Promise<void> {
    try {
      await api.delete(`/threads/${slug}`);
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async voteThread(
    id: number | string,
    type: "upvote" | "downvote",
  ): Promise<VoteResponse> {
    try {
      const { data } = await api.post<VoteResponse>(`/threads/${id}/vote`, {
        type,
      });
      return data;
    } catch (err) {
      throw toDomainError(err);
    }
  }
}
