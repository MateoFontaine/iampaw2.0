'use client';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- ARREGLO DE ICONOS ---
const icon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// --- COMPONENTE AUXILIAR: MUEVE LA CÁMARA CUANDO CAMBIA LA POSICIÓN ---
function MapUpdater({ center }: { center: { lat: number, lng: number } | null }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15, { animate: true });
        }
    }, [center, map]);
    return null;
}

// --- COMPONENTE AUXILIAR: DETECTA CLICS EN EL MAPA ---
function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

export default function MapaPicker({ lat, lng, onChange }: any) {
  // Posición inicial (Por defecto: Obelisco, BsAs - o Pinamar)
  const defaultCenter = { lat: -34.6037, lng: -58.3816 }; 
  const [position, setPosition] = useState<any>(lat && lng ? { lat, lng } : null);
  const [loadingLoc, setLoadingLoc] = useState(false);

  useEffect(() => {
    if (position) {
      onChange(position.lat, position.lng);
    }
  }, [position]);

  // --- FUNCIÓN PARA PEDIR GPS ---
  const handleGetLocation = () => {
    setLoadingLoc(true);

    if (!navigator.geolocation) {
        alert("Tu navegador no soporta geolocalización.");
        setLoadingLoc(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            // ÉXITO
            const nuevaPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setPosition(nuevaPos);
            setLoadingLoc(false);
        },
        (err) => {
            // ERROR
            setLoadingLoc(false);
            console.error(err);
            if (err.code === 1) {
                alert("⚠️ Permiso denegado. Por favor activá la ubicación en tu navegador (el candadito en la barra de direcciones).");
            } else if (err.code === 2) {
                alert("⚠️ No se pudo determinar tu ubicación (señal débil).");
            } else {
                alert("⚠️ Error al obtener ubicación.");
            }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Marcá la casa en el mapa</label>
        
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={loadingLoc}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-2 ${loadingLoc ? 'bg-gray-100 text-gray-400' : 'bg-orange-50 text-[#ff6f00] hover:bg-orange-100'}`}
        >
          {loadingLoc ? (
             <>
               <svg className="animate-spin h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               Buscando...
             </>
          ) : (
             <>📍 Usar ubicación actual</>
          )}
        </button>
      </div>

      <div className="h-64 w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner z-0 relative">
        <MapContainer 
          center={position || defaultCenter} 
          zoom={13} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%' }}
        >
          {/* TileLayer Voyager (Limpio) */}
          <TileLayer
            attribution=''
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {/* Componentes Lógicos */}
          <MapUpdater center={position} />
          <LocationMarker position={position} setPosition={setPosition} />
        
        </MapContainer>
      </div>
      <p className="text-[10px] text-gray-400 text-center">
         {position ? "Ubicación marcada. Podés ajustarla tocando el mapa." : "Tocá en el mapa o usá el botón para marcar."}
      </p>
    </div>
  );
}