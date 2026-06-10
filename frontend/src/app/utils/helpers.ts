import type { ProtocolItem, SortOption } from "../models";
import type {
  TypesenseHit,
  TypesenseProtocolDocument,
} from "../models/typesense.model";

export const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: "recent", label: "Most Recent" },
  { value: "most_reviewed", label: "Most Reviewed" },
  { value: "top_rated", label: "Top Rated" },
  { value: "most_upvoted", label: "Most Upvoted" },
];

export const MAX_DEPTH = 4;

export const DEPTH_COLORS: Record<number, string> = {
  0: "border-[#2a2820]",
  1: "border-sage-900/60",
  2: "border-teal-900/40",
  3: "border-blue-900/40",
  4: "border-purple-900/40",
};

export function isHit<T>(item: unknown): item is TypesenseHit<T> {
  return typeof item === "object" && item !== null && "document" in item;
}

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
