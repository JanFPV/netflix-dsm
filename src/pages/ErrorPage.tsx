import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center text-center mt-5 pt-5" style={{ minHeight: '60vh' }}>
      <h1 className="display-1 fw-bold text-danger text-shadow">404</h1>
      <h2 className="text-white mb-4">¿Te has perdido?</h2>
      <p className="text-secondary lead mb-5 max-w-500">
        No encontramos la página que estás buscando. Hay mucho más para explorar en la página de inicio.
      </p>
      <Link to="/" className="btn btn-danger btn-lg fw-bold px-4 py-2">
        Inicio de DSM-flix
      </Link>
    </div>
  );
}

export default ErrorPage;