'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchMascotas = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }
      setUserEmail(user.email || '');

      // TRUCO: Traemos las mascotas Y sus chapitas asociadas para tener el código
      const { data, error } = await supabase
        .from('mascotas')
        .select('*, chapitas(codigo)') 
        .eq('user_id', user.id);

      if (data) setMascotas(data);
      setLoading(false);
    };
    fetchMascotas();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/'; };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8 animate-pulse">
            <div className="space-y-2">
                <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-4 w-20 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Cards Skeleton (Simulamos 2 tarjetas) */}
        <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
                <div key={i} className="bg-white p-4 rounded-[2rem] border border-gray-100 flex gap-4 items-center shadow-sm">
                    {/* Foto Skeleton */}
                    <div className="w-24 h-24 shrink-0 rounded-2xl bg-gray-200 animate-pulse"></div>
                    
                    {/* Textos Skeleton */}
                    <div className="flex-1 space-y-3">
                        <div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded-md animate-pulse"></div>
                        <div className="flex gap-2 pt-1">
                            <div className="h-8 w-16 bg-gray-200 rounded-xl animate-pulse"></div>
                            <div className="h-8 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900">Mis Mascotas</h1>
                <p className="text-gray-500 text-sm">Gestioná tus alertas</p>
            </div>
            <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-700">Salir</button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            {mascotas.map((m) => {
                // Obtenemos el código de la primera chapita asociada
                const codigo = m.chapitas?.[0]?.codigo; 

                return (
                <div key={m.id} className={`bg-white p-4 rounded-[2rem] shadow-xl border-2 flex gap-4 items-center relative overflow-hidden transition-all ${m.perdido ? 'border-red-500 shadow-red-100' : 'border-gray-100 shadow-gray-200/50'}`}>
                    
                    {/* Indicador de Estado */}
                    <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-wider ${m.perdido ? 'bg-red-500 text-white' : 'bg-green-100 text-green-600'}`}>
                        {m.perdido ? '¡Perdido!' : 'En Casa'}
                    </div>

                    <div className="w-24 h-24 shrink-0 rounded-2xl bg-gray-100 overflow-hidden">
                        {m.foto_url ? <img src={m.foto_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300">🐾</div>}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-gray-900 truncate">{m.nombre}</h2>
                        <p className="text-gray-500 text-sm mb-3">{m.raza}</p>
                        
                        <div className="flex gap-2">
                            {/* LINK VER PERFIL (Público) */}
                            {codigo && (
                                <a href={`/p/${codigo}`} target="_blank" className="text-xs bg-gray-100 text-gray-600 px-3 py-2 rounded-xl font-bold hover:bg-gray-200 transition">
                                    Ver QR
                                </a>
                            )}
                            
                            {/* LINK EDITAR (Privado) */}
                            <a href={`/dashboard/edit/${m.id}`} className="text-xs bg-[#ff6f00] text-white px-3 py-2 rounded-xl font-bold hover:bg-[#e66400] transition">
                                Editar / Alerta
                            </a>
                        </div>
                    </div>
                </div>
            )})}
        </div>
      </div>
    </div>
  );
}