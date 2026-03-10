interface StarRatingProps {
  rating: number; // Nota actual
  interactivo?: boolean; // Clicable
  onRatingChange?: (nuevaNota: number) => void; // Función que se ejecuta al hacer clic
  tamaño?: 'sm' | 'md' | 'lg'; // Tamaño de las estrellas
}

function StarRating({ rating, interactivo = false, onRatingChange, tamaño = 'md' }: StarRatingProps) {
  // Ajustar el tamaño según la prop
  const fontSizes = { sm: '1rem', md: '1.5rem', lg: '2rem' };
  const size = fontSizes[tamaño];

  const handleClick = (nota: number) => {
    if (interactivo && onRatingChange) {
      onRatingChange(nota);
    }
  };

  // Dibujar 5 estrellas
  const renderEstrellas = () => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      let claseIcono = 'bi-star text-secondary'; // Estrella vacía

      if (rating >= i) {
        claseIcono = 'bi-star-fill text-warning'; // Estrella llena
      } else if (rating >= i - 0.5) {
        claseIcono = 'bi-star-half text-warning'; // Media estrella
      }

      estrellas.push(
        <i
          key={i}
          className={`bi ${claseIcono}`}
          style={{
            fontSize: size,
            cursor: interactivo ? 'pointer' : 'default',
            marginRight: '2px'
          }}
          onClick={() => handleClick(i)}
          // Permite hover si es interactivo
          onMouseEnter={(e) => interactivo && (e.currentTarget.style.transform = 'scale(1.2)')}
          onMouseLeave={(e) => interactivo && (e.currentTarget.style.transform = 'scale(1)')}
        ></i>
      );
    }
    return estrellas;
  };

  return (
    <div className="d-flex align-items-center" style={{ transition: 'all 0.2s' }}>
      {renderEstrellas()}
    </div>
  );
}

export default StarRating;