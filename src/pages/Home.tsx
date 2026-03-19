import { useState } from 'react';
import MovieFilter from '../components/movies/MovieFilter';
import MovieList from '../components/movies/MovieList';

function Home() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [esLista, setEsLista] = useState(false);

  return (
    <div className="container mt-4">
      <h2 className="text-white fw-bold mb-1">Catálogo de Películas</h2>
      <p className="text-secondary mb-4">Explora nuestra selección destacada</p>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div className="flex-grow-1">
          <MovieFilter
            categoriaActual={categoriaActiva}
            setCategoria={setCategoriaActiva}
          />
        </div>
        <div className="btn-group bg-dark border border-secondary rounded shadow-sm flex-shrink-0" role="group">
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
      <MovieList filtro={categoriaActiva} esLista={esLista} />
    </div>
  );
}

export default Home;