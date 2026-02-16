'use client';
import { useState, useEffect } from 'react';

// Tipos de datos actualizados
interface PhoneProps {
  data: {
    nombre: string;
    raza?: string;
    edad?: string;
    genero?: string;
    nombre_dueño?: string;
    descripcion?: string;
    lat?: number; // Nueva prop
    lng?: number; // Nueva prop
  };
  photoUrl: string | null;
}

export default function PhoneMockup({ data, photoUrl }: PhoneProps) {
  const [hora, setHora] = useState('9:41');

  useEffect(() => {
    const actualizar = () => {
      const now = new Date();
      setHora(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
    };
    actualizar();
    const i = setInterval(actualizar, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative w-[320px] h-[650px] lg:w-[360px] lg:h-[720px] bg-black rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] border-[10px] border-black overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
      
      {/* Dynamic Island */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-28 bg-black rounded-b-2xl z-40 pointer-events-none"></div>

      {/* Barra Estado */}
      <div className="h-10 w-full absolute top-0 z-30 flex justify-between px-6 pt-3 text-white font-medium select-none pointer-events-none text-xs">
          <span>{hora}</span>
          <div className="flex gap-1 items-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
             <span>5G</span>
             <div className="w-5 h-2.5 border border-white/60 rounded-[2px] ml-1 p-[1px]"><div className="h-full w-[80%] bg-white rounded-[1px]"></div></div>
          </div>
      </div>

      {/* --- PANTALLA --- */}
      <div className="h-full w-full bg-white overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden pb-8">
        
        {/* FOTO */}
        <div className="relative h-[55%] w-full bg-gray-200 shrink-0">
          {photoUrl ? (
            <img src={photoUrl} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"></div>
          <div className="absolute bottom-8 left-5 right-5 z-10">
             {data.nombre && <span className="bg-[#ff6f00] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide mb-2 inline-block">Protegido</span>}
             <h1 className="text-4xl font-black text-white tracking-tighter leading-none break-words drop-shadow-lg">{data.nombre || "Tu Mascota"}</h1>
          </div>
        </div>

        {/* CUERPO */}
        <div className="relative -mt-6 bg-white rounded-t-[1.5rem] px-5 pt-8 pb-10 min-h-[50%] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-20">
           <div className="flex items-center justify-center w-full bg-[#ff6f00] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-200/50 mb-5 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Contactar al Dueño
           </div>
           
           <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100"><span className="block text-[8px] font-bold text-gray-400 uppercase">Raza</span><span className="block text-sm font-bold text-gray-900 truncate">{data.raza || "-"}</span></div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100"><span className="block text-[8px] font-bold text-gray-400 uppercase">Edad</span><span className="block text-sm font-bold text-gray-900 truncate">{data.edad || "-"}</span></div>
           </div>

           {/* --- SECCIÓN MAPA PREVIEW --- */}
           {data.lat && data.lng && (
             <div className="mb-4">
               <span className="block text-[8px] font-bold text-gray-400 uppercase mb-2">Zona de Hogar</span>
               <div className="w-full h-24 bg-blue-50 rounded-xl border border-blue-100 overflow-hidden relative">
                  {/* Imagen estática de mapa (simulada) */}
                  <img 
                    src={`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s+ff6f00(${data.lng},${data.lat})/${data.lng},${data.lat},14/300x100@2x?access_token=TU_TOKEN_OPCIONAL_O_USAR_LEAFLET`} 
                    alt="Map Preview"
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => {
                        // Fallback si no hay API de mapas: Un estilo minimalista
                        e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-50/50">
                    <div className="bg-white p-1.5 rounded-full shadow-md text-[#ff6f00]">
                       <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
                    </div>
                  </div>
               </div>
             </div>
           )}

           <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
             <div className="bg-white p-1.5 rounded-full border border-gray-100"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
             <div><span className="block text-[8px] font-bold text-gray-400 uppercase">Dueño</span><p className="text-sm font-bold text-gray-800">{data.nombre_dueño || "Nombre..."}</p></div>
           </div>

           {data.descripcion && (
             <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-xs text-gray-800 leading-relaxed font-medium">
                <span className="text-[#ff6f00] font-bold block mb-1 text-[8px] uppercase">Nota:</span> "{data.descripcion}"
             </div>
           )}
        </div>
      </div>
    </div>
  );
}