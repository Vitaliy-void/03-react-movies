import { isAxiosError } from "axios";
import { useCallback, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import css from "./App.module.css";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selected, setSelected] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const hasMovies = movies.length > 0;

  const onSearch = useCallback(async (query: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(null);
    setMovies([]);
    setLoading(true);

    try {
      const results = await fetchMovies(query, controller.signal);
      if (!results.length) {
        toast("No movies found for your request.");
      }
      setMovies(results);
    } catch (err: unknown) {
   if (isAxiosError(err) && err.code === "ERR_CANCELED") {
     return;
   }
   setError("fetch_error");
 } finally {
      setLoading(false);
    }
  }, []);

  const content = useMemo(() => {
    if (loading) return <Loader />;
    if (error) return <ErrorMessage />;
    if (hasMovies) return <MovieGrid movies={movies} onSelect={setSelected} />;
    return null;
  }, [loading, error, hasMovies, movies]);

  return (
    <>
      <SearchBar onSubmit={onSearch} />
      <main className={css.app}>{content}</main>
      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
      <Toaster position="top-right" />
    </>
  );
}