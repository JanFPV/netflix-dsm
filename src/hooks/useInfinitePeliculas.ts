import { useState, useEffect, useCallback } from 'react';
import { ref, query, orderByKey, limitToFirst, startAfter, get } from 'firebase/database';
import { db } from '../config/firebase';
import type { PeliculaFirebase } from '../types';

export function useInfinitePeliculas(tamanoLote: number = 12) {
  const [peliculas, setPeliculas] = useState<PeliculaFirebase[]>([]);
  const [cargando, setCargando] = useState(false);
  const [ultimoId, setUltimoId] = useState<string | null>(null);
  const [hayMas, setHayMas] = useState(true);

  const cargarLote = useCallback(async () => {
    // Si ya estamos cargando o no hay más, salimos
    if (cargando || !hayMas) return;

    setCargando(true);
    try {
      // Referencia base a peliculas
      const peliculasRef = ref(db, 'peliculas');

      // Construir la consulta base
      let consulta = query(peliculasRef, orderByKey());

      // Si no es la primera carga, empezamos después  del último ID
      if (ultimoId) {
        consulta = query(consulta, startAfter(ultimoId));
      }

      // Pedimos tamanoLote + 1 para saber si hay más páginas
      consulta = query(consulta, limitToFirst(tamanoLote + 1));

      // Ejecutar la petición
      const snapshot = await get(consulta);

      if (!snapshot.exists() || snapshot.size === 0) {
        setHayMas(false); // No hay más películas en la DB
        setCargando(false);
        return;
      }

      // Convertimos objeto de Firebase a array
      const data = snapshot.val();
      const listaBruta = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...(value as PeliculaFirebase)
      }));

      // Comprobar si hemos traído tamanoLote + 1
      let nuevasPeliculas;
      if (listaBruta.length > tamanoLote) {
        // Significa que hay otra página
        setHayMas(true);
        // Quitamos la película extra de la lista a mostrar
        nuevasPeliculas = listaBruta.slice(0, tamanoLote);
      } else {
        // Es la última página, nos ha devuelto tamanoLote o menos
        setHayMas(false);
        nuevasPeliculas = listaBruta;
      }

      // Guardamos el ID de la nueva última película real
      if (nuevasPeliculas.length > 0) {
        const nuevaUltima = nuevasPeliculas[nuevasPeliculas.length - 1];
        setUltimoId(nuevaUltima.id);
      }

      // Añadimos las nuevas películas al final de las actuales
      setPeliculas(prevPeliculas => [...prevPeliculas, ...nuevasPeliculas]);

    } catch (error) {
      console.error("Error cargando películas en Infinite Scroll:", error);
      setHayMas(false);
    } finally {
      setCargando(false);
    }
  }, [cargando, hayMas, ultimoId, tamanoLote]);

  // Cargar el primer lote automáticamente al montar el hook
  useEffect(() => {
    setPeliculas([]);
    setUltimoId(null);
    setHayMas(true);
    cargarLote();
  }, [tamanoLote, cargarLote]);

  return {
    peliculas,
    cargando,
    cargarMas: cargarLote, // Exportamos la función para llamarla al hacer scroll
    hayMas
  };
}