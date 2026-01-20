import { useFetch } from "./useFetch";
import type { SummonerDTO, Region } from "../types";

export function useSummoner(
  region: Region | null,
  gameName: string,
  tagLine: string,
) {
  const url =
    region && gameName && tagLine
      ? `/summoner/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      : null;

  return useFetch<SummonerDTO>(url, { immediate: !!url });
}

export default useSummoner;
