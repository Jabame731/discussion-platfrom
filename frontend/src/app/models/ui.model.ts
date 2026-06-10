import type { ReactNode } from "react";

export type SizeType = "sm" | "md" | "lg";
export type VoteType = "upvote" | "downvote";

export interface StarsProps {
  rating?: number;
  max?: number;
  size?: SizeType;
  interactive?: boolean;
  onChange?: Function;
}

export interface TagProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
}

export interface SpinnerProps {
  size?: SizeType;
  className?: string;
}

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  type: string;
}

export interface ToastContainerProps {
  toasts: Toast[];
}

export interface UseToastReturn {
  toasts: Toast[];
  toast: (message: string, type?: ToastType) => void;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export interface VoteButtonsProps {
  upvotes: number;
  downvotes: number;
  userVote?: VoteType | null;
  onVote: (vote: VoteType) => void;
  loading?: boolean;
  compact?: boolean;
}

export interface AvatarProps {
  name: string;
  size: "xs" | SizeType;
}

export interface EmptyStateProps {
  icon: string | ReactNode;
  title: string;
  description: string;
  action?: string | ReactNode;
}
