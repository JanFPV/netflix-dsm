import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate(); // Para redirigir al usuario tras loguearse

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpiamos errores previos

    try {
      setCargando(true);
      await login(email, password);
      navigate('/'); // Si hay éxito, lo mandamos a la portada
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      // Capturamos el error especial que acabamos de crear en el Context
      if (err.message === "EMAIL_NO_VERIFICADO") {
        setError('⚠️ Tu cuenta no está activada. Por favor, revisa tu correo y haz clic en el enlace de verificación.');
      } else {
        setError('Error al iniciar sesión. Comprueba tus credenciales.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card bg-dark text-white border-secondary shadow-lg p-4 mx-auto" style={{ maxWidth: '400px' }}>
      <h3 className="text-center mb-4 fw-bold">Iniciar Sesión</h3>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form onSubmit={handleSubmit}>

        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingEmail"
            placeholder="nombre@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="floatingEmail">Correo electrónico</label>
        </div>

        <div className="form-floating mb-4">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="floatingPassword">Contraseña</label>
        </div>

        <button
        type="submit"
        className="btn btn-danger w-100 py-2 fw-bold"
        disabled={cargando}
      >
        {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
      </form>
      <div className="text-center mt-4">
        <span className="text-secondary">¿Primera vez en DSM-flix? </span>
        <Link to="/register" className="text-white fw-bold text-decoration-none">
          Crea tu cuenta.
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;