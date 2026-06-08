import type { User } from "./user.model";

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
