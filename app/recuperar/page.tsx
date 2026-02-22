'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/actualizar-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setEnviado(true);
    }
    setLoading(false);
  };

  return (
    // ACÁ ESTABA EL PROBLEMA: Faltaba el "font-sans" para que respete tu tipografía
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ff6f00]">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-black text-center text-gray-900 mb-2">Recuperar Acceso</h2>
        
        {enviado ? (
          <div className="text-center animate-in fade-in">
            <p className="text-gray-500 mb-6">
              Te enviamos un correo a <span className="font-bold text-gray-900">{email}</span> con un enlace para actualizar tu contraseña.
            </p>
            <Link href="/login" className="text-[#ff6f00] font-bold hover:underline">
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-500 mb-8 text-sm">
              Ingresá el correo con el que registraste a tu mascota y te enviaremos un link seguro.
            </p>

            <form onSubmit={handleRecuperar} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                <div className="relative mt-1">
                  <span className="absolute left-4 top-3.5 text-gray-400"><Mail size={18} /></span>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#ff6f00] focus:ring-2 focus:ring-orange-100 transition-all font-medium text-gray-900" 
                    placeholder="ejemplo@correo.com" 
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg">{error}</p>}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-[#ff6f00] hover:bg-[#e66400] text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Enviando link...' : 'Enviar link de recuperación'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-gray-400 hover:text-gray-600 font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft size={16} /> Volver
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}