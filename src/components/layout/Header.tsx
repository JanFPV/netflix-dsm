import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
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
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/favoritos">Mis Favoritos</Link>
            </li>
          </ul>

          <div className="d-flex">
            <button className="btn btn-outline-light btn-sm">Iniciar Sesión</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;