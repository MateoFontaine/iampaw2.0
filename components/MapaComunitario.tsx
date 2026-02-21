'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🟠 ICONO NARANJA (Resalta perfecto con el verde y azul del mapa)
const orangeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  tooltipAnchor: [16, -28], 
  shadowSize: [41, 41],
});

export default function MapaComunitario({ mascotas }: { mascotas: any[] }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  // 2. CENTRO EN PINAMAR 🌊🌲
  const pinamarCenter = { lat: -37.1066, lng: -56.8606 }; 

  if (!isMounted) return <div className="h-full w-full bg-gray-100 animate-pulse"></div>;

  return (
    <div className="h-full w-full z-0">
        <MapContainer 
            center={pinamarCenter} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
        >
            {/* Mapa Colorido (OpenStreetMap Clásico) */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {mascotas.map((pet) => {
                if (!pet.lat || !pet.lng) return null;

                return (
                <Marker 
                    key={pet.id} 
                    position={[pet.lat, pet.lng]} 
                    icon={orangeIcon}
                >
                    <Tooltip direction="top" offset={[-15, -30]} opacity={1}>
                        <div className="flex flex-col items-center justify-center text-center p-1 w-28">
                            <div className="w-12 h-12 rounded-full overflow-hidden mb-1.5 border-2 border-[#ff6f00] shadow-sm bg-gray-50 flex items-center justify-center">
                                {pet.foto_url ? (
                                    <img src={pet.foto_url} className="w-full h-full object-cover" alt={pet.nombre} />
                                ) : (
                                    <span className="text-xl">🐶</span>
                                )}
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm truncate w-full m-0 tracking-tight">
                                {pet.nombre}
                            </h3>
                        </div>
                    </Tooltip>
                </Marker>
                );
            })}
        </MapContainer>
    </div>
  );
}