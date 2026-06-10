export interface CommentCreateData {
  body: string;
  parent_id?: number | null;
}

export interface CreateCommentPayload {
  body: string;
  parent_id?: number | null;
}
