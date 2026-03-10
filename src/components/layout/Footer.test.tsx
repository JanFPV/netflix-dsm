import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Componente Footer', () => {
  it('Debería mostrar el texto del copyright', () => {

    // Envolverlo igual que en App.tsx
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Verificar que el texto este presente
    const textoCopyright = screen.getByText(/DSM-flix. Proyecto de React./i);
    expect(textoCopyright).toBeInTheDocument();
  });
});