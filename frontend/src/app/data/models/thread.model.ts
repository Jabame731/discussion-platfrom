import type { ThreadSort } from "./wellness-platform.model";

export interface ThreadListParams {
  sort?: ThreadSort;
  page?: number;
  per_page?: number;
}

export interface ThreadCreateData {
  title: string;
  body: string;
  protocol_id?: number;
  tags?: string[];
}

export interface CreateThreadPayload {
  title: string;
  body: string;
  protocol_id?: number;
  tags?: string[];
}

export interface UpdateThreadPayload {
  title?: string;
  body?: string;
  tags?: string[];
  status?: "open" | "closed" | "pinned";
}
