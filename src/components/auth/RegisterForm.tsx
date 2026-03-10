import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (password !== confirmarPassword) {
      return setError('Las contraseñas no coinciden.');
    }
    if (password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }

    try {
      setCargando(true);
      await register(email, password);
      setExito(true);
    } catch (err: unknown) {
      console.error(err);
      setError('Error al crear la cuenta. Puede que el correo ya esté en uso.');
    } finally {
      setCargando(false);
    }
  };

  // Si se registró con éxito, mostramos esta pantalla
  if (exito) {
    return (
      <div className="container mt-5" style={{ maxWidth: '400px' }}>
        <div className="card bg-dark text-white border-secondary shadow p-4 text-center">
          <i className="bi bi-envelope-check-fill text-success" style={{ fontSize: '3rem' }}></i>
          <h3 className="mt-3">¡Cuenta creada!</h3>
          <p className="mt-2 text-secondary">
            Te hemos enviado un correo electrónico a <strong>{email}</strong>.
            Por favor, revisa tu bandeja de entrada (o la carpeta de spam) y haz clic en el enlace para activar tu cuenta.
          </p>
          <Link to="/login" className="btn btn-danger mt-3 w-100">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  // Si no, mostramos el formulario
  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card bg-dark text-white border-secondary shadow p-4">
        <h2 className="text-center mb-4 text-danger fw-bold">Crear Cuenta</h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Correo electrónico</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Contraseña</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="confirmarPassword"
              placeholder="Repetir Contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
            />
            <label htmlFor="confirmarPassword">Repetir Contraseña</label>
          </div>

          <button
            type="submit"
            className="btn btn-danger w-100 py-2 fw-bold"
            disabled={cargando}
          >
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-secondary">¿Ya tienes cuenta? </span>
          <Link to="/login" className="text-white fw-bold text-decoration-none hover-danger">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;