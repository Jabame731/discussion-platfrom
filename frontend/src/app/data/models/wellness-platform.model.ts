export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Protocol {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  status: "published" | "draft" | "archived";
  views_count: number;
  reviews_count: number;
  average_rating: number;
  upvotes_count: number;
  downvotes_count: number;
  created_at: string;
  updated_at: string;
  author?: User;
  threads?: Thread[];
  reviews?: Review[];
}

export interface Thread {
  id: number;
  user_id: number;
  protocol_id?: number;
  title: string;
  slug: string;
  body: string;
  tags: string[];
  status: "open" | "closed" | "pinned";
  views_count: number;
  comments_count: number;
  upvotes_count: number;
  downvotes_count: number;
  created_at: string;
  updated_at: string;
  author?: User;
  protocol?: Protocol;
  root_comments?: ProtocolComment[];
}

export interface ProtocolComment {
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
  replies?: ProtocolComment[];
}

export interface Review {
  id: number;
  user_id: number;
  protocol_id: number;
  rating: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
  author?: User;
}

export interface Vote {
  id: number;
  user_id: number;
  votable_type: string;
  votable_id: number;
  type: "upvote" | "downvote";
  created_at: string;
}

export interface PaginatedMeta {
  found: number;
  page: number;
  per_page: number;
  last_page?: number;
  source?: "database" | "typesense";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface VoteResponse {
  action: "added" | "removed" | "switched";
  upvotes_count: number;
  downvotes_count: number;
  score: number;
}

export interface VotesResponseAPI {
  id: number;
  votable_type: string;
  votable_id: number;
  type: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Typesense types
export interface TypesenseProtocolDocument {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author_name: string;
  status: string;
  average_rating: number;
  reviews_count: number;
  upvotes_count: number;
  downvotes_count: number;
  created_at: number;
}

export interface TypesenseThreadDocument {
  id: string;
  title: string;
  body: string;
  slug: string;
  tags: string[];
  author_name: string;
  protocol_id?: number;
  protocol_title?: string;
  status: string;
  upvotes_count: number;
  downvotes_count: number;
  comments_count: number;
  created_at: number;
}

export interface TypesenseHit<T> {
  document: T;
  highlight?: Record<string, unknown>;
  highlights?: unknown[];
  text_match?: number;
}

export interface TypesenseSearchResult<T> {
  found: number;
  page: number;
  hits: TypesenseHit<T>[];
  facet_counts?: unknown[];
}

export type VoteType = "upvote" | "downvote";

export type ProtocolSort =
  | "recent"
  | "most_reviewed"
  | "top_rated"
  | "most_upvoted";
export type ThreadSort = "recent" | "most_upvoted" | "most_comments";

export interface SortOption {
  value: string;
  label: string;
}

export interface SearchOptions {
  sort?: string;
  page?: number;
  perPage?: number;
  protocolId?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}
