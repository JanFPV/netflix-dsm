import { useState } from 'react';

function Contact() {
  const [enviando, setEnviando] = useState(false);

  const simularEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    setTimeout(() => {
      alert("Mensaje enviado correctamente.");
      setEnviando(false);
    }, 1000);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h1 className="text-white mb-2 text-danger">Contacto</h1>

      <p className="text-secondary mb-4">
        Formulario de contacto para hablar con el desarrollador. Si lo prefieres, también puedes <a href="https://github.com/JanFPV" target="_blank" rel="noreferrer" className="text-info text-decoration-none">contactarme en mi perfil de GitHub</a>.
      </p>

      <form onSubmit={simularEnvio} className="bg-dark p-4 rounded border border-secondary shadow-sm">

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control text-white border-secondary"
            id="floatingNombre"
            placeholder="Tu nombre"
            required
          />
          <label htmlFor="floatingNombre" className="text-secondary">Tu nombre</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control text-white border-secondary"
            id="floatingEmail"
            placeholder="Tu correo electrónico"
            required
          />
          <label htmlFor="floatingEmail" className="text-secondary">Tu correo electrónico</label>
        </div>

        <div className="form-floating mb-4">
          <textarea
            className="form-control text-white border-secondary"
            id="floatingMensaje"
            placeholder="Escribe aquí tu mensaje..."
            style={{ height: '120px' }}
            required
          ></textarea>
          <label htmlFor="floatingMensaje" className="text-secondary">Escribe aquí tu mensaje...</label>
        </div>

        <button type="submit" className="btn btn-danger w-100 fw-bold py-2" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
      </form>
    </div>
  );
}

export default Contact;