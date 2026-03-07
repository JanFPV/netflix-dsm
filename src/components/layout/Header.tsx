import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div className="container">
        <Link className="navbar-brand text-danger fw-bold fs-3" to="/">
          DSM-flix
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
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="text-light me-3 d-none d-md-block">
                  Hola, <b className="text-danger">{user.email}</b>
                </span>
                <button onClick={logout} className="btn btn-outline-light btn-sm">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-danger btn-sm">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;