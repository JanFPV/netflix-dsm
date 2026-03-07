import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ref, get, set, remove } from 'firebase/database';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import type { Pelicula, PeliculaFirebase, PeliculaTMDB } from '../types';

function MovieDetail() {
  // Si la URL es /pelicula/peli01, id valdrá "peli01"
  const { id } = useParams();
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [fondoDecorativo, setFondoDecorativo] = useState<string>('');
  const [cargando, setCargando] = useState(true);

  // Obtener usuario
  const { user } = useAuth();
  const navigate = useNavigate();
  const [esFavorito, setEsFavorito] = useState(false);

  useEffect(() => {
    const cargarDetalles = async () => {
      try {
        // Buscamos en Firebase solo la película con este ID
        const snapshot = await get(ref(db, `peliculas/${id}`));

        if (snapshot.exists()) {
          const peliFB: PeliculaFirebase = snapshot.val();

          // Con su tmdb_id, pedimos a TMDB toda la info
          const respuesta = await axios.get<PeliculaTMDB & { backdrop_path: string }>(
            `https://api.themoviedb.org/3/movie/${peliFB.tmdb_id}?language=es-ES&api_key=${import.meta.env.VITE_TMDB_API_KEY}`
          );

          const peliTMDB = respuesta.data;

          // Objeto final
          setPelicula({
            id: id as string,
            tmdb_id: peliFB.tmdb_id,
            categoria: peliFB.categoria,
            titulo: peliTMDB.title,
            sinopsis: peliTMDB.overview,
            portada_url: `https://image.tmdb.org/t/p/w500${peliTMDB.poster_path}`,
          });

          // Guardamos la imagen horizontal
          if (peliTMDB.backdrop_path) {
            setFondoDecorativo(`https://image.tmdb.org/t/p/original${peliTMDB.backdrop_path}`);
          }

          // Comprobar si es favorito
          if (user) {
            const favRef = ref(db, `favoritos/${user.uid}/${id}`);
            const favSnapshot = await get(favRef);
            setEsFavorito(favSnapshot.exists());
          }
        }
      } catch (error) {
        console.error("Error cargando detalles:", error);
      } finally {
        setCargando(false);
      }
    };

    if (id) cargarDetalles();
  }, [id, user]);

  if (cargando) return <div className="text-center text-white mt-5">Cargando detalles...</div>;
  if (!pelicula) return <div className="text-center text-white mt-5">Película no encontrada.</div>;

  const toggleFavorito = async () => {
    if (!user) {
      // Si no está logueado, lo mandamos al login amablemente
      navigate('/login');
      return;
    }

    if (!pelicula) return;

    // Este usuario y esta película concreta
    const favRef = ref(db, `favoritos/${user.uid}/${pelicula.id}`);

    try {
      if (esFavorito) {
        await remove(favRef); // Si ya era favorita, la borramos
        setEsFavorito(false);
      } else {
        await set(favRef, pelicula); // Si no lo era, guardamos el objeto película entero
        setEsFavorito(true);
      }
    } catch (error) {
      console.error("Error al modificar favoritos:", error);
    }
  };

  return (
    <div>
      <div
        className="position-relative d-flex align-items-end"
        style={{
            height: '400px',
            backgroundImage: fondoDecorativo ? `url("${fondoDecorativo}")` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#141414'
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to top, #141414 10%, transparent 100%)' }}></div>

        <div className="container position-relative pb-4 z-1">
          <h1 className="text-white fw-bold display-4 text-shadow">{pelicula.titulo}</h1>
          <span className="badge bg-danger fs-6 mb-3">{pelicula.categoria}</span>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-3 d-none d-md-block">
            <img src={pelicula.portada_url} alt={pelicula.titulo} className="img-fluid rounded shadow border border-secondary" />
          </div>
          <div className="col-md-9 text-white">
            <h4 className="fw-bold mb-3">Sinopsis</h4>
            <p className="lead text-secondary">{pelicula.sinopsis || "No hay sinopsis disponible."}</p>

            <div className="d-flex gap-3 mt-4">
              <Link to="/" className="btn btn-outline-light">
                <i className="bi bi-arrow-left me-2"></i> Volver al Catálogo
              </Link>
              {/* Botón dinámico de favoritos */}
              <button
                onClick={toggleFavorito}
                className={`btn ${esFavorito ? 'btn-danger' : 'btn-outline-danger'}`}
              >
                <i className={`bi ${esFavorito ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
                {esFavorito ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;