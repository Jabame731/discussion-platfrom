import { toDomainError } from "../../errors/domain-error";
import { api, type VotesResponseAPI } from "../../models";

export class VoteDatasource {
  async getVotes(params?: {
    type: string;
    votable: string;
  }): Promise<VotesResponseAPI[]> {
    try {
      const { data } = await api.get<{ data: VotesResponseAPI[] }>("/votes", {
        params,
      });

      return data.data;
    } catch (error) {
      throw toDomainError(error);
    }
  }
}
