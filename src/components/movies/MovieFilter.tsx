interface MovieFilterProps {
  categoriaActual: string;
  setCategoria: (categoria: string) => void;
}

function MovieFilter({ categoriaActual, setCategoria }: MovieFilterProps) {
  const categorias = ["Todas", "Acción", "Ciencia Ficción", "Comedia", "Drama", "Animación"];

  return (
    <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
      {categorias.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategoria(cat)}
          className={`btn rounded-pill px-4 fw-bold shadow-sm ${
            categoriaActual === cat ? 'btn-danger' : 'btn-outline-light'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default MovieFilter;