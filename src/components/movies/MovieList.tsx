import { useEffect, useState } from 'react';
import axios from 'axios';
import { ref, get } from 'firebase/database';
import { db } from '../../config/firebase';
import type { Pelicula, PeliculaFirebase, PeliculaTMDB } from '../../types';

// API Key de TMDB
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function MovieList() {
  // Aquí guardamos las películas con datos de Firebase + TMDB
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPeliculas = async () => {
      try {
        // Pedimos a Firebase la lista de películas
        const snapshot = await get(ref(db, 'peliculas'));

        if (snapshot.exists()) {
          const datosFirebase = snapshot.val();
          const listaPromesas = [];

          // Recorremos cada película que tenemos apuntada
          for (const idFirebase in datosFirebase) {
            const peliFB: PeliculaFirebase = datosFirebase[idFirebase];

            // Por cada una, vamos a TMDB a pedir su póster y sinopsis en Español
            const promesa = axios.get<PeliculaTMDB>(
              `https://api.themoviedb.org/3/movie/${peliFB.tmdb_id}?language=es-ES&api_key=${TMDB_API_KEY}`
            ).then(respuesta => {
              const peliTMDB = respuesta.data;

              // Fusionamos los datos de Firebase y TMDB en un solo objeto
              const peliculaCompleta: Pelicula = {
                id: idFirebase,
                tmdb_id: peliFB.tmdb_id,
                categoria: peliFB.categoria,
                titulo: peliTMDB.title,
                sinopsis: peliTMDB.overview,
                portada_url: `https://image.tmdb.org/t/p/w500${peliTMDB.poster_path}`
              };
              return peliculaCompleta;
            });

            listaPromesas.push(promesa);
          }

          // Esperamos a que TMDB nos devuelva todo
          const peliculasFinales = await Promise.all(listaPromesas);
          setPeliculas(peliculasFinales);
        }
      } catch (error) {
        console.error("Error cargando el catálogo:", error);
      } finally {
        // Quitamos el mensaje de Cargando
        setCargando(false);
      }
    };

    cargarPeliculas();
  }, []);

  // Mientras esperamos a TMDB...
  if (cargando) {
    return (
      <div className="text-center text-white mt-5">
        <div className="spinner-border text-danger mb-3" role="status"></div>
        <h5>Cargando catálogo... 🍿</h5>
      </div>
    );
  }

  // Si no hay películas en Firebase
  if (peliculas.length === 0) {
    return <h5 className="text-secondary mt-4">No hay películas en el catálogo todavía.</h5>;
  }

  // Si todo ha ido bien, Bootstrap
  return (
    <div className="row g-4 mt-2">
      {peliculas.map((peli) => (
        <div key={peli.id} className="col-6 col-md-4 col-lg-3">
          <div className="card bg-dark text-white h-100 border-secondary shadow-sm hover-efecto">
            <img
              src={peli.portada_url}
              className="card-img-top"
              alt={peli.titulo}
              style={{ objectFit: 'cover', height: '350px' }}
            />
            <div className="card-body d-flex flex-column">
              <h6 className="card-title fw-bold text-truncate">{peli.titulo}</h6>
              <span className="badge bg-danger align-self-start mb-3">{peli.categoria}</span>
              <button className="btn btn-outline-light btn-sm mt-auto w-100">
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieList;