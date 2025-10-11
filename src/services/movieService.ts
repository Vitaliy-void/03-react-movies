
import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Movie } from "../types/movie";

const token = import.meta.env.VITE_TMDB_TOKEN?.trim();
if (!token) {
  throw new Error("Missing VITE_TMDB_TOKEN (TMDB v4 Read Access Token)");
}

const api: AxiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${token}`,       
    Accept: "application/json",
    "Content-Type": "application/json;charset=utf-8",
  },
});

if (import.meta.env.DEV) {
  api.interceptors.request.use(cfg => {
    const url = axios.getUri(cfg);
    const hasAuth = !!cfg.headers?.Authorization;
    console.debug("[TMDB] GET", url, "| Auth header:", hasAuth ? "YES" : "NO");
    return cfg;
  });
}

interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(query: string, signal?: AbortSignal): Promise<Movie[]> {
  const { data } = await api.get<SearchResponse>("/search/movie", {
    params: { query, include_adult: false, language: "en-US", page: 1 },
    signal,
  });
  return data.results;
}

export function tmdbImg(
  path: string | null,
  size: "w500" | "original" = "w500"
): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

