import {
  AuthDatasource,
  CommentDatasource,
  ProtocolDatasource,
  ThreadDatasource,
} from "../datasources";
import { AuthRepository } from "./auth/auth.repository";
import { CommentRepository } from "./comment/comment.repository";
import { ProtocolRepository } from "./protocol/protocol.repository";
import { ThreadRepository } from "./thread/thread.repository";

export const repositories = {
  protocolRepository: new ProtocolRepository(new ProtocolDatasource()),
  authRepository: new AuthRepository(new AuthDatasource()),
  commentRepository: new CommentRepository(new CommentDatasource()),
  threadRepository: new ThreadRepository(new ThreadDatasource()),
};
