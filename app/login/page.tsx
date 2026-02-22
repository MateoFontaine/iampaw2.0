'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link'; // <-- AGREGAMOS EL LINK DE NEXT

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
        email, password
    });

    if (error) {
        alert("Error: " + error.message);
        setLoading(false);
    } else {
        window.location.href = '/dashboard';
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
                {/* Título en NEGRO PURO */}
                <h1 className="text-3xl font-black text-black">Iam<span className="text-[#ff6f00]">Paw</span>.</h1>
                <p className="text-gray-400 font-medium">Ingresá a tu cuenta</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <input 
                    type="email" placeholder="Email" required 
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 font-medium text-black placeholder-gray-400"
                    onChange={(e) => setEmail(e.target.value)}
                />
                
                {/* CONTENEDOR DE PASSWORD + OLVIDÉ MI CONTRASEÑA */}
                <div>
                    <input 
                        type="password" placeholder="Contraseña" required 
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 font-medium text-black placeholder-gray-400"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    <div className="flex justify-end mt-2">
                        <Link 
                            href="/recuperar" 
                            className="text-xs font-bold text-gray-400 hover:text-[#ff6f00] transition-colors"
                        >
                            ¿Te olvidaste la contraseña?
                        </Link>
                    </div>
                </div>

                <button 
                    disabled={loading}
                    className="w-full bg-[#ff6f00] text-white py-4 mt-2 rounded-xl font-bold shadow-lg hover:shadow-orange-200 transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Entrando...' : 'Iniciar Sesión'}
                </button>
            </form>
        </div>
    </div>
  );
}