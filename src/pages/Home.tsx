import { useState } from 'react';
import MovieList from "../components/movies/MovieList";
import MovieFilter from "../components/movies/MovieFilter";

function Home() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  return (
    <div className="container mt-4">
      <h2 className="text-white fw-bold mb-1">Catálogo de Películas</h2>
      <p className="text-secondary mb-4">Explora nuestra selección destacada</p>

      <MovieFilter
        categoriaActual={categoriaActiva}
        setCategoria={setCategoriaActiva}
      />

      <MovieList filtro={categoriaActiva} />
    </div>
  );
}

export default Home;