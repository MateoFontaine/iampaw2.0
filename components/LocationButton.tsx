'use client';

import { useState } from 'react';

interface Props {
  telefono: string;
  nombreMascota: string;
  isLost: boolean;
}

export default function LocationButton({ telefono, nombreMascota, isLost }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSendLocation = () => {
    setLoading(true);

    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      setLoading(false);
      return;
    }

    // Pedimos la ubicación
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        // Armamos el mensaje
        const texto = `Hola! Encontré a ${nombreMascota}. Te paso mi ubicación actual para que lo busques: ${mapsLink}`;
        
        // Abrimos WhatsApp
        const whatsappUrl = `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;
        window.location.href = whatsappUrl;
        
        setLoading(false);
      },
      (error) => {
        console.error(error);
        alert("No pudimos obtener tu ubicación. Verificá que tengas el GPS activado y diste permisos.");
        setLoading(false);
      },
      { enableHighAccuracy: true } // Pedimos máxima precisión
    );
  };

  return (
    <button 
        onClick={handleSendLocation}
        disabled={loading}
        className={`flex items-center justify-center w-full bg-white border-2 text-gray-700 py-3.5 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors mb-8 gap-2 shadow-sm ${isLost ? 'border-red-100 text-red-800' : 'border-gray-100'}`}
    >
        {loading ? (
            // Spinner simple mientras busca satélites
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#ff6f00] rounded-full animate-spin"></div>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        )}
        {loading ? 'Obteniendo GPS...' : 'Enviar mi Ubicación'}
    </button>
  );
}