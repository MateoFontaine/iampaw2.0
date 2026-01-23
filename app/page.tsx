'use client';
import { useState } from 'react';
import PhoneMockup from '@/components/PhoneMockup';

export default function LandingPage() {
  const [demoName, setDemoName] = useState('');

  // Datos para la preview
  const defaultData = {
    nombre: demoName || "Apollo",
    raza: "Golden Retriever",
    edad: "2 Años",
    nombre_dueño: "Mateo",
    descripcion: "Soy muy amigable pero me asusto con los truenos. Si me encontrás llamá a mi papá."
  };

  const demoPhoto = "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=662&auto=format&fit=crop";

  // Función para scroll suave
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-100 selection:text-orange-600">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 transition-all">
          <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
            <div className="text-2xl font-black tracking-tighter cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                Iam<span className="text-[#ff6f00]">Paw</span>.
            </div>
            <div className="flex gap-6 items-center">
                <button onClick={() => scrollToSection('como-funciona')} className="hidden sm:block text-sm font-bold text-gray-500 hover:text-black transition">
                    Cómo funciona
                </button>
                <button onClick={() => scrollToSection('comprar')} className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#ff6f00] transition-colors shadow-lg shadow-gray-200">
                    Conseguir Chapita
                </button>
            </div>
          </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="pt-28 pb-20 lg:pt-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* TEXTO */}
        <div className="flex-1 text-center lg:text-left space-y-8 animate-slide-up">
            <div className="inline-block bg-orange-50 border border-orange-100 text-[#ff6f00] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                🚀 La evolución de la chapita
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-[0.95]">
                Si se pierde,<br/>
                <span className="text-[#ff6f00]">que vuelva rápido.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Sin aplicaciones. Sin pilas. Sin suscripciones. 
                Solo escaneá el QR y contactá al dueño al instante por WhatsApp.
            </p>

            {/* DEMO INPUT */}
            <div className="bg-gray-50 p-2 pl-6 rounded-full border border-gray-200 flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto lg:mx-0 shadow-sm focus-within:ring-2 focus-within:ring-[#ff6f00] focus-within:border-transparent transition-all">
                <input 
                    type="text" 
                    placeholder="Escribí el nombre de tu mascota..." 
                    className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-400 font-medium py-2"
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    maxLength={15}
                />
                <span className="hidden sm:block text-gray-300">|</span>
                <span className="text-xs font-bold text-[#ff6f00] whitespace-nowrap px-4 py-2 hidden sm:block">
                    Mirá el celular 👉
                </span>
            </div>
        </div>

        {/* CELULAR */}
        <div className="flex-1 flex justify-center lg:justify-end relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-100 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>
            <div className="rotate-[-2deg] hover:rotate-0 transition-transform duration-500 transform origin-center">
                <PhoneMockup data={defaultData} photoUrl={demoPhoto} />
            </div>
        </div>
      </main>


      {/* --- SECCIÓN CÓMO FUNCIONA --- */}
      <section id="como-funciona" className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black tracking-tighter mb-4 text-gray-900">¿Cómo funciona?</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Olvidate de grabar chapitas que se borran. IamPaw es tecnología simple para un problema complejo.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Paso 1 */}
                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 bg-orange-100 text-[#ff6f00] rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">📸</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">1. Escaneá</h3>
                    <p className="text-gray-500 leading-relaxed">
                        Recibís tu chapita, escaneás el código QR con tu celular y creás tu cuenta en segundos.
                    </p>
                </div>

                {/* Paso 2 */}
                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 bg-orange-100 text-[#ff6f00] rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">📝</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">2. Personalizá</h3>
                    <p className="text-gray-500 leading-relaxed">
                        Cargá la foto, datos médicos, teléfono y nombre. Podés actualizarlo cuando quieras.
                    </p>
                </div>

                {/* Paso 3 */}
                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 bg-orange-100 text-[#ff6f00] rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">🧡</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">3. Protegido</h3>
                    <p className="text-gray-500 leading-relaxed">
                        Colgale la chapita. Si alguien lo encuentra, al escanear verá tu contacto y ubicación.
                    </p>
                </div>
            </div>
        </div>
      </section>


      {/* --- SECCIÓN COMPRA / CTA --- */}
      <section id="comprar" className="py-24 bg-black text-white relative overflow-hidden">
         {/* Decoración fondo */}
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ff6f00] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

         <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
                Protegé a tu mejor amigo.
            </h2>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
                Un pequeño accesorio que hace una gran diferencia. <br/>
                Conseguí tu chapita inteligente hoy mismo.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                    href="https://wa.me/5492254596659?text=Hola!%20Quiero%20comprar%20una%20chapita%20IamPaw" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#ff6f00] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(255,111,0,0.4)] flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Comprar por WhatsApp
                </a>

                <a 
                    href="https://wa.me/5492254596659?text=Hola!%20Soy%20veterinaria%20%2F%20revendedor%20y%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20mayorista%20sobre%20las%20chapitas%20IamPaw." 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-transparent border border-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-900 transition-all"
                >
                    Soy veterinaria / revendedor
                </a>
              
            </div>

            <p className="mt-8 text-sm text-gray-500">
                📦 Envíos a todo el país (Argentina) • 🔒 Pago seguro
            </p>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xl font-black tracking-tighter">Iam<span className="text-[#ff6f00]">Paw</span>.</div>
            <p className="text-gray-400 text-sm font-medium">
                © 2026 IamPaw Argentina. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#ff6f00] hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
            </div>
        </div>
      </footer>

    </div>
  );
}