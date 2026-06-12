import type {
  CreateThreadPayload,
  IThreadDatasource,
  IThreadRepository,
  PaginatedResponse,
  Thread,
  ThreadListParams,
  UpdateThreadPayload,
  VoteResponse,
} from "../../models";

export class ThreadRepository implements IThreadRepository {
  constructor(private datasource: IThreadDatasource) {}

  getThreads(params?: ThreadListParams): Promise<PaginatedResponse<Thread>> {
    return this.datasource.getThreads(params);
  }

  getThread(id: string | number): Promise<Thread> {
    return this.datasource.getThread(id);
  }

  createThread(payload: CreateThreadPayload): Promise<Thread> {
    return this.datasource.createThread(payload);
  }

  updateThread(slug: string, payload: UpdateThreadPayload): Promise<Thread> {
    return this.datasource.updateThread(slug, payload);
  }

  deleteThread(slug: string): Promise<void> {
    return this.datasource.deleteThread(slug);
  }

  voteThread(
    id: number | string,
    type: "upvote" | "downvote",
  ): Promise<VoteResponse> {
    return this.datasource.voteThread(id, type);
  }
}
