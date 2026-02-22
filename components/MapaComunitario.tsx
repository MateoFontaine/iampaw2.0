'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

// 🔴 ICONO ROJO (ALERTA)
// Usamos este para todos los perros perdidos de la comunidad
const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 🟠 ICONO NARANJA (MI MASCOTA)
// Usamos este para diferenciar TU perro del resto en el mapa
const myIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapaComunitario({ mascotas, userId }: { mascotas: any[], userId: string | null }) {
  // Centro por defecto (Buenos Aires / Argentina)
  const defaultCenter = { lat: -34.6037, lng: -58.3816 }; 

  return (
    <div className="h-full w-full bg-gray-100 z-0">
        <MapContainer 
            center={defaultCenter} 
            zoom={5} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
        >
            {/* Mapa base claro (Voyager) para que resalten los pines rojos */}
            <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {mascotas.map((pet) => {
                // Solo mostramos si tienen coordenadas
                if (!pet.lat || !pet.lng) return null;

                const esMio = pet.user_id === userId;
                const codigo = pet.chapitas?.[0]?.codigo;

                return (
                <Marker 
                    key={pet.id} 
                    position={[pet.lat, pet.lng]} 
                    // Lógica: Si es mío -> Naranja, Si es de otro -> Rojo
                    icon={esMio ? myIcon : redIcon}
                >
                    <Popup className="custom-popup">
                        <div className="flex flex-col items-center text-center p-1 w-36">
                            <div className={`w-14 h-14 rounded-full overflow-hidden mb-2 border-2 ${esMio ? 'border-orange-500' : 'border-red-500'}`}>
                                {pet.foto_url ? <img src={pet.foto_url} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xl">🐶</div>}
                            </div>
                            
                            <h3 className="font-bold text-sm m-0 leading-tight text-gray-900">{pet.nombre}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase m-0 mb-2 truncate w-full">{pet.raza}</p>
                            
                            <div className={`text-[9px] font-black uppercase tracking-wider mb-2 px-2 py-0.5 rounded ${esMio ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                                {esMio ? 'ES MÍO' : '¡PERDIDO!'}
                            </div>
                            
                            <Link 
                                href={esMio ? `/dashboard/edit/${pet.id}` : `/p/${codigo}`}
                                className="bg-gray-900 text-white text-[10px] px-3 py-2 rounded-lg font-bold hover:bg-black transition w-full block"
                            >
                                {esMio ? 'Gestionar' : 'Ver Ficha'}
                            </Link>
                        </div>
                    </Popup>
                </Marker>
                );
            })}
        </MapContainer>
    </div>
  );
}