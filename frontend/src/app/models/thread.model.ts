import type { Protocol } from "./protocol.model";
import type { TypesenseHit, TypesenseThreadDocument } from "./typesense.model";
import type { User } from "./user.model";

export type ThreadItem = Thread | TypesenseHit<TypesenseThreadDocument>;

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
  root_comments?: Comment[];
}

export interface ThreadCardProps {
  thread: ThreadItem;
  index?: number;
  compact?: boolean;
}

export interface NewThreadFormProps {
  protocolId?: number;
  onSuccess?: (thread: Thread) => void;
  onCancel?: () => void;
}
