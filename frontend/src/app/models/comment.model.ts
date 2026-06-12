import type { User } from "./user.model";

export interface Author {
  name: string;
  username: string;
  email: string;
  email_verified_at?: string;
  avatar: string | null;
  bio: string | null;
  created_at?: string;
  updated_at?: string;
}

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
  author?: Author;
  replies?: Comment[];
}

export interface CommentNodeProps {
  comment: Comment;
  depth?: number;
  onReplyAdded?: (parentId: number, reply: Comment) => void;
}

export interface ThreadComment {
  id: number;
  user_id: number;
  thread_id: number;
  parent_id: number | null;
  body: string;
  upvotes_count: number;
  downvotes_count: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  author: User;
  replies: ThreadComment[];
}

export type CommentWithVote = Comment & {
  currentVoteType: "upvote" | "downvote" | null;
  replies: CommentWithVote[];
};
