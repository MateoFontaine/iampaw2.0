'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ... (El componente ProfilePreviewScreen queda IGUAL, no lo toques) ...
// PEGALO ACÁ SI LO BORRASTE, PERO ES EL MISMO DE ANTES
const ProfilePreviewScreen = ({ data, photoUrl, edadCompleta }: { data: any, photoUrl: string | null, edadCompleta: string }) => {
    const [hora, setHora] = useState('9:41');
    useEffect(() => {
        const actualizar = () => {
            const now = new Date();
            setHora(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
        };
        actualizar();
        const i = setInterval(actualizar, 1000);
        return () => clearInterval(i);
    }, []);
    return (
      <div className="h-full w-full bg-white font-sans relative overflow-hidden rounded-[2.5rem]">
         <div className="h-12 w-full bg-transparent absolute top-0 z-30 flex justify-between px-7 pt-3.5 text-white font-medium select-none pointer-events-none">
            <span className="text-sm tracking-wide drop-shadow-md">{hora}</span>
            <div className="flex gap-1.5 items-center drop-shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                <span className="text-[10px] font-bold">5G</span>
                <div className="w-6 h-3 border border-white/60 rounded-[3px] relative ml-1 p-0.5"><div className="h-full w-[80%] bg-white rounded-[1px]"></div></div>
            </div>
         </div>
        <div className="h-full w-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden scroll-smooth pb-8 bg-white">
            <div className="relative h-[65%] w-full bg-gray-200 group cursor-default shrink-0">
            {photoUrl ? <img src={photoUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></div>}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
            <div className="absolute bottom-10 left-5 right-5 z-10">
                {data.nombre && <span className="bg-[#ff6f00] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide mb-2 inline-block animate-fade-in">Protegido</span>}
                <h1 className="text-4xl font-black text-white tracking-tighter leading-none break-words truncate drop-shadow-md">{data.nombre || "Tu Mascota..."}</h1>
            </div>
            </div>
            <div className="relative -mt-8 bg-white rounded-t-[1.5rem] px-5 pt-8 pb-12 min-h-[50%] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-20">
                <div className="flex items-center justify-center w-full bg-[#ff6f00] text-white py-3 rounded-xl font-bold text-base shadow-lg shadow-orange-200/50 mb-5 gap-2 opacity-90"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Contactar al Dueño</div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100"><span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Raza</span><span className="block text-sm font-bold text-gray-900 truncate">{data.raza || "-"}</span></div>
                    <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100"><span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Edad</span><span className="block text-sm font-bold text-gray-900 truncate">{edadCompleta}</span></div>
                    <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 col-span-2 flex justify-between items-center"><span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Sexo</span><span className="block text-sm font-bold text-gray-900">{data.genero || "-"}</span></div>
                </div>
                <div className="flex items-center gap-3 mb-4 mt-6">
                    <div className="bg-gray-100 p-1.5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                    <div><span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider">Dueño</span><p className="text-sm font-bold text-gray-800 truncate">{data.nombre_dueño || "Nombre..."}</p></div>
                </div>
                {data.descripcion && <div className="bg-orange-50/80 p-4 rounded-xl border border-orange-100/50 text-xs text-gray-800 leading-relaxed font-medium mb-8 break-words whitespace-pre-wrap"><span className="text-[#ff6f00] font-bold block mb-1 text-[9px] uppercase">Nota:</span>"{data.descripcion}"</div>}
                <div className="h-10"></div>
            </div>
        </div>
      </div>
    );
};

// --- COMPONENTE PRINCIPAL (LOGICA DE REGISTRO) ---
export default function FormularioRegistro({ codigo }: { codigo: string }) {
  const [paso, setPaso] = useState<'bienvenida' | 'formulario'>('bienvenida');
  const [loading, setLoading] = useState(false);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [edadNum, setEdadNum] = useState('');
  const [edadUnidad, setEdadUnidad] = useState('Años'); 

  // NUEVOS ESTADOS PARA AUTH
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [formData, setFormData] = useState({
    nombre: '', raza: '', genero: '', telefono: '', descripcion: '', nombre_dueño: ''
  });

  const edadPreview = edadNum ? `${edadNum} ${edadUnidad}` : '-';

  const formatearTelefonoArgentino = (input: string) => {
    let limpio = input.replace(/\D/g, '');
    if (limpio.startsWith('549')) limpio = limpio.substring(3);
    if (limpio.startsWith('54')) limpio = limpio.substring(2);
    if (limpio.startsWith('0')) limpio = limpio.substring(1);
    return `549${limpio}`;
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) { setFotoFile(file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const edadNumero = parseInt(edadNum);
    if (!edadNumero || edadNumero < 0) { alert("Edad inválida"); setLoading(false); return; }
    const edadFinal = `${edadNumero} ${edadUnidad}`;
    const telefonoFinal = formatearTelefonoArgentino(formData.telefono);

    try {
      let userId = null;

      // 1. INTENTAMOS CREAR EL USUARIO (SIGN UP)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (signUpError) {
        // 2. SI FALLA PORQUE YA EXISTE, INTENTAMOS LOGUEARLO (SIGN IN)
        if (signUpError.message.includes("already registered") || signUpError.status === 400) {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (signInError) {
                // Si falla acá, es porque puso mal la contraseña de su cuenta existente
                throw new Error("Ya existe una cuenta con este email, pero la contraseña es incorrecta.");
            }
            // Logueo exitoso, usamos este ID
            userId = signInData.user.id;
        } else {
            // Si fue otro error (ej: contraseña corta), lo tiramos
            throw signUpError;
        }
      } else {
        // Creación exitosa
        userId = signUpData.user?.id;
      }

      // 3. SUBIR FOTO
      let publicUrl = null;
      if (fotoFile) {
        const fileExt = fotoFile.name.split('.').pop();
        const fileName = `${codigo}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('fotos_mascotas').upload(fileName, fotoFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('fotos_mascotas').getPublicUrl(fileName);
        publicUrl = urlData.publicUrl;
      }

      // 4. GUARDAR MASCOTA (Asignada al userId recuperado)
      const { data: nuevaMascota, error: errorMascota } = await supabase.from('mascotas').insert([{
            nombre: formData.nombre, 
            raza: formData.raza, 
            edad: edadFinal, 
            genero: formData.genero,
            telefono_contacto: telefonoFinal, 
            descripcion: formData.descripcion, 
            nombre_dueño: formData.nombre_dueño, 
            foto_url: publicUrl,
            user_id: userId // <--- IMPORTANTE
        }]).select().single();

      if (errorMascota) throw errorMascota;

      // 5. ACTIVAR CHAPITA
      const { error: errorChapita } = await supabase.from('chapitas').update({ mascota_id: nuevaMascota.id, estado: 'activa' }).eq('codigo', codigo);
      if (errorChapita) throw errorChapita;

      // REDIRIGIR AL DASHBOARD (Para que vea sus 2 mascotas)
      window.location.href = '/dashboard';

    } catch (error: any) { 
        alert('Ups: ' + error.message); 
        setLoading(false); 
    }
  };

  if (paso === 'bienvenida') {
     return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-xl p-8 text-center border border-gray-100 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
            <div className="relative z-10 my-12">
            <h1 className="text-5xl font-black tracking-tighter text-gray-900 mb-6 leading-none">Iam<span className="text-[#ff6f00]">Paw</span>.</h1>
             <p className="text-gray-600 font-medium">Gracias por tu compra.</p>
             <button onClick={() => setPaso('formulario')} className="mt-8 w-full bg-[#ff6f00] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-orange-200 transition-all">Comenzar</button>
            </div>
          </div>
        </div>
     )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:gap-16 lg:p-8 transition-all duration-500">
      
      {/* FORMULARIO */}
      <div className="bg-white w-full max-w-[400px] rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-gray-100 z-10">
        <div className="bg-white p-6 pb-4 text-center border-b border-gray-50">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Iam<span className="text-[#ff6f00]">Paw</span></h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">ID: {codigo}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* ... Inputs de Mascota (Igual que antes) ... */}
          <div className="flex justify-center mb-4"><label className="relative cursor-pointer group"><input type="file" accept="image/*" className="hidden" onChange={handleFileChange} /><div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center overflow-hidden bg-gray-50 transition-all ${previewUrl ? 'border-[#ff6f00] shadow-md' : 'border-gray-100 group-hover:border-orange-200'}`}>{previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-1"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>}</div></label></div>
          <div className="relative group"><input type="text" name="nombre" required className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all font-medium placeholder-gray-400" placeholder="Nombre Mascota" onChange={handleChange} /></div>
          <div className="relative group"><input type="text" name="raza" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all font-medium placeholder-gray-400" placeholder="Raza" onChange={handleChange} /></div>
          <div className="flex gap-3"><div className="w-1/4"><input type="number" value={edadNum} onChange={(e) => setEdadNum(e.target.value)} className="w-full text-center py-3 bg-gray-50 rounded-xl outline-none font-medium placeholder-gray-400" placeholder="0" /></div><div className="w-1/3"><select value={edadUnidad} onChange={(e) => setEdadUnidad(e.target.value)} className="w-full text-center py-3 bg-gray-50 rounded-xl outline-none font-medium appearance-none"><option>Años</option><option>Meses</option></select></div><div className="w-full"><select name="genero" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-medium appearance-none text-gray-500 valid:text-gray-900" onChange={handleChange} required defaultValue=""><option value="" disabled>Sexo</option><option>Macho</option><option>Hembra</option></select></div></div>
          <div className="relative group"><div className="absolute left-4 top-3.5 flex items-center gap-2 pointer-events-none"><span className="text-lg">🇦🇷</span><span className="text-gray-400 font-bold text-sm tracking-tight">+54 9</span><div className="h-4 w-px bg-gray-300 ml-1"></div></div><input type="tel" name="telefono" required className="w-full pl-28 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all font-medium placeholder-gray-400" placeholder="11 1234 5678" onChange={handleChange} /></div>
          <div className="relative group"><input type="text" name="nombre_dueño" required className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all font-medium placeholder-gray-400" placeholder="Tu Nombre" onChange={handleChange} /></div>
          <div className="relative group"><textarea name="descripcion" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-medium h-16 resize-none placeholder-gray-400" placeholder="Datos Extra..." onChange={handleChange} /></div>

          <div className="h-px bg-gray-100 my-4"></div>

          {/* --- NUEVA SECCIÓN DE CUENTA --- */}
          <div className="space-y-3 bg-orange-50 p-4 rounded-2xl border border-orange-100">
             <h3 className="text-xs font-bold text-[#ff6f00] uppercase tracking-wider mb-2">Crear Cuenta (Para editar después)</h3>
             <div className="relative group">
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="w-full px-4 py-3 bg-white rounded-xl outline-none focus:ring-2 focus:ring-orange-200 transition-all font-medium placeholder-gray-400" 
                    placeholder="Tu Email" 
                />
             </div>
             <div className="relative group">
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="w-full px-4 py-3 bg-white rounded-xl outline-none focus:ring-2 focus:ring-orange-200 transition-all font-medium placeholder-gray-400" 
                    placeholder="Crear Contraseña" 
                />
             </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#ff6f00] text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all hover:shadow-orange-200 hover:bg-[#e66400]">
            {loading ? 'Creando Cuenta...' : 'Guardar y Finalizar'}
          </button>
        </form>
      </div>

      {/* IPHONE MOCKUP */}
      <div className="hidden lg:block relative w-[380px] h-[780px] bg-black rounded-[3.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-[12px] border-black overflow-hidden z-0 transform rotate-1 transition-all duration-700 hover:rotate-0 hover:scale-[1.02]">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-3xl z-40 pointer-events-none"></div>
         <ProfilePreviewScreen data={formData} photoUrl={previewUrl} edadCompleta={edadPreview} />
      </div>

    </div>
  );
}