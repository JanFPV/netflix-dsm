import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate(); // Para redirigir al usuario tras loguearse

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpiamos errores previos

    try {
      await login(email, password);
      navigate('/'); // Si hay éxito, lo mandamos a la portada
    } catch (err) {
      setError('Correo o contraseña incorrectos.');
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

        <button type="submit" className="btn btn-danger w-100 py-2 fw-bold fs-5">
          Entrar a DSM-flix
        </button>
      </form>
    </div>
  );
}

export default LoginForm;