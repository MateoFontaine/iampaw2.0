'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Home, 
  MapPin, 
  User, 
  LogOut, 
  QrCode, 
  Dog, 
  AlertTriangle, 
  ChevronRight, 
  ShieldCheck, 
  Info, 
  List, 
  Map as MapIcon 
} from 'lucide-react';

// --- IMPORTAMOS EL MAPA DINÁMICAMENTE (Para evitar errores de servidor) ---
const MapaComunitario = dynamic(() => import('@/components/MapaComunitario'), { 
  ssr: false, 
  loading: () => <div className="h-96 w-full bg-gray-100 rounded-[2.5rem] animate-pulse flex items-center justify-center text-gray-400 font-bold">Cargando Mapa de la Red...</div>
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [misMascotas, setMisMascotas] = useState<any[]>([]);
  const [alertasComunitarias, setAlertasComunitarias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  
  // ESTADOS DE NAVEGACIÓN
  const [activeTab, setActiveTab] = useState('mascotas'); 
  const [vistaAlertas, setVistaAlertas] = useState<'lista' | 'mapa'>('lista');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      
      setUserEmail(user.email || '');
      setUserId(user.id);

      // 1. TRAER MIS MASCOTAS
      const { data: misData } = await supabase
        .from('mascotas')
        .select('*, chapitas(codigo)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // 2. TRAER TODAS LAS MASCOTAS PERDIDAS (COMUNIDAD)
      const { data: globalData } = await supabase
        .from('mascotas')
        .select('*, chapitas(codigo)')
        .eq('perdido', true)
        .order('updated_at', { ascending: false });

      if (misData) setMisMascotas(misData);
      if (globalData) setAlertasComunitarias(globalData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const togglePerdido = async (id: string, estadoActual: boolean) => {
    // Actualizamos localmente para rapidez visual
    setMisMascotas(prev => prev.map(m => m.id === id ? { ...m, perdido: !estadoActual } : m));
    
    // Actualizamos en BD
    await supabase.from('mascotas').update({ perdido: !estadoActual }).eq('id', id);
    
    // Recargamos la lista global para que aparezca/desaparezca del mapa
    const { data } = await supabase.from('mascotas').select('*, chapitas(codigo)').eq('perdido', true);
    if(data) setAlertasComunitarias(data);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/'; };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin text-[#ff6f00]"><QrCode size={32} /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans text-gray-900">
      
      {/* --- SIDEBAR (PC) --- */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 fixed h-full z-20">
        <div className="p-8">
           <h1 className="text-xl font-bold tracking-tight text-black">Iam<span className="text-[#ff6f00]">Paw</span>.</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
            <button 
                onClick={() => setActiveTab('mascotas')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'mascotas' ? 'bg-orange-50 text-[#ff6f00]' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Home size={20} /> Mis Mascotas
            </button>
            <button 
                onClick={() => setActiveTab('alertas')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'alertas' ? 'bg-orange-50 text-[#ff6f00]' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <div className="relative">
                    <MapPin size={20} />
                    {alertasComunitarias.length > 0 && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>}
                </div>
                Red de Alertas
            </button>
            <button 
                onClick={() => setActiveTab('perfil')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'perfil' ? 'bg-orange-50 text-[#ff6f00]' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <User size={20} /> Mi Perfil
            </button>
        </nav>

        <div className="p-4 border-t border-gray-50">
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 w-full px-2 transition-colors">
                <LogOut size={16} /> Cerrar Sesión
            </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 md:ml-64 min-h-screen pb-24 md:pb-10">
        
        {/* HEADER MÓVIL */}
        <header className="md:hidden bg-white/90 backdrop-blur-sm sticky top-0 z-10 px-6 py-4 flex justify-between items-center border-b border-gray-100">
            <div className="text-lg font-bold tracking-tight">
                {activeTab === 'mascotas' ? 'Mis Mascotas' : activeTab === 'alertas' ? 'Red de Alertas' : 'Perfil'}
            </div>
            <button onClick={handleLogout} className="text-gray-400"><LogOut size={18}/></button>
        </header>

        <div className="p-6 max-w-5xl mx-auto">
            
            {/* --- VISTA: MIS MASCOTAS --- */}
            {activeTab === 'mascotas' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
                    {misMascotas.length === 0 && (
                        <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#ff6f00]"><Dog size={28} /></div>
                            <h3 className="font-bold text-gray-900 mb-1">Aún no tenés mascotas</h3>
                            <p className="text-gray-500 text-sm">Registrá tu primera chapita para empezar.</p>
                        </div>
                    )}

                    {misMascotas.map((m) => {
                        const codigo = m.chapitas?.[0]?.codigo;
                        return (
                            <div key={m.id} className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${m.perdido ? 'border-red-100 ring-2 ring-red-50' : 'border-gray-100 hover:border-orange-100'}`}>
                                <div className="flex items-center gap-4 mb-5">
                                    <div className={`w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 ${m.perdido ? 'border-red-500' : 'border-white shadow-sm'}`}>
                                        {m.foto_url ? <img src={m.foto_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center">🐶</div>}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{m.nombre}</h3>
                                        <p className={`text-xs font-black uppercase tracking-widest ${m.perdido ? 'text-red-500' : 'text-gray-400'}`}>{m.perdido ? '¡PERDIDO!' : 'EN CASA'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                                    <Link href={`/dashboard/edit/${m.id}`} className="text-gray-600 bg-gray-50 py-2.5 rounded-xl text-xs font-bold text-center hover:bg-gray-100 transition-colors">
                                        Editar
                                    </Link>
                                    <button 
                                        onClick={() => togglePerdido(m.id, m.perdido)}
                                        className={`py-2.5 rounded-xl text-xs font-bold text-center transition-all ${m.perdido ? 'bg-green-500 text-white' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                                    >
                                        {m.perdido ? '¡Apareció!' : 'Reportar Perdido'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- VISTA: ALERTAS COMUNITARIAS --- */}
            {activeTab === 'alertas' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6 mt-2 md:mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                                <AlertTriangle className="text-red-500" /> Red de Emergencia
                            </h2>
                            <p className="text-gray-500 text-sm font-medium">Mascotas buscando su hogar en este momento.</p>
                        </div>

                        {/* INTERRUPTOR LISTA / MAPA */}
                        <div className="bg-gray-100 p-1 rounded-xl flex self-start">
                            <button 
                                onClick={() => setVistaAlertas('lista')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${vistaAlertas === 'lista' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List size={16} /> Lista
                            </button>
                            <button 
                                onClick={() => setVistaAlertas('mapa')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${vistaAlertas === 'mapa' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <MapIcon size={16} /> Mapa
                            </button>
                        </div>
                    </div>

                    {alertasComunitarias.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                            <ShieldCheck size={48} className="mx-auto mb-4 text-green-500 opacity-20" />
                            <h3 className="text-xl font-bold text-gray-900">Zona Segura</h3>
                            <p className="text-gray-500">No hay alertas activas en la red IamPaw.</p>
                        </div>
                    ) : (
                        <>
                            {/* --- MODO LISTA --- */}
                            {vistaAlertas === 'lista' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {alertasComunitarias.map((pet) => {
                                        const esMia = pet.user_id === userId;
                                        return (
                                            <Link 
                                                href={esMia ? `/dashboard/edit/${pet.id}` : `/p/${pet.chapitas?.[0]?.codigo}`} 
                                                key={pet.id} 
                                                className="block group"
                                            >
                                                <div className={`bg-white border-2 rounded-[2rem] p-4 flex items-center gap-4 transition-all shadow-sm group-hover:shadow-lg ${esMia ? 'border-orange-200 bg-orange-50/20' : 'border-red-100'}`}>
                                                    <div className="relative shrink-0">
                                                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-10"></div>
                                                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-red-500 relative z-10 bg-gray-50">
                                                            {pet.foto_url ? <img src={pet.foto_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🐾</div>}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest animate-pulse">Perdido</span>
                                                            {esMia && <span className="bg-orange-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Es mío</span>}
                                                        </div>
                                                        <h3 className="text-lg font-black text-gray-900 leading-tight truncate">{pet.nombre}</h3>
                                                        <p className="text-gray-500 text-[10px] font-bold uppercase truncate">{pet.raza || 'Raza no especificada'}</p>
                                                    </div>

                                                    <div className="text-gray-300 group-hover:text-red-500 transition-colors pr-1">
                                                        <ChevronRight size={20} strokeWidth={3} />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}

                            {/* --- MODO MAPA --- */}
                            {vistaAlertas === 'mapa' && (
                                <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden border-2 border-gray-200 shadow-xl relative animate-in zoom-in-95 duration-300">
                                    <MapaComunitario mascotas={alertasComunitarias} userId={userId} />
                                    
                                    {/* Leyenda flotante */}
                                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-xl text-[10px] font-bold shadow-sm z-[1000] flex flex-col gap-1">
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div>Comunidad</div>
                                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div>Mis Mascotas</div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div className="mt-8 bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-4">
                        <div className="bg-white p-2 rounded-lg text-blue-500 shadow-sm"><Info size={20} /></div>
                        <p className="text-xs text-blue-800 font-medium leading-relaxed">
                            Si ves a una de estas mascotas, hacé clic en su ficha para contactar al dueño. Si una mascota tuya se pierde, activá la alerta en "Mis Mascotas" para que aparezca acá.
                        </p>
                    </div>
                </div>
            )}

            {/* --- VISTA: PERFIL --- */}
            {activeTab === 'perfil' && (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                        <User size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{userEmail}</h2>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto mt-2">Próximamente podrás gestionar tu suscripción y cambiar tu contraseña desde acá.</p>
                </div>
            )}

        </div>
      </main>

      {/* --- NAVBAR MÓVIL --- */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-100 flex justify-around items-center pb-safe pt-1 z-50 h-[70px]">
          <button onClick={() => setActiveTab('mascotas')} className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'mascotas' ? 'text-[#ff6f00]' : 'text-gray-400'}`}>
              <Home size={22} strokeWidth={activeTab === 'mascotas' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Mis Mascotas</span>
          </button>
          <button onClick={() => setActiveTab('alertas')} className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'alertas' ? 'text-[#ff6f00]' : 'text-gray-400'}`}>
              <div className="relative">
                <MapPin size={22} strokeWidth={activeTab === 'alertas' ? 2.5 : 2} />
                {alertasComunitarias.length > 0 && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>}
              </div>
              <span className="text-[10px] font-bold">Alertas</span>
          </button>
          <button onClick={() => setActiveTab('perfil')} className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'perfil' ? 'text-[#ff6f00]' : 'text-gray-400'}`}>
              <User size={22} strokeWidth={activeTab === 'perfil' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Perfil</span>
          </button>
      </nav>

    </div>
  );
}