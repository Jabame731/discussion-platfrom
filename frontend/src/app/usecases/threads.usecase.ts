import type {
  CreateThreadPayload,
  ThreadListParams,
  VoteResponse,
} from "../data/models";
import {
  createThread,
  fetchComments,
  fetchThread,
  fetchThreads,
  protocolActions,
  voteThread,
  type AppDispatch,
} from "../data/store";
import type { Thread } from "../models";

export class ThreadsUsecase {
  constructor(private dispatch: AppDispatch) {}

  getThreads(params?: ThreadListParams) {
    this.dispatch(fetchThreads(params));
  }

  async createThread(
    payload: CreateThreadPayload,
  ): Promise<Thread | undefined> {
    const result = await this.dispatch(createThread(payload));

    // If the thread belongs to a protocol, also prepend to protocol's thread list
    const thread = result.payload as Thread | undefined;
    if (thread?.protocol_id) {
      this.dispatch(protocolActions.prependProtocolThread(thread));
    }

    return thread;
  }

  // Load thread + its comments together
  getThread(id: string | number): void {
    this.dispatch(fetchThread(id));
  }

  async execute(
    id: number | string,
    voteType: "upvote" | "downvote",
  ): Promise<VoteResponse | undefined> {
    const result = await this.dispatch(voteThread({ id, voteType }));
    return result.payload as VoteResponse | undefined;
  }
}
