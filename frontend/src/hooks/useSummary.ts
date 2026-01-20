import { useFetch } from "./useFetch";
import type { SummaryDTO, Region } from "../types";

export function useSummary(
  region: Region | null,
  gameName: string,
  tagLine: string,
) {
  const url =
    region && gameName && tagLine
      ? `/summary/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      : null;

  return useFetch<SummaryDTO>(url, { immediate: !!url });
}

export default useSummary;
