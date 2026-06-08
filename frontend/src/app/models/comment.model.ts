import type { User } from "./user.model";

export interface Comment {
  id: number;
  user_id: number;
  thread_id: number;
  parent_id?: number | null;
  body: string;
  upvotes_count: number;
  downvotes_count: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  author?: User;
  replies?: Comment[];
}

export interface CommentNodeProps {
  comment: Comment;
  depth?: number;
  onReplyAdded?: (parentId: number, reply: Comment) => void;
}
