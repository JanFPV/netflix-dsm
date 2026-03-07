// src/types/index.ts

export interface PeliculaFirebase {
  tmdb_id: number;
  categoria: string;
}

export interface PeliculaTMDB {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
}

export interface Pelicula {
  id: string;
  tmdb_id: number;
  categoria: string;
  titulo: string;
  sinopsis: string;
  portada_url: string;
}

export interface Comentario {
  id?: string;
  usuarioEmail: string;
  texto: string;
  fecha: string;
}