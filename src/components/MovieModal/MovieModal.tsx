import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./MovieModal.module.css";
import type { Movie } from "../../types/movie";
import { tmdbImg } from "../../services/movieService";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const modalRoot = document.getElementById("modal-root") as HTMLElement;

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={onBackdrop}>
      <div className={css.modal}>
        <button className={css.closeButton} aria-label="Close modal" onClick={onClose}>
          &times;
        </button>

        <img
          src={tmdbImg(movie.backdrop_path, "original") || tmdbImg(movie.poster_path, "original")}
          alt={movie.title}
          className={css.image}
        />

        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview || "No overview available."}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date || "—"}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average?.toFixed(1) ?? "—"}/10
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
}