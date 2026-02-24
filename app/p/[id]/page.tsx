import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image'; // <-- IMPORTAMOS EL OPTIMIZADOR DE NEXT
import FormularioRegistro from '@/components/FormularioRegistro';
import MapaPublico from '@/components/MapaPublico'; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  params: Promise<{ id: string }>
}

// --- 1. METADATA (WhatsApp / Redes) ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  const { data: chapita } = await supabase
    .from('chapitas')
    .select('*, mascotas(*)')
    .eq('codigo', id)
    .single();

  if (!chapita || !chapita.mascotas) {
    return { title: "Chapita IamPaw", description: "Activá esta chapita para proteger a tu mascota." };
  }

  const mascota = chapita.mascotas as any;
  const isLost = mascota.perdido;

  const title = isLost 
    ? `🚨 SE BUSCA: ${mascota.nombre ? mascota.nombre.toUpperCase() : 'MASCOTA'} 🚨` 
    : `Conocé a ${mascota.nombre} 🐾 | IamPaw`;

  const description = isLost
    ? `¡Ayuda! ${mascota.nombre} se perdió. Entrá acá para contactar al dueño urgente.`
    : `Hola! Soy ${mascota.nombre}. Si me encontraste, escaneá mi chapita para llamar a mi familia.`;

  const images = mascota.foto_url ? [mascota.foto_url] : ['https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200'];

  return {
    title: title,
    description: description,
    openGraph: { title, description, images },
  };
}

// --- 2. PÁGINA PRINCIPAL ---
export default async function ChapitaPage({ params }: Props) {
  const { id } = await params;

  const { data: chapita, error } = await supabase
    .from('chapitas')
    .select('*, mascotas(*)')
    .eq('codigo', id)
    .single();

  // CASO 1: CÓDIGO NO EXISTE
  if (error || !chapita) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6 text-center">
        <div>
           <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🚫</div>
           <h1 className="text-xl font-bold text-gray-900 mb-2">Código Desconocido</h1>
           <p className="text-gray-500 text-sm">Esta chapita no está registrada en IamPaw.</p>
        </div>
      </div>
    );
  }

  // CASO 2: IR A REGISTRO
  if (!chapita.mascota_id || !chapita.mascotas) {
    return <FormularioRegistro codigo={id} />;
  }

  // CASO 3: PERFIL PÚBLICO
  const mascota = chapita.mascotas as any;
  const isLost = mascota.perdido;
  
  const mainColor = isLost ? 'bg-red-600' : 'bg-[#ff6f00]';
  const shadowColor = isLost ? 'shadow-red-200/80' : 'shadow-orange-200/80';

  return (
    <div className="min-h-screen bg-white font-sans pb-10">
      
      {/* --- HERO IMAGE --- */}
      <div className="relative h-[65vh] w-full bg-gray-200">
        {mascota.foto_url ? (
          <>
            <input type="checkbox" id="zoom-foto" className="peer hidden" />
            
            <label htmlFor="zoom-foto" className="block w-full h-full cursor-pointer relative">
                {/* REEMPLAZAMOS IMG POR IMAGE DE NEXT */}
                <Image 
                  src={mascota.foto_url} 
                  alt={mascota.nombre} 
                  fill
                  priority // Esto le dice a Next.js "cargá esta imagen primero que nada porque es vital"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
            </label>

            <div className="fixed inset-0 z-[9999] bg-black/95 hidden peer-checked:flex flex-col items-center justify-center animate-in fade-in duration-200">
                <label htmlFor="zoom-foto" className="absolute top-6 right-6 text-white cursor-pointer bg-white/10 p-3 rounded-full hover:bg-white/20 transition z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </label>
                <div className="relative w-full h-full">
                  {/* REEMPLAZAMOS IMG POR IMAGE EN EL MODAL */}
                  <Image 
                    src={mascota.foto_url} 
                    alt={mascota.nombre} 
                    fill
                    className="object-contain select-none" 
                  />
                </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-300 font-medium text-sm">Sin foto</div>
        )}
        
        <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-black/10 to-transparent ${isLost ? 'animate-pulse bg-red-900/20' : ''}`}></div>

        <div className="absolute bottom-12 left-6 right-6 pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
                {isLost ? (
                     <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded shadow-sm tracking-wider uppercase animate-bounce">🚨 ¡ESTOY PERDIDO!</span>
                ) : (
                     <span className="bg-[#ff6f00] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-sm tracking-wider uppercase">Protegido</span>
                )}
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none drop-shadow-md">{mascota.nombre}</h1>
            {isLost && <p className="text-white/90 font-bold mt-2 text-lg drop-shadow-md animate-fade-in">Por favor, ayudame a volver.</p>}
        </div>
      </div>

      {/* --- CUERPO --- */}
      <div className="relative -mt-8 bg-white rounded-t-[1.5rem] px-6 pt-6 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        
        {/* BOTÓN WHATSAPP */}
        <a 
            href={`https://wa.me/${mascota.telefono_contacto}?text=Hola! Escaneé la chapita de IamPaw y encontré a ${mascota.nombre}.`}
            target="_blank" rel="noopener noreferrer"
            className={`flex items-center justify-center w-full ${mainColor} text-white py-4 rounded-xl font-bold text-xl shadow-lg ${shadowColor} active:scale-[0.98] transition-transform mb-8 gap-2`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            {isLost ? '¡AVISAR AL DUEÑO!' : 'Contactar al Dueño'}
        </a>

        {/* --- MAPA PÚBLICO --- */}
        {mascota.lat && mascota.lng && (
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="bg-blue-50 text-blue-600 p-1.5 rounded-full"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vive por esta zona</h3>
                </div>
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-48 relative group">
                    <MapaPublico lat={mascota.lat} lng={mascota.lng} />
                    
                    <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${mascota.lat},${mascota.lng}`}
                        target="_blank" rel="noopener noreferrer"
                        className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-blue-600 text-xs font-bold px-3 py-2 rounded-lg shadow-sm flex items-center gap-1.5 hover:bg-blue-50 transition-colors z-[400]"
                    >
                        <span>Cómo llegar</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                </div>
            </div>
        )}

        {/* GRILLA DE DATOS */}
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Raza</span>
                <span className="block text-base font-bold text-gray-900 truncate">{mascota.raza || "-"}</span>
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
                <div className="text-2xl opacity-30 grayscale">{mascota.genero === 'Macho' ? '♂' : mascota.genero === 'Hembra' ? '♀' : '🐾'}</div>
            </div>
        </div>

        {/* INFO DUEÑO */}
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dueño Responsable</h3>
                    <p className="text-lg font-bold text-gray-800">{mascota.nombre_dueño || "Anónimo"}</p>
                </div>
            </div>

            {mascota.descripcion && (
                <div className={`${isLost ? 'bg-red-50 border-red-100' : 'bg-orange-50/80 border-orange-100/50'} p-4 rounded-xl border`}>
                    <h3 className={`text-[10px] font-bold ${isLost ? 'text-red-600' : 'text-[#ff6f00]'} uppercase tracking-wider mb-2 flex items-center gap-1.5`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9h.01"/><path d="M11 12h1v4h1"/><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z"/></svg>
                        Información Importante
                    </h3>
                    <p className="text-gray-800 leading-relaxed font-medium text-sm">"{mascota.descripcion}"</p>
                </div>
            )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
             <p className="text-[10px] text-gray-300 font-bold tracking-widest uppercase">Powered by IamPaw</p>
        </div>
      </div>
    </div>
  );
}