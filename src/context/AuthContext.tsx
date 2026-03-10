import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import type { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;         // Los datos del usuario (o null si no está logueado)
  loading: boolean;          // Para saber si Firebase está pensando
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioActual) => {
      setUser(usuarioActual);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const register = async (email: string, pass: string) => {
    const credenciales = await createUserWithEmailAndPassword(auth, email, pass);

    // Mandar email automático de confirmación
    await sendEmailVerification(credenciales.user);

    // Cerrar sesión inmediatamente para obligarle a ir a su correo
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children} {/* Solo mostramos la web cuando sabemos quién es el usuario */}
    </AuthContext.Provider>
  );
};