import type { Comment } from "../../models";
import type { CreateCommentPayload } from "./comment.model";
import type { VoteResponse } from "./wellness-platform.model";

export interface ICommentRepository {
  getComments(threadId: string | number): Promise<Comment[]>;
  createComment(
    threadId: string | number,
    payload: CreateCommentPayload,
  ): Promise<Comment>;
  updateComment(id: number, body: string): Promise<Comment>;
  deleteComment(id: number): Promise<void>;
  voteComment(
    id: number | string,
    type: "upvote" | "downvote",
  ): Promise<VoteResponse>;
}
