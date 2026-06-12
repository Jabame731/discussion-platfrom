import type {
  CreateThreadPayload,
  ThreadListParams,
  UpdateThreadPayload,
} from "./thread.model";
import type {
  PaginatedResponse,
  Thread,
  VoteResponse,
} from "./wellness-platform.model";

export interface IThreadRepository {
  getThreads(params?: ThreadListParams): Promise<PaginatedResponse<Thread>>;
  getThread(id: string | number): Promise<Thread>;
  createThread(payload: CreateThreadPayload): Promise<Thread>;
  updateThread(slug: string, payload: UpdateThreadPayload): Promise<Thread>;
  deleteThread(slug: string): Promise<void>;
  voteThread(
    id: number | string,
    type: "upvote" | "downvote",
  ): Promise<VoteResponse>;
}
