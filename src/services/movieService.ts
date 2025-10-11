import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Movie } from "../types/movie";

const api: AxiosInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTA2Y2Y4NGFmYTI5MzM0M2E5MDA1MWFjOTI1ZTZhMSIsIm5iZiI6MTc2MDAxNDY4MC43OCwic3ViIjoiNjhlN2IxNTg5ZTgzMWMyOWUzYjdhYzI5Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.UViDICogoHPWc3teCKyIF6nlppc7W4RB3eicJwaISqE`,
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


// import axios from "axios";
// import type { AxiosInstance } from "axios";
// import type { Movie } from "../types/movie";

// const token = import.meta.env.VITE_TMDB_TOKEN?.trim(); // прибираємо випадкові пробіли
// if (!token) {
//   // зупиняємось одразу — інакше прилетить 401
//   throw new Error("Missing VITE_TMDB_TOKEN (TMDB v4 Read Access Token)");
// }

// const api: AxiosInstance = axios.create({
//   baseURL: "https://api.themoviedb.org/3",
//   headers: {
//     Authorization: `Bearer ${token}`,        // має бути довгий v4 JWT (починається з "eyJ")
//     Accept: "application/json",
//     "Content-Type": "application/json;charset=utf-8",
//   },
// });

// // Діагностика тільки у dev: показує кінцевий URL і наявність заголовка
// if (import.meta.env.DEV) {
//   api.interceptors.request.use(cfg => {
//     const url = axios.getUri(cfg);
//     const hasAuth = !!cfg.headers?.Authorization;
//     console.debug("[TMDB] GET", url, "| Auth header:", hasAuth ? "YES" : "NO");
//     return cfg;
//   });
// }

// interface SearchResponse {
//   page: number;
//   results: Movie[];
//   total_pages: number;
//   total_results: number;
// }

// export async function fetchMovies(query: string, signal?: AbortSignal): Promise<Movie[]> {
//   const { data } = await api.get<SearchResponse>("/search/movie", {
//     params: { query, include_adult: false, language: "en-US", page: 1 },
//     signal,
//   });
//   return data.results;
// }

// export function tmdbImg(path: string | null, size: "w500" | "original" = "w500") {
//   if (!path) return "";
//   return `https://image.tmdb.org/t/p/${size}${path}`;
// }
