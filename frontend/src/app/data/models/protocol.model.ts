import type { ProtocolSort } from "./wellness-platform.model";

export type CreateProtocolStatus = "published" | "draft";
export type UpdateProtocolStatus = CreateProtocolStatus | "archived";

export interface ProtocolListParams {
  sort: ProtocolSort;
  page?: number;
  q?: string;
  per_page?: number;
  tags?: string[];
}

export interface CreateProtocolPayload {
  title: string;
  content: string;
  tags?: string[];
  status?: CreateProtocolStatus;
}

export interface UpdateProtocolPayload extends Omit<
  Partial<CreateProtocolPayload>,
  "status"
> {
  status?: UpdateProtocolStatus;
}

export interface CreateReviewPayload {
  rating: number;
  feedback?: string;
}
