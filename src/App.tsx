import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Favorites from './pages/Favorites';
import MovieDetail from './pages/MovieDetail';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">

          <Header />

          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favoritos" element={<Favorites />} />
              <Route path="/about" element={<About />} />
              <Route path="/contacto" element={<Contact />} />

              <Route path="/pelicula/:id" element={<MovieDetail />} />

              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Routes>
          </main>

          <Footer />

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;