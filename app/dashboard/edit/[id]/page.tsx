'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- COMPONENTE PREVIEW (LOCAL) ---
const EditPreviewScreen = ({ data, photoUrl, edadCompleta }: { data: any, photoUrl: string | null, edadCompleta: string }) => {
    const isLost = data.perdido;
    const [hora, setHora] = useState('9:41');
    useEffect(() => {
        const h = () => { const d = new Date(); setHora(`${d.getHours()}:${d.getMinutes().toString().padStart(2,'0')}`); };
        h(); setInterval(h, 1000);
    }, []);

    return (
      <div className="h-full w-full bg-white font-sans relative overflow-hidden rounded-[2.5rem]">
         {/* Barra Estado */}
         <div className="h-12 w-full absolute top-0 z-30 flex justify-between px-7 pt-3.5 text-white font-medium select-none pointer-events-none">
            <span className="text-sm drop-shadow-md">{hora}</span>
            <div className="flex gap-1.5 items-center drop-shadow-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                <span className="text-[10px] font-bold">5G</span>
                <div className="w-6 h-3 border border-white/60 rounded-[3px] ml-1 p-0.5"><div className="h-full w-[80%] bg-white rounded-[1px]"></div></div>
            </div>
         </div>

         <div className="h-full w-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden scroll-smooth pb-8 bg-white">
            {/* FOTO HERO */}
            <div className="relative h-[65%] w-full bg-gray-200 shrink-0">
                {photoUrl ? <img src={photoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">Sin Foto</div>}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent ${isLost ? 'animate-pulse bg-red-900/30' : ''}`}></div>
                
                <div className="absolute bottom-10 left-5 right-5 z-10">
                    <div className="flex items-center gap-1.5 mb-2">
                        {isLost ? (
                             <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wide animate-bounce">🚨 ¡ESTOY PERDIDO!</span>
                        ) : (
                             <span className="bg-[#ff6f00] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">Protegido</span>
                        )}
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter leading-none break-words drop-shadow-md">{data.nombre}</h1>
                    {isLost && <p className="text-white/90 font-bold mt-1 text-sm drop-shadow-md">Ayudame a volver.</p>}
                </div>
            </div>
    
            {/* CUERPO */}
            <div className="relative -mt-8 bg-white rounded-t-[1.5rem] px-5 pt-8 pb-12 min-h-[50%] shadow-lg z-20">
                <div className={`flex items-center justify-center w-full text-white py-3 rounded-xl font-bold text-base shadow-lg mb-5 gap-2 opacity-90 ${isLost ? 'bg-red-600 shadow-red-200' : 'bg-[#ff6f00] shadow-orange-200'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    {isLost ? '¡AVISAR AHORA!' : 'Contactar al Dueño'}
                </div>
        
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100"><span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Raza</span><span className="block text-sm font-bold text-gray-900 truncate">{data.raza || "-"}</span></div>
                    <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100"><span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Edad</span><span className="block text-sm font-bold text-gray-900 truncate">{edadCompleta}</span></div>
                    <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 col-span-2 flex justify-between items-center"><span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Sexo</span><span className="block text-sm font-bold text-gray-900">{data.genero || "-"}</span></div>
                </div>
                
                <div className="flex items-center gap-3 mb-4 mt-6">
                    <div className="bg-gray-100 p-1.5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                    <div><span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider">Dueño</span><p className="text-sm font-bold text-gray-800 truncate">{data.nombre_dueño || "Nombre..."}</p></div>
                </div>

                {data.descripcion && (
                    <div className={`${isLost ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100/50'} p-4 rounded-xl border text-xs text-gray-800 leading-relaxed font-medium mb-8 break-words whitespace-pre-wrap`}>
                        <span className={`${isLost ? 'text-red-600' : 'text-[#ff6f00]'} font-bold block mb-1 text-[9px] uppercase`}>Nota:</span>
                        "{data.descripcion}"
                    </div>
                )}
                <div className="h-10"></div>
            </div>
        </div>
      </div>
    );
};

export default function EditMascotaPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [edadNum, setEdadNum] = useState('');
  const [edadUnidad, setEdadUnidad] = useState('Años');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '', raza: '', genero: '', telefono: '', descripcion: '', nombre_dueño: '', perdido: false
  });

  useEffect(() => {
    const fetchMascota = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { window.location.href = '/login'; return; }

        const { data, error } = await supabase
            .from('mascotas')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error) { window.location.href = '/dashboard'; return; }

        const edadParts = data.edad ? data.edad.split(' ') : ['0', 'Años'];
        setEdadNum(edadParts[0]);
        setEdadUnidad(edadParts[1] || 'Años');

        let telDisplay = data.telefono_contacto || '';
        if(telDisplay.startsWith('549')) telDisplay = telDisplay.substring(3);

        setFormData({
            nombre: data.nombre,
            raza: data.raza,
            genero: data.genero,
            telefono: telDisplay,
            descripcion: data.descripcion,
            nombre_dueño: data.nombre_dueño || '',
            perdido: data.perdido
        });
        setPreviewUrl(data.foto_url);
        setLoading(false);
    };
    fetchMascota();
  }, [id]);

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

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setUpdating(true);
    
    const edadFinal = `${edadNum} ${edadUnidad}`;
    const telefonoFinal = formatearTelefonoArgentino(formData.telefono);

    let finalFotoUrl = previewUrl;

    if (fotoFile) {
        const fileExt = fotoFile.name.split('.').pop();
        const fileName = `edit-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('fotos_mascotas').upload(fileName, fotoFile);
        if (!uploadError) {
            const { data: urlData } = supabase.storage.from('fotos_mascotas').getPublicUrl(fileName);
            finalFotoUrl = urlData.publicUrl;
        }
    }

    const { error } = await supabase
        .from('mascotas')
        .update({
            nombre: formData.nombre,
            raza: formData.raza,
            edad: edadFinal,
            genero: formData.genero,
            telefono_contacto: telefonoFinal,
            descripcion: formData.descripcion,
            nombre_dueño: formData.nombre_dueño,
            foto_url: finalFotoUrl,
            perdido: formData.perdido
        })
        .eq('id', id);

    if (error) alert(error.message);
    else window.location.href = '/dashboard';
  };

  const toggleLost = () => {
      setFormData(prev => ({ ...prev, perdido: !prev.perdido }));
  };

  if (loading) return (
    <div className=" font-sans min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:gap-16 lg:p-8">
      {/* SKELETON */}
      <div className="bg-white w-full max-w-[420px] rounded-[2.5rem] shadow-xl border border-gray-100 p-6 space-y-6 animate-pulse">
          <div className="flex justify-between items-center pb-4 border-b border-gray-50">
             <div className="space-y-2">
                 <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
                 <div className="h-3 w-32 bg-gray-200 rounded-md"></div>
             </div>
             <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-sm"></div>
          </div>
          <div className="space-y-4">
              <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
              <div className="flex gap-3">
                  <div className="h-12 w-1/4 bg-gray-200 rounded-xl"></div>
                  <div className="h-12 w-1/3 bg-gray-200 rounded-xl"></div>
                  <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
              </div>
              <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
              <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
              <div className="h-20 w-full bg-gray-200 rounded-xl"></div>
          </div>
          <div className="h-14 w-full bg-gray-200 rounded-xl mt-4"></div>
      </div>
    </div>
  );

  return (
    <div  className=" font-sans min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:gap-16 lg:p-8 transition-all duration-500">
      
      {/* --- COLUMNA IZQUIERDA: EL FORMULARIO --- */}
      <div className="bg-white w-full max-w-[420px] rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 z-10 animate-slide-up">
        
        <div className="bg-white p-6 pb-2 border-b border-gray-50 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Editar</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Datos de la mascota</p>
            </div>
            <a href="/dashboard" className="text-xs font-bold text-gray-400 hover:text-gray-900 bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                Cancelar
            </a>
        </div>

        {/* ZONA DE ALERTA */}
        <div className={`mx-6 mt-6 mb-2 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${formData.perdido ? 'bg-red-50 border-red-500' : 'bg-white border-gray-100 hover:border-gray-300'}`} onClick={toggleLost}>
            <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-black uppercase tracking-widest ${formData.perdido ? 'text-red-600' : 'text-gray-400'}`}>
                    Estado Actual
                </span>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.perdido ? 'bg-red-500' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.perdido ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
            </div>
            <h3 className={`text-lg font-black ${formData.perdido ? 'text-red-600' : 'text-gray-700'}`}>
                {formData.perdido ? '🚨 ¡ESTÁ PERDIDO!' : '🏠 Está Seguro en Casa'}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1">Tocá acá para cambiar el estado.</p>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-4 pt-2">
          
          {/* FOTO */}
          <div className="flex justify-center mb-4">
            <label className="relative cursor-pointer group">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center overflow-hidden bg-gray-50 transition-all ${previewUrl ? 'border-[#ff6f00] shadow-md' : 'border-gray-100 group-hover:border-orange-200'}`}>
                    {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <span className="text-gray-300 text-xs font-bold uppercase">Foto</span>}
                </div>
                <div className="absolute bottom-0 right-0 bg-gray-900 text-white p-1.5 rounded-full shadow-md"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></div>
            </label>
          </div>

          <div className="relative group">
              <input 
                type="text" name="nombre" value={formData.nombre} required 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all font-medium text-black placeholder-gray-400" 
                placeholder="Nombre" onChange={handleChange} 
              />
          </div>
          
          <div className="flex gap-3">
             <div className="w-1/4">
                <input 
                    type="number" value={edadNum} 
                    className="w-full text-center py-3 bg-gray-50 rounded-xl outline-none font-medium text-black placeholder-gray-400" 
                    onChange={(e) => setEdadNum(e.target.value)} 
                />
             </div>
             <div className="w-1/3">
                <select value={edadUnidad} onChange={(e) => setEdadUnidad(e.target.value)} className="w-full text-center py-3 bg-gray-50 rounded-xl outline-none font-medium appearance-none text-black">
                    <option>Años</option><option>Meses</option>
                </select>
             </div>
             <div className="w-full">
                <select name="genero" value={formData.genero} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-medium appearance-none text-black" onChange={handleChange} required>
                    <option value="Macho">Macho</option><option value="Hembra">Hembra</option>
                </select>
             </div>
          </div>

          {/* TELEFONO */}
          <div className="relative group">
            <div className="absolute left-4 top-3.5 flex items-center gap-2 pointer-events-none"><span className="text-lg">🇦🇷</span><span className="text-gray-400 font-bold text-sm tracking-tight">+54 9</span><div className="h-4 w-px bg-gray-300 ml-1"></div></div>
            <input 
                type="tel" name="telefono" value={formData.telefono} required 
                className="w-full pl-28 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all font-medium text-black placeholder-gray-400" 
                onChange={handleChange} 
            />
          </div>

          <div className="relative group">
            <input 
                type="text" name="nombre_dueño" value={formData.nombre_dueño} required 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all font-medium text-black placeholder-gray-400" 
                placeholder="Nombre del Dueño" onChange={handleChange} 
            />
          </div>

          <div className="relative group">
            <textarea 
                name="descripcion" value={formData.descripcion || ''} 
                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-medium h-20 resize-none text-black placeholder-gray-400" 
                placeholder="Datos Extra..." onChange={handleChange} 
            />
          </div>

          <button type="submit" disabled={updating} className={`w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all hover:shadow-xl ${formData.perdido ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-[#ff6f00] hover:bg-[#e66400] shadow-orange-200'}`}>
            {updating ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>

      {/* --- COLUMNA DERECHA: EL IPHONE MOCKUP --- */}
      <div className="hidden lg:block relative w-[380px] h-[780px] bg-black rounded-[3.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-[12px] border-black overflow-hidden z-0 transform rotate-1 transition-all duration-700 hover:rotate-0 hover:scale-[1.02]">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-3xl z-40 pointer-events-none"></div>
         <EditPreviewScreen data={formData} photoUrl={previewUrl} edadCompleta={edadPreview} />
      </div>

    </div>
  );
}