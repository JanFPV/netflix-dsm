function About() {
  return (
    <div className="container mt-5 text-white">
      <h1 className="mb-4 text-danger">Sobre el Proyecto</h1>

      <div className="bg-dark p-4 rounded border border-secondary shadow-sm">
        <p className="fs-5">
          Este proyecto ha sido desarrollado por <strong>Iñaki Janices</strong> como parte de la asignatura <strong>Despliegue de Servicios Multimedia</strong> del <strong>Máster Universitario en Ingeniería de Telecomunicación</strong> de la Universidad Pública de Navarra.
        </p>

        <p className="text-light">
          Se trata de una plataforma web de Video on Demand basada en <strong>React</strong> y <strong>Vite</strong>, centrada en la experiencia de usuario, utilizando <strong>Bootstrap</strong> para implementar una interfaz moderna.
        </p>

        <hr className="border-secondary my-4" />

        <p className="mb-0">
          <i className="bi bi-github me-2"></i>
          Puedes consultar el código fuente en GitHub: <br className="d-md-none" />
          <a
            href="https://github.com/JanFPV/netflix-dsm"
            target="_blank"
            rel="noreferrer"
            className="text-info text-decoration-none ms-md-1"
          >
            github.com/JanFPV/netflix-dsm
          </a>
        </p>
      </div>
    </div>
  );
}

export default About;