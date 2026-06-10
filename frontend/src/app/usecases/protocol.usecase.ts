import type { ProtocolListParams } from "../data/models";
import { fetchProtocols, type AppDispatch } from "../data/store";

export class FetchProtocolsUsecase {
  constructor(private dispatch: AppDispatch) {}

  execute(params?: ProtocolListParams): void {
    this.dispatch(fetchProtocols(params));
  }
}
