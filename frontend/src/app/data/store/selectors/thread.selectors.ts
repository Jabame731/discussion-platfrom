import type { RootState } from "../index";

export const selectThreadList = (s: RootState) => s.threads.items;
export const selectThreadMeta = (s: RootState) => s.threads.meta;
export const selectThreadListLoading = (s: RootState) => s.threads.listLoading;
export const selectThreadListError = (s: RootState) => s.threads.listError;

export const selectCurrentThread = (s: RootState) => s.threads.current;
export const selectThreadLoading = (s: RootState) => s.threads.detailLoading;
export const selectThreadError = (s: RootState) => s.threads.detailError;

export const selectThreadSaving = (s: RootState) => s.threads.saving;
export const selectThreadSaveError = (s: RootState) => s.threads.saveError;
