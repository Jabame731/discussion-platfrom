export interface Vote {
  id: number;
  user_id: number;
  votable_type: string;
  votable_id: number;
  type: "upvote" | "downvote";
  created_at: string;
}
