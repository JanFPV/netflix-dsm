import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ref, onValue, push, set } from 'firebase/database';
import { db } from '../../config/firebase';
import StarRating from './StarRating';
import type { Comentario } from '../../types';

interface CommentSectionProps {
  movieId: string;
}

function CommentSection({ movieId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  // Estados para el formulario nuevo
  const [alias, setAlias] = useState('');
  const [texto, setTexto] = useState('');
  const [rating, setRating] = useState(0);
  const [enviando, setEnviando] = useState(false);

  // Leer comentarios
  useEffect(() => {
    const commentsRef = ref(db, `comentarios/${movieId}`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convertir el objeto de Firebase a un array y ordenar por fecha
        const lista = Object.values(data) as Comentario[];
        lista.sort((a, b) => b.fecha - a.fecha);
        setComentarios(lista);
      } else {
        setComentarios([]);
      }
    });

    return () => unsubscribe();
  }, [movieId]);

  // Guardar un nuevo comentario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0) return;

    setEnviando(true);
    try {
      const commentsRef = ref(db, `comentarios/${movieId}`);
      const nuevoComentarioRef = push(commentsRef);

      const nuevoComentario: Comentario = {
        id: nuevoComentarioRef.key as string,
        usuario_id: user.uid,
        email: user.email || 'sin-email',
        alias: alias || 'Anónimo',
        rating: rating,
        comentario: texto,
        fecha: Date.now(),
      };

      await set(nuevoComentarioRef, nuevoComentario);

      // Limpiar el formulario tras enviar
      setTexto('');
      setRating(0);
      setAlias('');
    } catch (error) {
      console.error("Error al guardar el comentario:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mt-5 border-top border-secondary pt-4">
      <h4 className="mb-4">Reseñas y Comentarios</h4>

      {/* Formulario */}
      {user ? (
        <div className="card bg-dark text-white border-secondary mb-4 p-3 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="d-flex align-items-center mb-3 gap-2">
              <span className="fw-bold">Tu valoración:</span>
              <StarRating rating={rating} interactivo={true} onRatingChange={setRating} />
              {rating === 0 && <span className="text-danger small ms-2">* Obligatorio</span>}
            </div>

            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control bg-secondary text-white border-0"
                  placeholder="Tu alias"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                />
              </div>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control bg-secondary text-white border-0"
                  placeholder="¿Qué te ha parecido la película? (Opcional)"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-danger btn-sm px-4"
              disabled={enviando || rating === 0}
            >
              {enviando ? 'Enviando...' : 'Publicar reseña'}
            </button>
          </form>
        </div>
      ) : (
        <div className="alert alert-dark border-secondary text-center">
          Debes <a href="/login" className="text-danger fw-bold">iniciar sesión</a> para dejar una reseña.
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="d-flex flex-column gap-3">
        {comentarios.length === 0 ? (
          <p className="text-muted">No hay reseñas todavía. ¡Sé el primero en opinar!</p>
        ) : (
          comentarios.map((c) => (
            <div key={c.id} className="bg-dark p-3 rounded border border-secondary">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold text-white">{c.alias}</span>
                  <StarRating rating={c.rating} tamaño="sm" />
                </div>
                <span className="text-muted small">
                  {new Date(c.fecha).toLocaleDateString()}
                </span>
              </div>
              {c.comentario && <p className="mb-0 text-light">{c.comentario}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;