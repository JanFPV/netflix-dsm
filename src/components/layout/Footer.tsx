import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark text-secondary py-4 mt-5 border-top border-secondary">
      <div className="container">
        <div className="row align-items-center">

          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} DSM-flix. Proyecto de React.
            </p>
          </div>

          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link to="/about" className="text-secondary text-decoration-none hover-white">
                  Sobre Nosotros
                </Link>
              </li>
              <li className="list-inline-item ms-3">
                <Link to="/contacto" className="text-secondary text-decoration-none hover-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;