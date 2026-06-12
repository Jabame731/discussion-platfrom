import type { VoteDatasource } from "../../datasources";
import type { VotesResponseAPI } from "../../models";

export interface IVoteRepository {
  getVotes(params?: {
    type: string;
    votable: string;
  }): Promise<VotesResponseAPI[]>;
}

export class VoteRepository implements IVoteRepository {
  constructor(private datasource: VoteDatasource) {}

  getVotes(params?: {
    type: string;
    votable: string;
  }): Promise<VotesResponseAPI[]> {
    return this.datasource.getVotes(params);
  }
}
