'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { 
  Home, 
  MapPin, 
  User, 
  LogOut, 
  QrCode, 
  Plus, 
  Dog,
  AlertTriangle,
  Sparkles,
  Construction
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('mascotas'); // 'mascotas', 'alertas', 'perfil'

  useEffect(() => {
    const fetchMascotas = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUserEmail(user.email || '');

      const { data } = await supabase
        .from('mascotas')
        .select('*, chapitas(codigo)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setMascotas(data);
      setLoading(false);
    };
    fetchMascotas();
  }, []);

  // --- FUNCIÓN: CAMBIAR ESTADO PERDIDO/ENCONTRADO ---
  const togglePerdido = async (id: string, estadoActual: boolean) => {
    // 1. Optimismo en UI (Cambia instantáneo para que se sienta rápido)
    setMascotas(prev => prev.map(m => m.id === id ? { ...m, perdido: !estadoActual } : m));

    // 2. Actualizar en Supabase
    const { error } = await supabase
        .from('mascotas')
        .update({ perdido: !estadoActual })
        .eq('id', id);

    // 3. Si falla, revertimos el cambio (Rollback)
    if (error) {
        alert('Hubo un error al actualizar. Revisá tu conexión.');
        setMascotas(prev => prev.map(m => m.id === id ? { ...m, perdido: estadoActual } : m));
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/'; };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin text-[#ff6f00]"><QrCode /></div></div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans text-gray-900">
      
      {/* =========================================================
          SIDEBAR (PC)
         ========================================================= */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 fixed h-full z-20">
        <div className="p-8">
           <h1 className="text-xl font-bold tracking-tight">Iam<span className="text-[#ff6f00]">Paw</span>.</h1>
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
                <MapPin size={20} /> Alertas
            </button>
            <button 
                onClick={() => setActiveTab('perfil')}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'perfil' ? 'bg-orange-50 text-[#ff6f00]' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <User size={20} /> Perfil
            </button>
        </nav>

        <div className="p-4 border-t border-gray-50">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-8 h-8 bg-[#ff6f00]/10 rounded-full flex items-center justify-center text-xs font-bold text-[#ff6f00]">
                    {userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="text-xs text-gray-400 font-medium truncate w-32">{userEmail}</div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 w-full px-2 transition-colors">
                <LogOut size={16} /> Cerrar Sesión
            </button>
        </div>
      </aside>

      {/* =========================================================
          CONTENIDO PRINCIPAL
         ========================================================= */}
      <main className="flex-1 md:ml-64 min-h-screen pb-24 md:pb-10">
        
        {/* HEADER MÓVIL */}
        <header className="md:hidden bg-white/90 backdrop-blur-sm sticky top-0 z-10 px-6 py-4 flex justify-between items-center border-b border-gray-100 shadow-sm">
            <div className="text-lg font-bold tracking-tight">
                {activeTab === 'mascotas' ? 'Mis Mascotas' : activeTab === 'alertas' ? 'Alertas' : 'Mi Perfil'}
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500"><LogOut size={18}/></button>
        </header>

        <div className="p-6 max-w-5xl mx-auto">
            
            {/* VISTA: MIS MASCOTAS */}
            {activeTab === 'mascotas' && (
                <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-2 md:mt-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 hidden md:block tracking-tight">Panel de Control</h2>
                            <p className="text-gray-500 text-sm font-medium mt-1">Gestioná la seguridad de tus compañeros.</p>
                        </div>
                        
                        {/* Botón Naranja (Acción Principal) */}
                       {/*  <Link href="/dashboard/new" className="bg-[#ff6f00] text-white px-5 py-3 rounded-full font-bold text-sm shadow-lg shadow-orange-200 hover:bg-[#e66400] transition-all flex items-center justify-center gap-2 transform active:scale-95">
                            <Plus size={20} strokeWidth={3} />
                            <span>Agregar Mascota</span>
                        </Link> */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {mascotas.length === 0 && (
                            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#ff6f00]">
                                    <Dog size={28} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">Aún no tenés mascotas</h3>
                                <p className="text-gray-500 text-sm">Registrá tu primera chapita para empezar.</p>
                            </div>
                        )}

                        {mascotas.map((m) => {
                            const codigo = m.chapitas?.[0]?.codigo;
                            return (
                                <div key={m.id} className={`bg-white rounded-2xl p-5 shadow-sm border transition-all group ${m.perdido ? 'border-red-100 ring-2 ring-red-50' : 'border-gray-100 hover:border-orange-100 hover:shadow-md'}`}>
                                    
                                    {/* Estado + QR */}
                                    <div className="flex items-start justify-between mb-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${m.perdido ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-green-50 text-green-600'}`}>
                                            {m.perdido ? <AlertTriangle size={12} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                                            {m.perdido ? '¡PERDIDO!' : 'EN CASA'}
                                        </span>
                                        {codigo && (
                                            <Link href={`/p/${codigo}`} target="_blank" className="text-gray-300 hover:text-[#ff6f00] transition p-1 hover:bg-orange-50 rounded-md">
                                                <QrCode size={18} />
                                            </Link>
                                        )}
                                    </div>

                                    {/* Foto y Datos */}
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className={`w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 ${m.perdido ? 'border-red-500' : 'border-white shadow-sm'}`}>
                                            {m.foto_url ? <img src={m.foto_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 text-xl">🐶</div>}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{m.nombre}</h3>
                                            <p className="text-sm text-gray-500 font-medium">{m.raza}</p>
                                        </div>
                                    </div>

                                    {/* Botones de Acción */}
                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                                        <Link href={`/dashboard/edit/${m.id}`} className="text-gray-600 bg-gray-50 py-2.5 rounded-xl text-xs font-bold text-center hover:bg-gray-100 transition-colors">
                                            Editar Perfil
                                        </Link>
                                        <button 
                                            onClick={() => togglePerdido(m.id, m.perdido)}
                                            className={`py-2.5 rounded-xl text-xs font-bold text-center transition-colors shadow-sm active:scale-95 ${m.perdido ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                                        >
                                            {m.perdido ? '¡Lo encontré!' : 'Reportar Perdido'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* VISTA: PRÓXIMAMENTE (Alertas y Perfil) */}
            {(activeTab === 'alertas' || activeTab === 'perfil') && (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-[#ff6f00]">
                        {activeTab === 'alertas' ? <Construction size={40} /> : <Sparkles size={40} />}
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Próximamente</h2>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                        Estamos trabajando para traerte la mejor experiencia en la sección de {activeTab === 'alertas' ? 'alertas comunitarias' : 'gestión de perfil'}.
                    </p>
                    <button onClick={() => setActiveTab('mascotas')} className="text-[#ff6f00] font-bold text-sm hover:underline">
                        Volver a mis mascotas
                    </button>
                </div>
            )}

        </div>
      </main>

      {/* =========================================================
          BOTTOM NAVIGATION (MÓVIL)
         ========================================================= */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-100 flex justify-around items-center pb-safe pt-1 z-50 h-[70px]">
          <button 
            onClick={() => setActiveTab('mascotas')}
            className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'mascotas' ? 'text-[#ff6f00]' : 'text-gray-400'}`}
          >
              <Home size={22} strokeWidth={activeTab === 'mascotas' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Inicio</span>
          </button>

          <button 
            onClick={() => setActiveTab('alertas')}
            className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'alertas' ? 'text-[#ff6f00]' : 'text-gray-400'}`}
          >
              <MapPin size={22} strokeWidth={activeTab === 'alertas' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Alertas</span>
          </button>

          <button 
            onClick={() => setActiveTab('perfil')}
            className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${activeTab === 'perfil' ? 'text-[#ff6f00]' : 'text-gray-400'}`}
          >
              <User size={22} strokeWidth={activeTab === 'perfil' ? 2.5 : 2} />
              <span className="text-[10px] font-bold">Perfil</span>
          </button>
      </nav>

    </div>
  );
}