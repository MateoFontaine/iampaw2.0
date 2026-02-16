'use client';

import dynamic from 'next/dynamic';

// Cargamos el mapa SIN SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);
// Importamos CSS
import 'leaflet/dist/leaflet.css';

export default function MapaPublico({ lat, lng }: { lat: number, lng: number }) {
  if (!lat || !lng) return null;

  return (
    <div className="h-full w-full bg-gray-100 z-0">
      <MapContainer 
        center={[lat, lng]} 
        zoom={15} 
        scrollWheelZoom={false} 
        zoomControl={false} // Sacamos los botones +/- para que se vea limpio
        dragging={false}    // Mapa estático (tipo imagen)
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
            attribution=''
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Usamos un Círculo en lugar de un Pin exacto para privacidad */}
        <Circle 
            center={[lat, lng]}
            pathOptions={{ fillColor: '#ff6f00', color: '#ff6f00', fillOpacity: 0.2 }}
            radius={150} // 150 metros de radio (zona aproximada)
        />
        
        {/* Puntito central chiquito */}
        <Circle 
            center={[lat, lng]}
            pathOptions={{ fillColor: '#ff6f00', color: 'white', weight: 2, fillOpacity: 1 }}
            radius={20} 
        />
      </MapContainer>
    </div>
  );
}