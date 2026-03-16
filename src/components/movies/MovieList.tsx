import MovieCard from './MovieCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRef, useCallback } from 'react';
import { useInfinitePeliculas } from '../../hooks/useInfinitePeliculas';
import type { Pelicula, PeliculaTMDB } from '../../types';

interface MovieListProps {
  filtro: string;
}

function MovieList({ filtro }: MovieListProps) {
  // Llamar al Hook (pide en lotes de 12)
  const {
    peliculas: peliculasFirebase,
    cargando: cargandoFirebase,
    cargarMas,
    hayMas
  } = useInfinitePeliculas(12);

  // Aquí guardamos las películas con datos de Firebase + TMDB
  const [peliculasCompletas, setPeliculasCompletas] = useState<Pelicula[]>([]);
  const [cargandoTMDB, setCargandoTMDB] = useState(false);

  // Sincronizar TMDB
  useEffect(() => {
    const fetchTMDB = async () => {
      // Solo pedimos a TMDB las películas del nuevo lote que aún no tenemos
      const nuevasParaDescargar = peliculasFirebase.filter(
        (peliFB) => !peliculasCompletas.some((peliC) => peliC.id === peliFB.id)
      );

      if (nuevasParaDescargar.length === 0) return;

      setCargandoTMDB(true);
      try {
        const listaPromesas = nuevasParaDescargar.map(async (peliFB) => {
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
        });

        const resultadosNuevos = await Promise.all(listaPromesas);
        // Concatenamos las nuevas a las que ya teníamos
        setPeliculasCompletas((prev) => [...prev, ...resultadosNuevos]);
      } catch (error) {
        console.error("Error cargando de TMDB:", error);
      } finally {
        setCargandoTMDB(false);
      }
    };

    fetchTMDB();
  }, [peliculasFirebase, peliculasCompletas]); // Se ejecuta cuando el hook nos da un lote nuevo

  // Detector de scroll
  const observer = useRef<IntersectionObserver | null>(null);

  const centinelaRef = useCallback((node: HTMLDivElement) => {
      if (cargandoFirebase || cargandoTMDB) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hayMas) {
          cargarMas();
        }
      });

      if (node) observer.current.observe(node);
    },
    [cargandoFirebase, cargandoTMDB, hayMas, cargarMas]
  );
  // Filtramos sobre el array que tiene los datos completos
  const peliculasFiltradas = filtro === 'Todas'
    ? peliculasCompletas
    : peliculasCompletas.filter((peli) => peli.categoria === filtro);

  // Pantalla de carga inicial (solo si está totalmente vacío)
  if (peliculasCompletas.length === 0 && (cargandoFirebase || cargandoTMDB)) {
    return (
      <div className="text-center text-white mt-5">
        <div className="spinner-border text-danger mb-3" role="status"></div>
        <h5>Cargando catálogo...</h5>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="row g-4">
        {peliculasFiltradas.length === 0 && !cargandoFirebase && !cargandoTMDB ? (
          <h5 className="text-secondary mt-4">No hay películas de {filtro} todavía.</h5>
        ) : (
          peliculasFiltradas.map((peli) => (
            <div key={peli.id} className="col-6 col-md-4 col-lg-3">
              <MovieCard pelicula={peli} />
            </div>
          ))
        )}
      </div>

      <div ref={centinelaRef} className="mt-4 p-4 text-center">
        {(cargandoFirebase || cargandoTMDB) && (
          <div className="text-secondary">
            <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
            Cargando más películas...
          </div>
        )}

        {!hayMas && peliculasCompletas.length > 0 && (
          <p className="text-muted mt-3">Has llegado al final del catálogo</p>
        )}
      </div>
    </div>
  );
}

export default MovieList;