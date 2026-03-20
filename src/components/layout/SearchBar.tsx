import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../../config/firebase';
import axios from 'axios';

interface ResultadoBusqueda {
  idFirebase: string;
  titulo: string;
  poster: string;
  year: string;
}

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

function SearchBar() {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const [catalogoLocal, setCatalogoLocal] = useState<Record<number, string>>({});

  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIds = async () => {
      const snapshot = await get(ref(db, 'peliculas'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const diccionario: Record<number, string> = {};

        Object.entries(data as Record<string, { tmdb_id?: number }>).forEach(([firebaseId, peli]) => {
          if (peli.tmdb_id) {
            diccionario[peli.tmdb_id] = firebaseId;
          }
        });

        setCatalogoLocal(diccionario);
      }
    };
    fetchIds();
  }, []);

  useEffect(() => {
    if (termino.trim().length < 2) {
      setResultados([]);
      return;
    }

    const timer = setTimeout(async () => {
      setBuscando(true);
      try {
        // console.log(`[BUSCADOR] Buscando en TMDB: "${termino}"`);
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?query=${termino}&language=es-ES&api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        );

        const coincidencias = res.data.results
          .filter((peliTMDB: TMDBMovie) => catalogoLocal[peliTMDB.id])
          .map((peliTMDB: TMDBMovie) => ({
            idFirebase: catalogoLocal[peliTMDB.id],
            titulo: peliTMDB.title,
            poster: peliTMDB.poster_path ? `https://image.tmdb.org/t/p/w92${peliTMDB.poster_path}` : '',
            year: peliTMDB.release_date ? peliTMDB.release_date.substring(0, 4) : ''
          }));

        // console.log(`[BUSCADOR] Coincidencias encontradas: ${coincidencias.length}`);

        setResultados(coincidencias);
        setMostrar(true);
      } catch (error) {
        console.error("[BUSCADOR] Error buscando en TMDB:", error);
      } finally {
        setBuscando(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [termino, catalogoLocal]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setMostrar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const irAPelicula = (idFirebase: string) => {
    setMostrar(false);
    setTermino('');
    navigate(`/pelicula/${idFirebase}`);
  };

  return (
    <div className="position-relative me-lg-3 my-2 my-lg-0" ref={wrapperRef} style={{ maxWidth: '300px', width: '100%' }}>
      <div className="input-group">
        <span className="input-group-text bg-dark border-secondary text-secondary">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control bg-dark text-white border-secondary shadow-none"
          placeholder="Título de la película..."
          value={termino}
          onChange={(e) => {
            setTermino(e.target.value);
            setMostrar(true);
          }}
          onFocus={() => termino.length >= 2 && setMostrar(true)}
        />
        {termino && (
          <span
            className="input-group-text bg-dark border-secondary text-secondary hover-efecto"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setTermino('');
              setResultados([]);
            }}
          >
            <i className="bi bi-x-lg"></i>
          </span>
        )}
      </div>

      {mostrar && termino.length >= 2 && (
        <div
          className="position-absolute w-100 mt-1 bg-dark border border-secondary rounded shadow-lg overflow-hidden"
          style={{ top: '100%', zIndex: 1050 }}
        >
          {buscando ? (
            <div className="p-3 text-center text-secondary small">
              <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
              Buscando...
            </div>
          ) : resultados.length > 0 ? (
            <div className="list-group list-group-flush">
              {resultados.map((peli) => (
                <button
                  key={peli.idFirebase}
                  onClick={() => irAPelicula(peli.idFirebase)}
                  className="list-group-item list-group-item-action bg-dark text-white border-bottom border-secondary d-flex align-items-center gap-3 p-2"
                >
                  {peli.poster ? (
                    <img src={peli.poster} alt={peli.titulo} style={{ width: '40px', borderRadius: '4px' }} />
                  ) : (
                    <div className="bg-secondary d-flex justify-content-center align-items-center rounded" style={{ width: '40px', height: '60px' }}>
                      <i className="bi bi-film text-white"></i>
                    </div>
                  )}
                  <div className="d-flex flex-column text-start overflow-hidden w-100">
                    <span className="fw-bold text-truncate">{peli.titulo}</span>
                    <span className="text-secondary small">{peli.year}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-secondary small">
              No tenemos esta película en el catálogo.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
