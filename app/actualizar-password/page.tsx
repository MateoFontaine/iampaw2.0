'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Lock, CheckCircle2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ActualizarPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Supabase automáticamente lee el token temporal que viene en la URL
  // cuando el usuario hace clic en el mail.

  const handleActualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Esta es la función mágica que actualiza la contraseña del usuario autenticado por el link
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
    } else {
      setExito(true);
      // Lo mandamos al dashboard después de 2 segundos
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
    setLoading(false);
  };

  return (
    // ✅ COMO TIENE QUE QUEDAR
<div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        
        {exito ? (
          <div className="text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">¡Contraseña Actualizada!</h2>
            <p className="text-gray-500">Entrando a tu panel...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-black text-center text-gray-900 mb-2">Nueva Contraseña</h2>
            <p className="text-center text-gray-500 mb-8 text-sm">
              Ingresá tu nueva clave segura para I Am Paw.
            </p>

            <form onSubmit={handleActualizar} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                <div className="relative mt-1">
                  <span className="absolute left-4 top-3.5 text-gray-400"><Lock size={18} /></span>
                  <input 
                    type="password" 
                    required 
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#ff6f00] focus:ring-2 focus:ring-orange-100 transition-all font-medium text-gray-900" 
                    placeholder="Mínimo 6 caracteres" 
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg">{error}</p>}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar y Entrar'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}