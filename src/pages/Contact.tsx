import { useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '../config/firebase';

function Contact() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const mensajesRef = ref(db, 'mensajes_contacto');
      await push(mensajesRef, {
        nombre,
        email,
        mensaje,
        fecha: Date.now()
      });

      setEnviado(true); // Mostrar el mensaje de éxito
      setNombre('');
      setEmail('');
      setMensaje('');
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Hubo un error de conexión.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '515px' }}>
      <h1 className="text-white mb-2 text-danger">Contacto</h1>

      <p className="text-secondary mb-4">
        Si lo prefieres, también puedes <a href="https://github.com/JanFPV" target="_blank" rel="noreferrer" className="text-info text-decoration-none">contactarme en mi perfil de GitHub</a>.
      </p>
      {enviado ? (
        <div className="bg-dark p-4 rounded border border-success text-center shadow-sm">
          <h3 className="text-white mt-2">Mensaje enviado.</h3>
          <p className="text-secondary mt-3">
            Te responderé lo antes posible.
          </p>
          <button onClick={() => setEnviado(false)} className="btn btn-outline-light mt-3">
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={enviarMensaje} className="bg-dark p-4 rounded border border-secondary shadow-sm">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control text-white border-secondary bg-transparent"
              id="floatingNombre"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <label htmlFor="floatingNombre" className="text-secondary">Tu nombre</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control text-white border-secondary bg-transparent"
              id="floatingEmail"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingEmail" className="text-secondary">Tu correo electrónico</label>
          </div>

          <div className="form-floating mb-4">
            <textarea
              className="form-control text-white border-secondary bg-transparent"
              id="floatingMensaje"
              placeholder="Escribe aquí tu mensaje..."
              style={{ height: '120px' }}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            ></textarea>
            <label htmlFor="floatingMensaje" className="text-secondary">Escribe aquí tu mensaje...</label>
          </div>

          <button type="submit" className="btn btn-danger w-100 fw-bold py-2" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </form>
      )}
    </div>
  );
}

export default Contact;