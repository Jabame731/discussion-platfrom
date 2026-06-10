import { Link } from "react-router";
import { useEffect, useState } from "react";
import PageShell from "../components/layout/page-shell";
import FilterHeader from "../components/search/filter-header";
import ProtocolList from "../components/protocols/protocol-list";
import type { ProtocolSort, SortOption } from "../models";
import EmptyState from "../components/ui/empty-state";
import { BiLeaf } from "react-icons/bi";
import {
  selectProtocolList,
  selectProtocolListError,
  selectProtocolListLoading,
  selectProtocolMeta,
  useAppDispatch,
  useAppSelector,
} from "../data/store";
import {
  searchProtocols,
  type TypesenseHit,
  type TypesenseProtocolDocument,
} from "../data/models";
import { useDebounce } from "../hooks";
import { FetchProtocolsUsecase } from "../usecases";
import { toast } from "react-toastify";

const SORT_OPTIONS: SortOption[] = [
  { label: "Recent", value: "recent" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Most Reviewed", value: "most_reviewed" },
  { label: "Most Upvoted", value: "most_upvoted" },
];

const HomePage = () => {
  const dispatch = useAppDispatch();

  // Selectors — read from Redux store
  const dbProtocols = useAppSelector(selectProtocolList);
  const meta = useAppSelector(selectProtocolMeta);
  const dbLoading = useAppSelector(selectProtocolListLoading);
  const dbError = useAppSelector(selectProtocolListError);

  // Local state for Typesense search results
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ProtocolSort>("recent");
  const [page, setPage] = useState(1);
  const [tsHits, setTsHits] = useState<
    TypesenseHit<TypesenseProtocolDocument>[]
  >([]);
  const [tsFound, setTsFound] = useState<number | null>(null);
  const [tsLoading, setTsLoading] = useState(false);

  // debounce the search query
  const debouncedQuery = useDebounce(query, 300);

  // Reset page when query/sort changes
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, sort]);

  // When no search query - use REDUX/DB
  useEffect(() => {
    if (debouncedQuery) return;
    // Usecase dispatches to the store
    const usecase = new FetchProtocolsUsecase(dispatch);
    usecase.execute({ sort, page, per_page: 12, q: query });
  }, [debouncedQuery, sort, page, dispatch]);

  // When search query present — use Typesense directly
  useEffect(() => {
    if (!debouncedQuery) {
      setTsHits([]);
      setTsFound(null);
      return;
    }
    let cancelled = false;
    setTsLoading(true);

    searchProtocols(debouncedQuery, { sort, page, perPage: 12 })
      .then((result) => {
        if (!cancelled) {
          console.log(result.hits);

          setTsHits(result.hits as TypesenseHit<TypesenseProtocolDocument>[]);
          setTsFound(result.found);
        }
      })
      .finally(() => {
        if (!cancelled) setTsLoading(false);
      })
      .catch((err) => console.log(err));

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, sort, page]);

  const isSearching = !!debouncedQuery;
  const protocols = isSearching ? tsHits : dbProtocols;
  const loading = isSearching ? tsLoading : dbLoading;
  const resultCount = isSearching ? (tsFound ?? undefined) : meta.found;
  const lastPage = meta.last_page ?? 1;

  return (
    <PageShell>
      <div className="mb-10 animate-fade-up">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
          <div>
            <h1 className="font-serif text-4xl text-stone-100 leading-tight mb-2">
              Wellness Protocols
            </h1>
            <p className="text-stone-500 text-base max-w-lg">
              Evidence-based health protocols shared and reviewed by the
              community.
            </p>
          </div>
          <Link to="/protocols/new" className="btn-primary shrink-0">
            + New Protocol
          </Link>
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
          sortOptions={SORT_OPTIONS}
        />
      </div>

      {!loading && !dbError && !protocols.length ? (
        <EmptyState
          icon="🌿"
          title="No protocols found"
          description={
            debouncedQuery
              ? `No results for "${debouncedQuery}"`
              : "Be the first to share a wellness protocol."
          }
          action={
            <Link to="/protocols/new" className="btn-primary">
              Create Protocol
            </Link>
          }
        />
      ) : (
        <ProtocolList protocols={protocols} loading={loading} error={dbError} />
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

export default HomePage;
