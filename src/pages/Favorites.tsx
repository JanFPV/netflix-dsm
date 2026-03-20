import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/movies/MovieCard';
import type { Pelicula, PeliculaTMDB } from '../types';

function Favorites() {
  const { user } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [favoritosFirebase, setFavoritosFirebase] = useState<any[]>([]);
  const [favoritosCompletos, setFavoritosCompletos] = useState<Pelicula[]>([]);

  const [cargandoDB, setCargandoDB] = useState(true);
  const [cargandoTMDB, setCargandoTMDB] = useState(false);
  const [esLista, setEsLista] = useState(false);

  useEffect(() => {
    if (!user) return;

    const favRef = ref(db, `favoritos/${user.uid}`);

    const unsubscribe = onValue(favRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setFavoritosFirebase(Object.values(data));
      } else {
        setFavoritosFirebase([]);
        setFavoritosCompletos([]);
      }
      setCargandoDB(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (favoritosFirebase.length === 0) return;

    const fetchTMDB = async () => {
      setCargandoTMDB(true);
      try {
        const listaPromesas = favoritosFirebase.map(async (peliFB) => {
          try {
            const respuesta = await axios.get<PeliculaTMDB>(
              `https://api.themoviedb.org/3/movie/${peliFB.tmdb_id}?language=es-ES&api_key=${import.meta.env.VITE_TMDB_API_KEY}`
            );
            const peliTMDB = respuesta.data;

            return {
              id: peliFB.id,
              tmdb_id: peliFB.tmdb_id,
              categoria: peliFB.categoria,
              titulo: peliTMDB.title,
              sinopsis: peliTMDB.overview,
              portada_url: `https://image.tmdb.org/t/p/w500${peliTMDB.poster_path}`,
            } as Pelicula;
          } catch (error) {
            console.warn(`[TMDB] Error al cargar favorito ID ${peliFB.tmdb_id}. Saltando...`);
            console.log(error);
            return null;
          }
        });

        const resultadosConNulos = await Promise.all(listaPromesas);
        const resultadosValidos = resultadosConNulos.filter((peli) => peli !== null) as Pelicula[];

        setFavoritosCompletos(resultadosValidos);
      } catch (error) {
        console.error("Error general cargando favoritos de TMDB:", error);
      } finally {
        setCargandoTMDB(false);
      }
    };

    fetchTMDB();
  }, [favoritosFirebase]);

  // Si no está logueado
  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="mb-4">Mis Películas Favoritas</h2>
        <p className="lead">Inicia sesión para ver tus películas favoritas.</p>
        <Link to="/login" className="btn btn-danger mt-2">Ir a Iniciar Sesión</Link>
      </div>
    );
  }

  // Mientras piensa Firebase o TMDB
  if (cargandoDB || cargandoTMDB) {
    return (
      <div className="text-center text-white mt-5">
        <div className="spinner-border text-danger mb-3" role="status"></div>
        <h5>Cargando tu lista...</h5>
      </div>
    );
  }

  // Logueado pero sin favoritos
  if (favoritosCompletos.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="mb-4 text-white">Mis Películas Favoritas</h2>
        <div className="alert bg-dark text-secondary border border-secondary d-inline-block shadow-sm">
          Aún no tienes películas favoritas. ¡Ve al catálogo y añade algunas!
        </div>
      </div>
    );
  }

  // Con favoritos
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Mis Películas Favoritas</h2>
        <div className="btn-group bg-dark border border-secondary rounded shadow-sm d-none d-md-flex" role="group">
          <button
            className={`btn btn-sm px-3 ${!esLista ? 'btn-secondary text-white' : 'btn-dark text-secondary border-0'}`}
            onClick={() => setEsLista(false)}
            title="Vista de mosaico"
          >
            <i className="bi bi-grid-fill"></i>
          </button>
          <button
            className={`btn btn-sm px-3 ${esLista ? 'btn-secondary text-white' : 'btn-dark text-secondary border-0'}`}
            onClick={() => setEsLista(true)}
            title="Vista de lista"
          >
            <i className="bi bi-list-ul"></i>
          </button>
        </div>
      </div>

      <div className="row g-4 mt-2">
        {favoritosCompletos.map((peli) => (
          <div key={peli.id} className={esLista ? 'col-12' : 'col-6 col-md-4 col-lg-3'}>
            <MovieCard pelicula={peli} vistaLista={esLista} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;