import { Link } from 'react-router-dom';
import type { Pelicula } from '../../types';

interface MovieCardProps {
  pelicula: Pelicula;
}

function MovieCard({ pelicula }: MovieCardProps) {
  return (
    <div className="card bg-dark text-white h-100 border-secondary shadow-sm hover-efecto">
      <img
        src={pelicula.portada_url}
        className="card-img-top"
        alt={pelicula.titulo}
        style={{ aspectRatio: '2/3', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h6 className="card-title fw-bold text-truncate">{pelicula.titulo}</h6>
        <span className="badge bg-danger align-self-start mb-3">{pelicula.categoria}</span>
        <Link to={`/pelicula/${pelicula.id}`} className="btn btn-outline-light btn-sm mt-auto w-100">
          Ver detalles
        </Link>
      </div>
    </div>
  );
}

export default MovieCard;