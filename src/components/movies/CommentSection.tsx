import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ref, onValue, push, set, remove } from 'firebase/database';
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

  const usuarioYaComento = user ? comentarios.some(c => c.usuario_id === user.uid) : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || rating === 0 || usuarioYaComento) return;

    setEnviando(true);
    try {
      // Alias a partir del email
      const aliasEmail = user.email ? user.email.split('@')[0] : 'Usuario';

      const commentsRef = ref(db, `comentarios/${movieId}`);
      const nuevoComentarioRef = push(commentsRef);

      const nuevoComentario: Comentario = {
        id: nuevoComentarioRef.key as string,
        usuario_id: user.uid,
        email: user.email || 'sin-email',
        alias: aliasEmail,
        rating: rating,
        comentario: texto,
        fecha: Date.now(),
      };

      await set(nuevoComentarioRef, nuevoComentario);

      // Limpiar el formulario tras enviar
      setTexto('');
      setRating(0);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setEnviando(false);
    }
  };

  // Borrar tu propia reseña
  const borrarComentario = async (idComentario: string) => {
    if (window.confirm("¿Seguro que quieres borrar tu reseña?")) {
      try {
        await remove(ref(db, `comentarios/${movieId}/${idComentario}`));
      } catch (error) {
        console.error("Error al borrar:", error);
      }
    }
  };

  return (
    <div className="mt-5 border-top border-secondary pt-4">
      <h4 className="mb-4">Reseñas y Comentarios</h4>

      {/* Formulario */}
      {!user ? (
        <div className="alert alert-dark border-secondary text-center">
          Debes <a href="/login" className="text-danger fw-bold">iniciar sesión</a> para dejar una reseña.
        </div>
      ) : usuarioYaComento ? (
        // Si ya comentó, no le dejamos
        <div className="alert bg-dark text-white border-secondary text-center shadow-sm">
          <i className="bi bi-check-circle-fill text-success me-2"></i>
          Ya has publicado una reseña para esta película. ¡Gracias por tu aportación!
        </div>
      ) : (
        <div className="card bg-dark text-white border-secondary mb-4 p-3 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="d-flex align-items-center mb-3 gap-2">
              <span className="fw-bold">Tu valoración:</span>
              <StarRating rating={rating} interactivo={true} onRatingChange={setRating} />
              {rating === 0 && <span className="text-danger small ms-2">* Obligatorio</span>}
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control bg-secondary text-white border-0"
                placeholder="¿Qué te ha parecido la película? (Opcional)"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
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
      )}

      {/* Comentarios */}
      <div className="d-flex flex-column gap-3">
        {comentarios.length === 0 ? (
          <p className="text-muted">No hay reseñas todavía. ¡Sé el primero en opinar!</p>
        ) : (
          comentarios.map((c) => (
            <div key={c.id} className="bg-dark p-3 rounded border border-secondary position-relative">

              {/* Botón de borrar */}
              {c.usuario_id === user?.uid && (
                <button
                  onClick={() => borrarComentario(c.id)}
                  className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2 border-0"
                  title="Borrar mi reseña"
                >
                  <i className="bi bi-trash3-fill"></i>
                </button>
              )}

              <div className="d-flex justify-content-between align-items-center mb-2 pe-4">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold text-white">@{c.alias}</span>
                  <StarRating rating={c.rating} tamaño="sm" />
                </div>
                <span className="text-muted small d-none d-sm-inline">
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