import axios, { type InternalAxiosRequestConfig } from "axios";
import Typsense from "typesense";
import type { ProtocolListParams } from "./protocol.model";
import type {
  AuthResponse,
  LoginPayload,
  PaginatedResponse,
  Protocol,
  RegisterPayload,
  Review,
  SearchOptions,
  Thread,
  TypesenseProtocolDocument,
  TypesenseSearchResult,
  TypesenseThreadDocument,
  User,
  VoteResponse,
} from "./wellness-platform.model";
import type { ReviewCreateData } from "./review.model";
import type { ThreadCreateData, ThreadListParams } from "./thread.model";
import type { CommentCreateData } from "./comment.model";

const BASE_URL = import.meta.env.VITE_API_URL;
const TYPESENSE_HOST = import.meta.env.VITE_TYPESENSE_HOST;
const TYPESENSE_PORT = import.meta.env.VITE_TYPESENSE_PORT;
const TYPESENSE_PROTOCOL = import.meta.env.VITE_TYPESENSE_PROTOCOL;
const TYPESENSE_SEARCH_KEY = import.meta.env.VITE_TYPESENSE_SEARCH_KEY;

// Laravel API
export const api = axios.create({
  baseURL: (BASE_URL as string) || "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Typesense Client
export const typesenseClient = new Typsense.Client({
  nodes: [
    {
      host: TYPESENSE_HOST as string,
      port: Number(TYPESENSE_PORT),
      protocol: TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: TYPESENSE_SEARCH_KEY,
  connectionTimeoutSeconds: 5,
});

// Typesense search helpers
export const searchProtocols = async (
  query: string,
  options: SearchOptions = {},
): Promise<TypesenseSearchResult<TypesenseProtocolDocument>> => {
  const sortMap: Record<string, string> = {
    recent: "created_at:desc",
    most_reviewed: "reviews_count:desc",
    top_rated: "average_rating:desc",
    most_upvoted: "upvotes_count:desc",
  };
  const sortBy = sortMap[options.sort ?? "recent"] ?? "created_at:desc";

  return typesenseClient
    .collections("protocols")
    .documents()
    .search({
      q: query || "*",
      query_by: "title,content,tags",
      sort_by: sortBy,
      per_page: options.perPage ?? 15,
      page: options.page ?? 1,
    }) as Promise<TypesenseSearchResult<TypesenseProtocolDocument>>;
};
export const searchThreads = async (
  query: string,
  options: SearchOptions = {},
): Promise<TypesenseSearchResult<TypesenseThreadDocument>> => {
  const sortMap: Record<string, string> = {
    recent: "created_at:desc",
    most_upvoted: "upvotes_count:desc",
    most_comments: "comments_count:desc",
  };
  const sortBy = sortMap[options.sort ?? "recent"] ?? "created_at:desc";

  const params: Record<string, unknown> = {
    q: query || "*",
    query_by: "title,body,tags",
    sort_by: sortBy,
    per_page: options.perPage ?? 15,
    page: options.page ?? 1,
  };

  if (options.protocolId) {
    params.filter_by = `protocol_id:=${options.protocolId}`;
  }

  return typesenseClient
    .collections("threads")
    .documents()
    .search(params) as Promise<TypesenseSearchResult<TypesenseThreadDocument>>;
};
