import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import type { Comentario } from '../types';

export function useMovieStats(movieId: string) {
  const [ratingMedia, setRatingMedia] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (!movieId) return;

    const commentsRef = ref(db, `comentarios/${movieId}`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const lista = Object.values(data) as Comentario[];

        if (lista.length > 0) {
          const suma = lista.reduce((acc, curr) => acc + curr.rating, 0);
          setRatingMedia(suma / lista.length);
          setTotalReviews(lista.length);
        }
      } else {
        // Si no hay comentarios, la nota es 0
        setRatingMedia(0);
        setTotalReviews(0);
      }
    });

    return () => unsubscribe();
  }, [movieId]);

  return { ratingMedia, totalReviews };
}