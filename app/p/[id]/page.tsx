import { createClient } from '@supabase/supabase-js';
import FormularioRegistro from '@/components/FormularioRegistro';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  params: Promise<{ id: string }>
}

export default async function ChapitaPage({ params }: Props) {
  const { id } = await params;

  const { data: chapita, error } = await supabase
    .from('chapitas')
    .select('*, mascotas(*)')
    .eq('codigo', id)
    .single();

  if (error || !chapita) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6 text-center">
        <div>
           <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <span className="text-3xl">🚫</span>
           </div>
           <h1 className="text-xl font-bold text-gray-900 mb-2">Código Desconocido</h1>
           <p className="text-gray-500 text-sm">Esta chapita no está registrada.</p>
        </div>
      </div>
    );
  }

  if (!chapita.mascota_id || !chapita.mascotas) {
    return <FormularioRegistro codigo={id} />;
  }

  const mascota = chapita.mascotas as any;

  // --- LÓGICA DE ALERTA ROJA ---
  const isLost = mascota.perdido; // Leemos si está perdido de la base de datos
  
  // Colores dinámicos
  const mainColor = isLost ? 'bg-red-600' : 'bg-[#ff6f00]';
  const shadowColor = isLost ? 'shadow-red-200/80' : 'shadow-orange-200/80';
  const badgeColor = isLost ? 'bg-red-600' : 'bg-[#ff6f00]';

  return (
    <div className="min-h-screen bg-white font-sans pb-6">
      
      {/* 1. HERO IMAGE */}
      <div className="relative h-[62vh] w-full bg-gray-200">
        {mascota.foto_url ? (
          <img 
            src={mascota.foto_url} 
            alt={mascota.nombre} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-300">
             <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c.5 0 .9.3.9.7v3.5a1 1 0 0 1-1 1h0a1 1 0 0 1-1-1V2.8c0-.4.5-.8 1.1-.8z"/><path d="M18.4 4.8c.4-.3.9-.1 1.2.3l1.8 3a1 1 0 0 1-.3 1.4h0a1 1 0 0 1-1.4-.3l-1.8-3a1 1 0 0 1 .5-1.4z"/><path d="M5.6 4.8c-.4-.3-.9-.1-1.2.3l-1.8 3a1 1 0 0 0 .3 1.4h0a1 1 0 0 0 1.4-.3l1.8-3a1 1 0 0 0-.5-1.4z"/><path d="M14.3 11.2a1 1 0 0 1 1.4 0l1.7 1.7a3 3 0 0 1 0 4.2l-3.3 3.3a1 1 0 0 1-1.4 0h0a1 1 0 0 1 0-1.4l3.3-3.3a1 1 0 0 0 0-1.4l-1.7-1.7a1 1 0 0 1 0-1.4z"/><path d="M9.7 11.2a1 1 0 0 0-1.4 0l-1.7 1.7a3 3 0 0 0 0 4.2l3.3 3.3a1 1 0 0 0 1.4 0h0a1 1 0 0 0 0-1.4l-3.3-3.3a1 1 0 0 1 0-1.4l1.7-1.7a1 1 0 0 0 0-1.4z"/></svg>
             <span className="text-sm mt-2 font-medium">Sin foto</span>
          </div>
        )}
        
        {/* DEGRADADO (Si está perdido, agregamos un tinte rojo y pulso) */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent ${isLost ? 'animate-pulse bg-red-900/20' : ''}`}></div>

        <div className="absolute bottom-12 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
                {isLost ? (
                     // BADGE DE ALERTA (Rebotando)
                     <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded shadow-sm tracking-wider uppercase animate-bounce">
                        🚨 ¡ESTOY PERDIDO!
                     </span>
                ) : (
                     // BADGE NORMAL
                     <span className="bg-[#ff6f00] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-sm tracking-wider uppercase">
                        Protegido por IamPaw
                     </span>
                )}
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none drop-shadow-md">
                {mascota.nombre}
            </h1>
            {isLost && (
                <p className="text-white/90 font-bold mt-2 text-lg drop-shadow-md animate-fade-in">
                    Por favor, ayudame a volver a casa.
                </p>
            )}
        </div>
      </div>

      {/* 2. CUERPO DE DATOS */}
      <div className="relative -mt-8 bg-white rounded-t-[1.5rem] px-6 pt-6 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        
        {/* BOTÓN CONTACTAR (Cambia texto y color si está perdido) */}
        <a 
            href={`https://wa.me/${mascota.telefono_contacto}?text=Hola! Escaneé la chapita de IamPaw y encontré a ${mascota.nombre}.`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center w-full ${mainColor} text-white py-3.5 rounded-xl font-bold text-lg shadow-lg ${shadowColor} active:scale-[0.98] transition-transform mb-4 gap-2`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            {isLost ? '¡AVISAR AL DUEÑO AHORA!' : 'Contactar al Dueño'}
        </a>

      

        {/* GRILLA DE DATOS */}
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Raza</span>
                <span className="block text-base font-bold text-gray-900 truncate">{mascota.raza || "No especificada"}</span>
            </div>
            <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Edad</span>
                <span className="block text-base font-bold text-gray-900 truncate">{mascota.edad || "-"}</span>
            </div>
            <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 col-span-2 flex items-center justify-between">
                 <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sexo</span>
                    <span className="block text-base font-bold text-gray-900">{mascota.genero || "-"}</span>
                 </div>
                 <div className="text-2xl opacity-30 grayscale">
                    {mascota.genero === 'Macho' ? '♂' : mascota.genero === 'Hembra' ? '♀' : '🐾'}
                 </div>
            </div>
        </div>

        {/* SECCIÓN DUEÑO & INFO EXTRA */}
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dueño Responsable</h3>
                    <p className="text-lg font-bold text-gray-800">{mascota.nombre_dueño || "Anónimo"}</p>
                </div>
            </div>

            {mascota.descripcion && (
                // Caja de descripción cambia a rojo si está perdido
                <div className={`${isLost ? 'bg-red-50 border-red-100' : 'bg-orange-50/80 border-orange-100/50'} p-4 rounded-xl border`}>
                    <h3 className={`text-[10px] font-bold ${isLost ? 'text-red-600' : 'text-[#ff6f00]'} uppercase tracking-wider mb-2 flex items-center gap-1.5`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9h.01"/><path d="M11 12h1v4h1"/><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z"/></svg>
                        Información Importante
                    </h3>
                    <p className="text-gray-800 leading-relaxed font-medium text-sm">
                        "{mascota.descripcion}"
                    </p>
                </div>
            )}
        </div>

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
             <p className="text-[10px] text-gray-300 font-bold tracking-widest uppercase">
                Powered by IamPaw
             </p>
        </div>

      </div>
    </div>
  );
}