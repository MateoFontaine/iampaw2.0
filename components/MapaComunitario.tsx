'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🔵 PIN INDIVIDUAL (Igual que el tuyo, perfecto y minimalista)
const createDotIcon = (isPerdido: boolean) => {
  const bgColor = isPerdido ? 'bg-red-500' : 'bg-[#ff6f00]';
  const pulseEffect = isPerdido ? `<div class="absolute inset-0 rounded-full ${bgColor} animate-ping opacity-50"></div>` : '';

  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        ${pulseEffect}
        <div class="relative z-10 w-4 h-4 rounded-full ${bgColor} border-2 border-white shadow-md"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    tooltipAnchor: [0, -16],
  });
};

// 🔵 CLUSTER TECNOLÓGICO EN AZUL
const createCustomClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount(); 
  
  return L.divIcon({
    className: 'bg-transparent border-0',
    html: `
      <div class="relative flex items-center justify-center transition-transform hover:scale-105">
        <div class="absolute inset-0 bg-blue-500/30 rounded-full animate-pulse blur-[2px] scale-125"></div>
        
        <div class="relative z-10 bg-gray-900 border-[2px] border-blue-500 text-blue-400 font-black text-sm w-11 h-11 flex items-center justify-center rounded-full shadow-xl">
          ${count}
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

export default function MapaComunitario({ mascotas }: { mascotas: any[] }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

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
            {/* VOLVEMOS AL MAPA CLARO ORIGINAL */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createCustomClusterIcon}
                maxClusterRadius={45} // Un poquito más alto para que agrupe de forma más natural
                showCoverageOnHover={false} // Apagamos el polígono feo que sale al hacer hover por defecto
            >
                {mascotas.map((pet) => {
                    if (!pet.lat || !pet.lng) return null;
                    
                    const borderColor = pet.perdido ? 'border-red-500' : 'border-[#ff6f00]';
                    const badgeBg = pet.perdido ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600';
                    const statusText = pet.perdido ? '¡PERDIDO!' : 'ACTIVO';

                    return (
                    <Marker 
                        key={pet.id} 
                        position={[pet.lat, pet.lng]} 
                        icon={createDotIcon(pet.perdido)}
                    >
                        {/* TU TOOLTIP PREMIUM QUEDA INTACTO */}
                        <Tooltip direction="top" offset={[0, -5]} opacity={1} className="!bg-transparent !border-0 !shadow-none !p-0">
                            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-3 w-44 border border-gray-100 flex flex-col items-center relative mt-2">
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b border-r border-gray-100 z-0"></div>

                                <div className="relative z-10 flex flex-col items-center w-full">
                                    <div className={`w-16 h-16 rounded-full overflow-hidden mb-2 border-[3px] ${borderColor} p-0.5 bg-white shadow-sm flex items-center justify-center transition-transform hover:scale-105`}>
                                        {pet.foto_url ? (
                                            <img src={pet.foto_url} className="w-full h-full object-cover rounded-full" alt={pet.nombre} />
                                        ) : (
                                            <span className="text-2xl">🐶</span>
                                        )}
                                    </div>
                                    
                                    <h3 className="font-black text-gray-900 text-base truncate w-full text-center leading-tight">
                                        {pet.nombre}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider truncate w-full text-center mb-2">
                                        {pet.raza || 'Raza no especificada'}
                                    </p>

                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${badgeBg}`}>
                                        {statusText}
                                    </span>
                                </div>
                            </div>
                        </Tooltip>
                    </Marker>
                    );
                })}
            </MarkerClusterGroup>
        </MapContainer>
    </div>
  );
}