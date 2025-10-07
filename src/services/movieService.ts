import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Movie } from "../types/movie";

const api: AxiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});

interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(
  query: string,
  signal?: AbortSignal
): Promise<Movie[]> {
  const { data } = await api.get<SearchResponse>("/search/movie", {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page: 1,
    },
    signal,
  });
  return data.results;
}

export function tmdbImg(path: string | null, size: "w500" | "original" = "w500") {
  if (!path) return "";
  const base = "https://image.tmdb.org/t/p";
  return `${base}/${size}${path}`;
}