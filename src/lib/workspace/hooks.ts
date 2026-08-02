// ============================================================
// Workspace React Query hooks — caching, pagination, mutations.
// ============================================================

import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import * as api from "./api";
import type { ListQuery } from "./types";

export function useUserId(): string | undefined {
  return useAuth().user?.id;
}

const STALE = 60_000;

export function useKundlis(q: api.KundliQuery = {}) {
  const uid = useUserId();
  return useQuery({
    queryKey: ["ws", "kundlis", uid, q],
    enabled: !!uid,
    staleTime: STALE,
    placeholderData: keepPreviousData,
    queryFn: () => api.listKundlis(uid!, q),
  });
}

export function useFamily(q: ListQuery = {}) {
  const uid = useUserId();
  return useQuery({
    queryKey: ["ws", "family", uid, q],
    enabled: !!uid,
    staleTime: STALE,
    placeholderData: keepPreviousData,
    queryFn: () => api.listFamily(uid!, q),
  });
}

export function useReports(q: api.ReportQuery = {}) {
  const uid = useUserId();
  return useQuery({
    queryKey: ["ws", "reports", uid, q],
    enabled: !!uid,
    staleTime: STALE,
    placeholderData: keepPreviousData,
    queryFn: () => api.listReports(uid!, q),
  });
}

export function useDownloads(q: ListQuery = {}) {
  const uid = useUserId();
  return useQuery({
    queryKey: ["ws", "downloads", uid, q],
    enabled: !!uid,
    staleTime: STALE,
    placeholderData: keepPreviousData,
    queryFn: () => api.listDownloads(uid!, q),
  });
}

export function useHoroscopeHistory(q: api.HoroscopeQuery = {}) {
  const uid = useUserId();
  return useQuery({
    queryKey: ["ws", "horoscope", uid, q],
    enabled: !!uid,
    staleTime: STALE,
    placeholderData: keepPreviousData,
    queryFn: () => api.listHoroscopeHistory(uid!, q),
  });
}

export function useWorkspaceAnalytics() {
  const uid = useUserId();
  return useQuery({
    queryKey: ["ws", "analytics", uid],
    enabled: !!uid,
    staleTime: STALE,
    queryFn: () => api.getAnalytics(uid!),
  });
}

export function useDevices() {
  const uid = useUserId();
  return useQuery({
    queryKey: ["ws", "devices", uid],
    enabled: !!uid,
    staleTime: STALE,
    queryFn: () => api.listDevices(uid!),
  });
}

export function useActivity(limit = 20) {
  const uid = useUserId();
  return useQuery({
    queryKey: ["ws", "activity", uid, limit],
    enabled: !!uid,
    staleTime: STALE,
    queryFn: () => api.listActivity(uid!, limit),
  });
}

export function useGlobalSearch(term: string) {
  const uid = useUserId();
  return useQuery({
    queryKey: ["ws", "search", uid, term],
    enabled: !!uid && term.trim().length >= 2,
    staleTime: 15_000,
    queryFn: () => api.globalSearch(uid!, term),
  });
}

/** Invalidate every workspace query after a mutation. */
export function useWorkspaceMutation<TArgs, TResult>(fn: (args: TArgs) => Promise<TResult>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ws"] }),
  });
}
