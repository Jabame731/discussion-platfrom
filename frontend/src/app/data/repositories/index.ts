import {
  AuthDatasource,
  CommentDatasource,
  ProtocolDatasource,
} from "../datasources";
import { AuthRepository } from "./auth/auth.repository";
import { CommentRepository } from "./comment/comment.repository";
import { ProtocolRepository } from "./protocol/protocol.repository";

export const repositories = {
  protocolRepository: new ProtocolRepository(new ProtocolDatasource()),
  authRepository: new AuthRepository(new AuthDatasource()),
  commentRepository: new CommentRepository(new CommentDatasource()),
};
