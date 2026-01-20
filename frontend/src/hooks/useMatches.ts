import { useFetch } from "./useFetch";
import type { MatchDTO, Region } from "../types";

interface UseMatchesOptions {
  page?: number;
  take?: number;
  queueId?: string;
  order?: "ASC" | "DESC";
}

export function useMatches(
  region: Region | null,
  gameName: string,
  tagLine: string,
  options: UseMatchesOptions = {},
) {
  const { page = 1, take = 10, queueId = "ALL", order = "DESC" } = options;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    take: take.toString(),
    queueId,
    order,
  });

  const url =
    region && gameName && tagLine
      ? `/match/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}?${queryParams}`
      : null;

  // Note: The endpoint returns a PaginatedResponse { data: MatchDTO[], meta: ... }
  // We'll return the whole response and let the consumer access .data
  return useFetch<{ data: MatchDTO[] }>(url, { immediate: !!url }) as any;
}

export default useMatches;
