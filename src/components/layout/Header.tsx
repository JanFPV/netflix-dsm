import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // Cierra la sesión en Firebase
    navigate('/');  // Te manda a la página de Inicio
  };

  // Extraemos la parte anterior al @ del email para el nombre de usuario corto
  const username = user?.email ? user.email.split('@')[0] : 'usuario';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/logo.png"
            alt="DSM-flix"
            height="50"
            className="d-inline-block align-top"
          />
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/favoritos">Favoritos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">Sobre nosotros</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contacto">Contacto</NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-dark dropdown-toggle text-light d-flex align-items-center gap-2 border-0"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle bg-danger text-white d-flex justify-content-center align-items-center fw-bold"
                    style={{ width: '32px', height: '32px', fontSize: '1.2rem' }}
                  >
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span>
                    Hola, <b className="text-danger">@{username}</b>
                  </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark shadow border-secondary mt-2" aria-labelledby="userDropdown">
                  <li className="px-3 py-2 text-muted small border-bottom border-secondary mb-1">
                    Conectado como:<br/>
                    <strong className="text-light">{user.email}</strong>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item text-danger d-flex align-items-center gap-2 mt-1">
                      <i className="bi bi-box-arrow-right"></i> Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/register" className="btn btn-outline-danger btn-sm">
                  Crear Cuenta
                </Link>
                <Link to="/login" className="btn btn-danger btn-sm">
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;