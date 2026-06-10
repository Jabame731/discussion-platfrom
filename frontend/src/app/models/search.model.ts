import type { ProtocolSort, SortOption } from "./sort.model";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export interface SortBarProps {
  value: string;
  onChange: (value: string) => void;
  options?: SortOption[];
}

export interface FilterHeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  sort: ProtocolSort;
  onSortChange: (s: ProtocolSort) => void;
  loading?: boolean;
  resultCount?: number;
  sortOptions?: SortOption[];
}
