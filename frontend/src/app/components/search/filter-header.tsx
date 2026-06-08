import type { FilterHeaderProps } from "../../models";
import SearchBar from "./search-bar";
import SortBar from "./sort-bar";

const FilterHeader = ({
  query,
  onQueryChange,
  sort,
  onSortChange,
  loading,
  resultCount,
  sortOptions,
}: FilterHeaderProps) => {
  return (
    <div className="space-y-3">
      <SearchBar
        value={query}
        onChange={onQueryChange}
        loading={loading}
        placeholder="Search by title, content, tags..."
      />
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <SortBar value={sort} onChange={onSortChange} options={sortOptions} />
        {resultCount != null && (
          <span className="text-xs text-stone-600 shrink-0">
            {resultCount.toLocaleString()} result{resultCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
};

export default FilterHeader;
