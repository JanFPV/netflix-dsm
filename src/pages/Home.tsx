import MovieList from "../components/movies/MovieList";

function Home() {
  return (
    <div className="container mt-4">
      <h2 className="text-white fw-bold mb-1">Catálogo de Películas</h2>
      <p className="text-secondary mb-4">Explora nuestra selección destacada</p>

      <MovieList />
    </div>
  );
}

export default Home;