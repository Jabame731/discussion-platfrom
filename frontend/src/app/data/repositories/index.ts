import { ProtocolDatasource } from "../datasources";
import { ProtocolRepository } from "./protocol/protocol.repository";

export const repositories = {
  protocolRepository: new ProtocolRepository(new ProtocolDatasource()),
};
