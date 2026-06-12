import type { Comment } from "../../../models";
import type {
  CreateCommentPayload,
  ICommentDatasource,
  ICommentRepository,
  VoteResponse,
  VotesResponseAPI,
} from "../../models";

export class CommentRepository implements ICommentRepository {
  constructor(private datasource: ICommentDatasource) {}

  getComments(threadId: string | number): Promise<Comment[]> {
    return this.datasource.getComments(threadId);
  }

  createComment(
    threadId: string | number,
    payload: CreateCommentPayload,
  ): Promise<Comment> {
    return this.datasource.createComment(threadId, payload);
  }

  updateComment(id: number, body: string): Promise<Comment> {
    return this.datasource.updateComment(id, body);
  }

  deleteComment(id: number): Promise<void> {
    return this.datasource.deleteComment(id);
  }

  voteComment(
    id: number | string,
    type: "upvote" | "downvote",
  ): Promise<VoteResponse> {
    return this.datasource.voteComment(id, type);
  }
}
