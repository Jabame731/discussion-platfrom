export type ProtocolSort =
  | "recent"
  | "most_reviewed"
  | "top_rated"
  | "most_upvoted";
export type ThreadSort = "recent" | "most_upvoted" | "most_comments";

export interface SortOption {
  value: ProtocolSort;
  label: string;
}
