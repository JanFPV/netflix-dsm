import { Link } from 'react-router-dom';
import type { Pelicula } from '../../types';
import StarRating from './StarRating';
import { useMovieStats } from '../../hooks/useMovieStats';

interface MovieCardProps {
  pelicula: Pelicula;
  vistaLista?: boolean;
}

function MovieCard({ pelicula, vistaLista = false }: MovieCardProps) {
  const { ratingMedia, totalReviews } = useMovieStats(pelicula.id);

  if (vistaLista) {
    return (
      <div
        className="card bg-dark text-white border-secondary shadow-sm hover-efecto overflow-hidden flex-row align-items-center"
        style={{ height: '80px' }}
      >
        <div className="position-relative h-100" style={{ width: '130px', minWidth: '130px' }}>
          <img
            src={pelicula.portada_url}
            alt={pelicula.titulo}
            className="w-100 h-100"
            style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
          />
          <div
            className="position-absolute top-0 end-0 h-100 w-100"
            style={{ background: 'linear-gradient(to right, transparent 20%, #212529 100%)' }}
          ></div>
        </div>

        <div className="card-body d-flex flex-row align-items-center p-2 pe-3 gap-3 w-100 min-w-0">
          <div className="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
            <h6 className="card-title fw-bold text-truncate mb-0" title={pelicula.titulo}>
              {pelicula.titulo}
            </h6>
            <span className="badge bg-danger flex-shrink-0">{pelicula.categoria}</span>
          </div>

          <div className="d-flex align-items-center bg-black bg-opacity-25 rounded px-2 py-1 border border-secondary flex-shrink-0 d-none d-sm-flex">
            <StarRating rating={ratingMedia} tamaño="sm" />
            <span className="text-warning fw-bold small ms-1">
              {ratingMedia > 0 ? ratingMedia.toFixed(1) : '-'}
            </span>
            <span className="text-secondary small d-flex align-items-center" style={{ marginLeft: '10px' }}>
              <i className="bi bi-chat-left-text me-1"></i> {totalReviews}
            </span>
          </div>

          <Link to={`/pelicula/${pelicula.id}`} className="btn btn-outline-light btn-sm flex-shrink-0 text-nowrap">
            <span className="d-none d-md-inline">Ver detalles</span>
            <i className="bi bi-play-fill d-inline d-md-none"></i>
          </Link>
        </div>
      </div>
    );
  }

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
          <span className="text-secondary small ms-auto d-flex align-items-center" style={{ marginLeft: '10px' }}>
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