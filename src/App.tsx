import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Favorites from './pages/Favorites';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">

        <Header />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/about" element={<About />} />
            <Route path="/contacto" element={<Contact />} />
          </Routes>
        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;