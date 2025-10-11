import css from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie";
import { tmdbImg } from "../../services/movieService";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (!movies.length) return null;

  return (
    <ul className={css.grid}>
      {movies.map(m => {
  const imgSrc =
    tmdbImg(m.poster_path, "w500") ?? tmdbImg(m.backdrop_path, "w500");

  return (
    <li key={m.id}>
      <div className={css.card} onClick={() => onSelect(m)} role="button">
        {imgSrc ? (
          <img
            className={css.image}
            src={imgSrc}
            alt={m.title}
            loading="lazy"
          />
        ) : (
          // або не рендерити нічого: null
          <div className={css.imageFallback} aria-label="No image available" />
        )}
        <h2 className={css.title}>{m.title}</h2>
      </div>
    </li>
  );
})}
    </ul>
  );
}   