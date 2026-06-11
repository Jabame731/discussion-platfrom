import { Link } from "react-router";
import { useEffect, useState } from "react";
import PageShell from "../components/layout/page-shell";
import FilterHeader from "../components/search/filter-header";
import ThreadList from "../components/threads/thread-list";
import EmptyState from "../components/ui/empty-state";
import {
  selectCurrentUser,
  selectThreadList,
  selectThreadListError,
  selectThreadListLoading,
  selectThreadMeta,
  useAppDispatch,
  useAppSelector,
} from "../data/store";
import {
  searchThreads,
  type TypesenseHit,
  type TypesenseThreadDocument,
} from "../data/models";
import { useDebounce } from "../hooks";
import { ThreadsUsecase } from "../usecases";
import type { ProtocolSort, SortOption } from "../models";

const THREAD_SORT_OPTIONS: SortOption[] = [
  { label: "Recent", value: "recent" },
  { label: "Most Upvoted", value: "most_upvoted" as ProtocolSort },
  { label: "Most Comments", value: "most_comments" as ProtocolSort },
];

const ThreadsPage = () => {
  const dispatch = useAppDispatch();
  const dbThreads = useAppSelector(selectThreadList);
  const meta = useAppSelector(selectThreadMeta);
  const dbLoading = useAppSelector(selectThreadListLoading);
  const dbError = useAppSelector(selectThreadListError);
  const user = useAppSelector(selectCurrentUser);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ProtocolSort>("recent");
  const [page, setPage] = useState(1);
  const [tsHits, setTsHits] = useState<TypesenseHit<TypesenseThreadDocument>[]>(
    [],
  );
  const [tsFound, setTsFound] = useState<number | null>(null);
  const [tsLoading, setTsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, sort]);

  useEffect(() => {
    if (debouncedQuery) return;
    const usecase = new ThreadsUsecase(dispatch);
    usecase.getThreads({
      sort: sort as "recent" | "most_upvoted" | "most_comments",
      page,
      per_page: 12,
    });
  }, [debouncedQuery, sort, page, dispatch]);

  useEffect(() => {
    if (!debouncedQuery) {
      setTsHits([]);
      setTsFound(null);
      return;
    }
    let cancelled = false;
    setTsLoading(true);
    searchThreads(debouncedQuery, { sort, page, perPage: 12 })
      .then((result) => {
        if (!cancelled) {
          setTsHits(result.hits as TypesenseHit<TypesenseThreadDocument>[]);
          setTsFound(result.found);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setTsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, sort, page]);

  const isSearching = !!debouncedQuery;
  const threads = isSearching ? tsHits : dbThreads;
  const loading = isSearching ? tsLoading : dbLoading;
  const resultCount = isSearching ? (tsFound ?? undefined) : meta.found;
  const lastPage = meta.last_page ?? 1;

  return (
    <PageShell>
      <div className="mb-10 animate-fade-up">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
          <div>
            <p className="text-stone-500 text-base max-w-lg">
              Community discussions about wellness protocols and practices.
            </p>
          </div>
          {user && (
            <Link to="/threads/new" className="btn-primary shrink-0">
              + New Thread
            </Link>
          )}
        </div>
      </div>

      <div className="mb-6 animate-fade-up stagger-1" style={{ opacity: 0 }}>
        <FilterHeader
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
          loading={loading && isSearching}
          resultCount={resultCount}
          sortOptions={THREAD_SORT_OPTIONS}
        />
      </div>

      {!loading && !dbError && !threads.length ? (
        <EmptyState
          icon="💬"
          title="No threads found"
          description={
            debouncedQuery
              ? `No results for "${debouncedQuery}"`
              : "Start the first discussion."
          }
          action={
            user && (
              <Link to="/threads/new" className="btn-primary">
                Start a Thread
              </Link>
            )
          }
        />
      ) : (
        <ThreadList threads={threads} loading={loading} />
      )}

      {!loading && !isSearching && lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 animate-fade-in">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="btn-ghost disabled:opacity-30"
          >
            ← Prev
          </button>
          <span className="text-sm text-stone-500">
            Page {meta.page ?? page} of {lastPage}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= lastPage}
            className="btn-ghost disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </PageShell>
  );
};

export default ThreadsPage;
