'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MapaPicker = dynamic(() => import('@/components/MapaPicker'), { 
  ssr: false, 
  loading: () => <div className="h-64 bg-gray-50 rounded-2xl animate-pulse flex items-center justify-center text-gray-400 text-sm font-medium">Cargando mapa...</div>
});

// --- COMPONENTE PREVIEW ACTUALIZADO (MUESTRA EL MAPA) ---
const EditPreviewScreen = ({ data, photoUrl, edadCompleta, coords }: { data: any, photoUrl: string | null, edadCompleta: string, coords: any }) => {
    const isLost = data.perdido;
    const [hora, setHora] = useState('9:41');
    useEffect(() => {
        const h = () => { const d = new Date(); setHora(`${d.getHours()}:${d.getMinutes().toString().padStart(2,'0')}`); };
        h(); const i = setInterval(h, 1000);
        return () => clearInterval(i);
    }, []);

    return (
      <div className="h-full w-full bg-white font-sans relative overflow-hidden rounded-[2.5rem]">
         <div className="h-12 w-full absolute top-0 z-30 flex justify-between px-7 pt-3.5 text-white font-medium select-none pointer-events-none">
            <span className="text-sm drop-shadow-md">{hora}</span>
            <div className="flex gap-1.5 items-center drop-shadow-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                <span className="text-[10px] font-bold">5G</span>
                <div className="w-6 h-3 border border-white/60 rounded-[3px] ml-1 p-0.5"><div className="h-full w-[80%] bg-white rounded-[1px]"></div></div>
            </div>
         </div>

         <div className="h-full w-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden scroll-smooth pb-8 bg-white">
            <div className="relative h-[60%] w-full bg-gray-200 shrink-0">
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
                    <h1 className="text-4xl font-black text-white tracking-tighter leading-none break-words drop-shadow-md">{data.nombre || "Tu Mascota"}</h1>
                </div>
            </div>
    
            <div className="relative -mt-8 bg-white rounded-t-[1.5rem] px-5 pt-8 pb-12 min-h-[50%] shadow-lg z-20">
                <div className={`flex items-center justify-center w-full text-white py-3 rounded-xl font-bold text-base shadow-lg mb-5 gap-2 opacity-90 ${isLost ? 'bg-red-600 shadow-red-200' : 'bg-[#ff6f00] shadow-orange-200'}`}>
                    {isLost ? '¡AVISAR AHORA!' : 'Contactar al Dueño'}
                </div>
        
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100"><span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Raza</span><span className="block text-sm font-bold text-gray-900 truncate">{data.raza || "-"}</span></div>
                    <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100"><span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Edad</span><span className="block text-sm font-bold text-gray-900 truncate">{edadCompleta}</span></div>
                </div>

                {/* --- NUEVA ZONA DE HOGAR EN PREVIEW --- */}
                {coords && (
                    <div className="mb-4 animate-in fade-in zoom-in-95 duration-500">
                        <span className="block text-[8px] font-bold text-gray-400 uppercase mb-2 tracking-widest text-center">Zona de Hogar Configurada</span>
                        <div className="w-full h-24 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center overflow-hidden relative">
                            {/* Simulamos un mapa con un estilo minimalista */}
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                            <div className="bg-white p-2 rounded-full shadow-md text-[#ff6f00] z-10">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="flex items-center gap-3 mb-4 mt-6">
                    <div className="bg-gray-100 p-1.5 rounded-full"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                    <div><span className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider">Dueño</span><p className="text-sm font-bold text-gray-800 truncate">{data.nombre_dueño || "Nombre..."}</p></div>
                </div>

                {data.descripcion && (
                    <div className={`${isLost ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100/50'} p-4 rounded-xl border text-xs text-gray-800 leading-relaxed font-medium mb-8 break-words whitespace-pre-wrap`}>
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

  const [usaUbicacion, setUsaUbicacion] = useState(false);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

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
        
        if (data.lat && data.lng) {
            setUsaUbicacion(true);
            setCoords({ lat: data.lat, lng: data.lng });
        }

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
            perdido: formData.perdido,
            lat: usaUbicacion ? coords?.lat : null,
            lng: usaUbicacion ? coords?.lng : null
        })
        .eq('id', id);

    if (error) alert(error.message);
    else window.location.href = '/dashboard';
  };

  const toggleLost = () => {
      setFormData(prev => ({ ...prev, perdido: !prev.perdido }));
  };

  if (loading) return (
    <div className="font-sans min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:gap-16 lg:p-8 transition-all">
        <div className="bg-white w-full max-w-[420px] rounded-[2.5rem] shadow-xl p-6 space-y-6 animate-pulse">
            <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
            <div className="h-48 w-full bg-gray-200 rounded-2xl"></div>
        </div>
    </div>
  );

  return (
    <div className="font-sans min-h-screen bg-gray-100 flex justify-center items-center p-4 lg:gap-16 lg:p-8 transition-all duration-500">
      
      {/* FORMULARIO */}
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

        {/* ALERTA PERDIDO */}
        <div className={`mx-6 mt-6 mb-2 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.perdido ? 'bg-red-50 border-red-500' : 'bg-white border-gray-100'}`} onClick={toggleLost}>
            <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-black uppercase tracking-widest ${formData.perdido ? 'text-red-600' : 'text-gray-400'}`}>Estado</span>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.perdido ? 'bg-red-500' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.perdido ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
            </div>
            <h3 className={`text-lg font-black ${formData.perdido ? 'text-red-600' : 'text-gray-700'}`}>
                {formData.perdido ? '🚨 ¡ESTÁ PERDIDO!' : '🏠 Está Seguro'}
            </h3>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-4 pt-2">
          {/* Foto Input */}
          <div className="flex justify-center mb-4">
            <label className="relative cursor-pointer group">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center overflow-hidden bg-gray-50 transition-all ${previewUrl ? 'border-[#ff6f00] shadow-md' : 'border-gray-100 group-hover:border-orange-200'}`}>
                    {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <span className="text-gray-300 text-xs font-bold uppercase">Foto</span>}
                </div>
            </label>
          </div>

          <input type="text" name="nombre" value={formData.nombre} required className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-medium" placeholder="Nombre" onChange={handleChange} />
          
          <div className="flex gap-3">
             <input type="number" value={edadNum} className="w-1/4 text-center py-3 bg-gray-50 rounded-xl outline-none font-medium" onChange={(e) => setEdadNum(e.target.value)} />
             <select value={edadUnidad} onChange={(e) => setEdadUnidad(e.target.value)} className="w-1/3 text-center py-3 bg-gray-50 rounded-xl outline-none font-medium">
                <option>Años</option><option>Meses</option>
             </select>
             <select name="genero" value={formData.genero} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-medium" onChange={handleChange} required>
                <option value="Macho">Macho</option><option value="Hembra">Hembra</option>
             </select>
          </div>

          <input type="tel" name="telefono" value={formData.telefono} required className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-medium" onChange={handleChange} />
          <input type="text" name="nombre_dueño" value={formData.nombre_dueño} required className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-medium" placeholder="Dueño" onChange={handleChange} />
          <textarea name="descripcion" value={formData.descripcion || ''} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-medium h-20 resize-none" placeholder="Descripción" onChange={handleChange} />

          {/* MAPA PICKER */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm text-gray-900">Ubicación (Casa)</p>
                    <button type="button" onClick={() => setUsaUbicacion(!usaUbicacion)} className={`w-11 h-6 rounded-full p-1 transition-colors ${usaUbicacion ? 'bg-[#ff6f00]' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${usaUbicacion ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
                {usaUbicacion && (
                    <div className="pt-2">
                        <MapaPicker lat={coords?.lat} lng={coords?.lng} onChange={(lat: number, lng: number) => setCoords({ lat, lng })} />
                    </div>
                )}
            </div>

          <button type="submit" disabled={updating} className={`w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all ${formData.perdido ? 'bg-red-600' : 'bg-[#ff6f00]'}`}>
            {updating ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>

      {/* IPHONE MOCKUP (DERECHA) */}
      <div className="hidden lg:block relative w-[380px] h-[780px] bg-black rounded-[3.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-[12px] border-black overflow-hidden z-0 transform rotate-1 transition-all duration-700 hover:rotate-0 hover:scale-[1.02]">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-3xl z-40 pointer-events-none"></div>
         {/* PASAMOS LAS COORDS AQUÍ PARA EL PREVIEW */}
         <EditPreviewScreen data={formData} photoUrl={previewUrl} edadCompleta={edadPreview} coords={usaUbicacion ? coords : null} />
      </div>

    </div>
  );
}