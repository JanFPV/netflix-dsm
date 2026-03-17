import { useState, useEffect, useCallback } from 'react';
import { ref, query, orderByKey, orderByChild, limitToFirst, startAfter, startAt, endAt, get } from 'firebase/database';import { db } from '../config/firebase';
import type { PeliculaFirebase } from '../types';

export function useInfinitePeliculas(tamanoLote: number = 12, filtro: string = 'Todas') {
  const [peliculas, setPeliculas] = useState<PeliculaFirebase[]>([]);
  const [cargando, setCargando] = useState(false);
  const [ultimoId, setUltimoId] = useState<string | null>(null);
  const [hayMas, setHayMas] = useState(true);

  const cargarLote = useCallback(async (esReset: boolean = false) => {
    const idActual = esReset ? null : ultimoId;
    const hayMasActual = esReset ? true : hayMas;

    if (cargando || !hayMasActual) return;

    console.log(`[FIREBASE] Pidiendo 12 películas. Filtro: ${filtro}. ID: ${idActual || 'el principio'}`);
    setCargando(true);
    try {
      // Referencia base a peliculas
      const peliculasRef = ref(db, 'peliculas');

      let consulta;

      if (filtro === 'Todas') {
        if (idActual) {
          consulta = query(peliculasRef, orderByKey(), startAfter(idActual), limitToFirst(tamanoLote + 1));
        } else {
          consulta = query(peliculasRef, orderByKey(), limitToFirst(tamanoLote + 1));
        }
      } else {
        // Filtramos por categoría exacta
        if (idActual) {
          consulta = query(peliculasRef, orderByChild('categoria'), startAfter(filtro, idActual), endAt(filtro), limitToFirst(tamanoLote + 1));
        } else {
          consulta = query(peliculasRef, orderByChild('categoria'), startAt(filtro), endAt(filtro), limitToFirst(tamanoLote + 1));
        }
      }

      // Ejecutar la petición
      const snapshot = await get(consulta);

      if (!snapshot.exists() || snapshot.size === 0) {
        setHayMas(false); // No hay más películas en la DB
        setCargando(false);
        return;
      }

      // Convertimos objeto de Firebase a array
      const listaBruta: PeliculaFirebase[] = [];
      snapshot.forEach((child) => {
        listaBruta.push({ id: child.key as string, ...(child.val() as PeliculaFirebase) });
      });

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
        setUltimoId(nuevaUltima.id!);
      }

      if (esReset) {
        setPeliculas(nuevasPeliculas);
      } else {
        setPeliculas(prevPeliculas => [...prevPeliculas, ...nuevasPeliculas]);
      }

    } catch (error) {
      console.error("Error cargando películas en Infinite Scroll:", error);
      setHayMas(false);
    } finally {
      setCargando(false);
    }
  }, [cargando, hayMas, ultimoId, tamanoLote, filtro]);

  // Cargar el primer lote automáticamente al montar el hook o cambiar de categoría
  useEffect(() => {
    console.log(`[HOOK] Filtro cambiado a: ${filtro}. Reseteando...`);
    setPeliculas([]);
    setUltimoId(null);
    setHayMas(true);
    cargarLote(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tamanoLote, filtro]);

  return {
    peliculas,
    cargando,
    cargarMas: () => cargarLote(false),
    hayMas
  };
}