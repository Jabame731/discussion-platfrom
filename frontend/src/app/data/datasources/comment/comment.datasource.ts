import type { Comment } from "../../../models";
import { toDomainError } from "../../errors/domain-error";
import { api, type ICommentDatasource, type VoteResponse } from "../../models";

export interface CreateCommentPayload {
  body: string;
  parent_id?: number | null;
}

export class CommentDatasource implements ICommentDatasource {
  async getComments(threadId: string | number): Promise<Comment[]> {
    try {
      const { data } = await api.get<{ data: Comment[] }>(
        `/threads/${threadId}/comments`,
      );
      return data.data ?? [];
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async createComment(
    threadId: string | number,
    payload: CreateCommentPayload,
  ): Promise<Comment> {
    try {
      const { data } = await api.post<Comment>(
        `/threads/${threadId}/comments`,
        payload,
      );
      return data;
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async updateComment(id: number, body: string): Promise<Comment> {
    try {
      const { data } = await api.put<Comment>(`/comments/${id}`, { body });
      return data;
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async deleteComment(id: number): Promise<void> {
    try {
      await api.delete(`/comments/${id}`);
    } catch (err) {
      throw toDomainError(err);
    }
  }

  async voteComment(
    id: number | string,
    type: "upvote" | "downvote",
  ): Promise<VoteResponse> {
    try {
      const { data } = await api.post<VoteResponse>(`/comments/${id}/vote`, {
        type,
      });
      return data;
    } catch (err) {
      throw toDomainError(err);
    }
  }
}
