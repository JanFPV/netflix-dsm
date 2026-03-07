import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import type { Pelicula } from '../types';

function Favorites() {
  const { user } = useAuth(); // Sacamos al usuario logueado
  const [favoritos, setFavoritos] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const favRef = ref(db, `favoritos/${user.uid}`);

    const unsubscribe = onValue(favRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convertir a un array fácil de leer
        const listaFavoritos = Object.values(data) as Pelicula[];
        setFavoritos(listaFavoritos);
      } else {
        // Si no hay datos, ponemos el array vacío
        setFavoritos([]);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Si no está logueado
  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="mb-4">Mi Lista</h2>
        <p className="lead">Inicia sesión para ver tus películas favoritas.</p>
        <Link to="/login" className="btn btn-danger mt-2">Ir a Iniciar Sesión</Link>
      </div>
    );
  }

  // Mientras Firebase piensa
  if (cargando) return <div className="text-center mt-5">Cargando tu lista...</div>;

  // Logueado pero sin favoritos
  if (favoritos.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="mb-4">Mis Películas Favoritas <i className="bi bi-heart-fill text-danger"></i></h2>
        <div className="alert alert-dark d-inline-block border-secondary">
          Aún no tienes películas favoritas. ¡Ve al catálogo y añade algunas!
        </div>
      </div>
    );
  }

  // Con favoritos
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mis Películas Favoritas <i className="bi bi-heart-fill text-danger"></i></h2>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {favoritos.map((peli) => (
          <div key={peli.id} className="col">
            <div className="card h-100 bg-dark text-white border-secondary shadow-sm">
              <img
                src={peli.portada_url}
                className="card-img-top"
                alt={peli.titulo}
                style={{ aspectRatio: '2/3', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h6 className="card-title text-truncate" title={peli.titulo}>{peli.titulo}</h6>
                <Link to={`/pelicula/${peli.id}`} className="btn btn-outline-danger btn-sm mt-auto w-100">
                  Ver detalles
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;