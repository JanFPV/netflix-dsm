import { Link } from 'react-router-dom';
import type { Pelicula } from '../../types';
import StarRating from './StarRating';
import { useMovieStats } from '../../hooks/useMovieStats';

interface MovieCardProps {
  pelicula: Pelicula;
}

function MovieCard({ pelicula }: MovieCardProps) {
  // Sacar la media y el total usando Hook
  const { ratingMedia, totalReviews } = useMovieStats(pelicula.id);

  return (
    <div className="card bg-dark text-white h-100 border-secondary shadow-sm hover-efecto">
      <img
        src={pelicula.portada_url}
        className="card-img-top"
        alt={pelicula.titulo}
        style={{ aspectRatio: '2/3', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h6 className="card-title fw-bold text-truncate" title={pelicula.titulo}>{pelicula.titulo}</h6>
        <span className="badge bg-danger align-self-start mb-2">{pelicula.categoria}</span>

        <div className="d-flex align-items-center mb-3 mt-auto bg-black bg-opacity-25 rounded p-1 border border-secondary">
          <StarRating rating={ratingMedia} tamaño="sm" />
          <span className="text-warning fw-bold small ms-1">
            {ratingMedia > 0 ? ratingMedia.toFixed(1) : '-'}
          </span>
          <span className="text-secondary small ms-auto d-flex align-items-center">
            <i className="bi bi-chat-left-text me-1"></i> {totalReviews}
          </span>
        </div>

        <Link to={`/pelicula/${pelicula.id}`} className="btn btn-outline-light btn-sm w-100">
          Ver detalles
        </Link>
      </div>
    </div>
  );
}

export default MovieCard;