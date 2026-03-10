import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import MovieCard from '../components/movies/MovieCard';
import type { Pelicula } from '../types';

function Favorites() {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!user) return;

    const favRef = ref(db, `favoritos/${user.uid}`);

    const unsubscribe = onValue(favRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setFavoritos(Object.values(data) as Pelicula[]);
      } else {
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

      <div className="row g-4 mt-2">
        {favoritos.map((peli) => (
          <div key={peli.id} className="col-6 col-md-4 col-lg-3">
            <MovieCard pelicula={peli} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;