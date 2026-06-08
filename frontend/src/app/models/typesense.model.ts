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
