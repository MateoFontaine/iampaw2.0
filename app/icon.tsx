import { ImageResponse } from 'next/og';

// Configuración de la imagen (tamaño estándar de favicon)
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Generación del ícono
export default function Icon() {
  return new ImageResponse(
    (
      // Elemento contenedor
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff6f00', // Tu color naranja de marca
        }}
      >
        {/* Usamos un emoji de huella o un SVG. El emoji es más seguro y liviano para esto */}
        🐾
      </div>
    ),
    {
      ...size,
    }
  );
}