import type { Review } from "./review.model";
import type { Thread } from "./thread.model";
import type {
  TypesenseHit,
  TypesenseProtocolDocument,
} from "./typesense.model";
import type { User } from "./user.model";

export type ProtocolItem = Protocol | TypesenseHit<TypesenseProtocolDocument>;

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

export interface ProtocolCardProps {
  protocol: ProtocolItem;
  index?: number;
}

export interface ProtocolListProps {
  protocols: ProtocolItem[];
  loading?: boolean;
  error?: string | null;
}

export type ProtocolStatus = "published" | "draft" | "archived";

export interface ProtocolForm {
  title: string;
  content: string;
  tags: string;
  status: ProtocolStatus;
}
