'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { QrCode, ShieldAlert, TrendingUp, TrendingDown, DollarSign, Plus, Globe, Package, Trash2, Banknote, Smartphone, X, Info } from 'lucide-react';

const MapaComunitario = dynamic(() => import('@/components/MapaComunitario'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-gray-800 rounded-3xl animate-pulse flex items-center justify-center text-gray-500 font-bold border border-gray-700">Cargando Radar Global...</div>
});

const ADMIN_EMAILS = [
  'mateo@mateo.com', 
  'email.de.tu.novia@gmail.com'
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const [transacciones, setTransacciones] = useState<any[]>([]);
  // Sumamos los estados para efectivo y transferencia al balance
  const [balance, setBalance] = useState({ ingresos: 0, egresos: 0, total: 0, stock: 0, ingEfectivo: 0, ingTransf: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mascotasUbicadas, setMascotasUbicadas] = useState<any[]>([]);

  // Estado para el MODAL de Ingresos
  const [showIngresosModal, setShowIngresosModal] = useState(false);

  const [formData, setFormData] = useState({
    tipo: 'ingreso',
    monto: '',
    cantidad: 1,
    metodo_pago: 'transferencia', 
    categoria: 'Venta Chapita',
    descripcion: ''
  });

  const categorias = {
    ingreso: ['Venta Chapita', 'Venta Mayorista', 'Regalo/Muestra', 'Otro Ingreso'],
    egreso: ['Chapitas (Insumos)', 'Packaging', 'Envíos/Mensajería', 'Marketing/Ads', 'Software/Web', 'Otro Egreso']
  };

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) { router.push('/login'); return; }
      if (!ADMIN_EMAILS.includes(user.email)) { router.push('/dashboard'); return; }
      
      setIsAdmin(true);
      await Promise.all([ fetchFinanzas(), fetchMascotasGlobales() ]);
      setLoading(false);
    };
    checkAdminAndFetchData();
  }, [router]);

  const fetchFinanzas = async () => {
    const { data, error } = await supabase.from('finanzas').select('*').order('fecha', { ascending: false });
    if (data) {
      setTransacciones(data);
      let ing = 0; let egr = 0; let stockActual = 0;
      let ingEf = 0; let ingTr = 0; // Contadores separados
      
      data.forEach(t => {
        const monto = Number(t.monto);
        const cantidad = Number(t.cantidad || 0);

        if (t.tipo === 'ingreso') {
            ing += monto;
            // Sumamos según el método de pago
            if (t.metodo_pago === 'efectivo') ingEf += monto;
            else ingTr += monto;
        }
        if (t.tipo === 'egreso') egr += monto;

        if (t.categoria === 'Chapitas (Insumos)') {
            stockActual += cantidad;
        } else if (['Venta Chapita', 'Venta Mayorista', 'Regalo/Muestra'].includes(t.categoria)) {
            stockActual -= cantidad;
        }
      });
      
      setBalance({ ingresos: ing, egresos: egr, total: ing - egr, stock: stockActual, ingEfectivo: ingEf, ingTransf: ingTr });
    }
  };

  const fetchMascotasGlobales = async () => {
    const { data } = await supabase.from('mascotas').select('*, chapitas(codigo)').not('lat', 'is', null).not('lng', 'is', null);
    if (data) setMascotasUbicadas(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.monto === '' || Number(formData.monto) < 0) return alert("Ingresá un monto de $0 o más");
    if (formData.cantidad < 0) return alert("La cantidad no puede ser negativa");
    
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('finanzas').insert([{
      tipo: formData.tipo,
      monto: Number(formData.monto),
      cantidad: Number(formData.cantidad),
      metodo_pago: formData.metodo_pago, 
      categoria: formData.categoria,
      descripcion: formData.descripcion,
      user_id: user?.id
    }]);

    if (!error) {
      setFormData({ ...formData, monto: '', descripcion: '', cantidad: 1 });
      await fetchFinanzas();
    } else {
      alert("Error: " + error.message);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
      if(!window.confirm("¿Seguro que querés borrar este movimiento?")) return;
      const { error } = await supabase.from('finanzas').delete().eq('id', id);
      if(!error) await fetchFinanzas();
  };

  const formatPesos = (num: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(num);

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="animate-spin text-[#ff6f00]"><QrCode size={40} /></div></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-10 font-sans relative">
      
      {/* ==========================================
          MODAL DE DETALLE DE INGRESOS
          ========================================== */}
      {showIngresosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-700 rounded-[2rem] p-8 w-full max-w-sm relative shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Botón Cerrar */}
            <button 
              onClick={() => setShowIngresosModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors bg-gray-800 p-2 rounded-full"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl"><TrendingUp size={20} /></div>
              Detalle de Ingresos
            </h3>

            <div className="space-y-4">
              {/* Fila Transferencias */}
              <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Smartphone size={18} /></div>
                  <span className="font-bold text-gray-300">MercadoPago / Banco</span>
                </div>
                <span className="font-black text-white">{formatPesos(balance.ingTransf)}</span>
              </div>

              {/* Fila Efectivo */}
              <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 text-green-400 rounded-lg"><Banknote size={18} /></div>
                  <span className="font-bold text-gray-300">Caja Efectivo</span>
                </div>
                <span className="font-black text-white">{formatPesos(balance.ingEfectivo)}</span>
              </div>
            </div>

            {/* Total Footer */}
            <div className="mt-6 pt-5 border-t border-gray-800 flex justify-between items-center px-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Ingresado</span>
              <span className="text-2xl font-black text-blue-400">{formatPesos(balance.ingresos)}</span>
            </div>
          </div>
        </div>
      )}
      {/* ========================================== */}

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <ShieldAlert className="text-[#ff6f00]" size={28} />
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">Centro de Comando</h1>
            </div>
            <p className="text-gray-400 text-sm font-medium">Gestión interna de I Am Paw.</p>
          </div>
          <button onClick={() => router.push('/dashboard')} className="bg-gray-800 hover:bg-gray-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors w-fit">
            Volver a la App
          </button>
        </header>

        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className={`col-span-2 lg:col-span-1 p-6 rounded-3xl border ${balance.total >= 0 ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl ${balance.total >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}><DollarSign size={20} /></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Caja Total</span>
              </div>
              <h2 className={`text-3xl lg:text-4xl font-black ${balance.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatPesos(balance.total)}</h2>
            </div>
            
            <div className="col-span-2 lg:col-span-1 p-6 rounded-3xl border bg-[#ff6f00]/10 border-orange-500/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-[#ff6f00]/20 text-[#ff6f00]"><Package size={20} /></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock Chapitas</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-[#ff6f00]">{balance.stock} <span className="text-lg text-orange-400 font-bold">uds</span></h2>
            </div>

            {/* TARJETA DE INGRESOS (AHORA ES CLICKEABLE) */}
            <div 
                onClick={() => setShowIngresosModal(true)}
                className="p-6 rounded-3xl border bg-gray-800/50 border-gray-700 cursor-pointer hover:bg-gray-800 hover:border-gray-600 transition-all group relative"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400"><TrendingUp size={16} /></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ingresos</span>
              </div>
              <h2 className="text-2xl font-black text-white">{formatPesos(balance.ingresos)}</h2>
              
              {/* Iconito sutil para indicar que se puede hacer clic */}
              <div className="absolute top-6 right-6 text-gray-600 group-hover:text-blue-400 transition-colors">
                  <Info size={18} />
              </div>
            </div>

            <div className="p-6 rounded-3xl border bg-gray-800/50 border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-400"><TrendingDown size={16} /></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gastos</span>
              </div>
              <h2 className="text-2xl font-black text-white">{formatPesos(balance.egresos)}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-gray-800/50 border border-gray-700 rounded-3xl p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Plus size={20} className="text-[#ff6f00]" /> Nuevo Movimiento</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex p-1 bg-gray-900 rounded-xl">
                  <button type="button" onClick={() => setFormData({ ...formData, tipo: 'ingreso', categoria: categorias.ingreso[0] })} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${formData.tipo === 'ingreso' ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>INGRESO</button>
                  <button type="button" onClick={() => setFormData({ ...formData, tipo: 'egreso', categoria: categorias.egreso[0] })} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${formData.tipo === 'egreso' ? 'bg-red-500/20 text-red-400' : 'text-gray-500 hover:text-gray-300'}`}>GASTO</button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Monto ($)</label>
                        <div className="relative mt-1">
                            <span className="absolute left-3 top-3 text-gray-500 font-bold">$</span>
                            <input type="number" required min="0" value={formData.monto} onChange={(e) => setFormData({...formData, monto: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-7 pr-3 outline-none focus:border-[#ff6f00] transition-colors font-medium text-white" placeholder="0" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Cant.</label>
                        <div className="relative mt-1">
                            <input type="number" required min="0" value={formData.cantidad} onChange={(e) => setFormData({...formData, cantidad: Number(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 px-4 outline-none focus:border-[#ff6f00] transition-colors font-medium text-white text-center" />
                        </div>
                    </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Método</label>
                  <div className="flex p-1 bg-gray-900 rounded-xl mt-1">
                    <button type="button" onClick={() => setFormData({ ...formData, metodo_pago: 'transferencia' })} className={`flex-1 flex justify-center items-center gap-2 py-2 text-xs font-bold rounded-lg transition-colors ${formData.metodo_pago === 'transferencia' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
                        <Smartphone size={14} /> Transf.
                    </button>
                    <button type="button" onClick={() => setFormData({ ...formData, metodo_pago: 'efectivo' })} className={`flex-1 flex justify-center items-center gap-2 py-2 text-xs font-bold rounded-lg transition-colors ${formData.metodo_pago === 'efectivo' ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>
                        <Banknote size={14} /> Efectivo
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Categoría</label>
                  <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none focus:border-[#ff6f00] transition-colors text-sm font-medium text-white appearance-none">
                    {formData.tipo === 'ingreso' ? categorias.ingreso.map(c => <option key={c} value={c}>{c}</option>) : categorias.egreso.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nota (Opcional)</label>
                  <input type="text" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-xl p-3 outline-none focus:border-[#ff6f00] transition-colors text-sm text-white" placeholder="Ej: Venta por Instagram" />
                </div>
                <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all ${formData.tipo === 'ingreso' ? 'bg-green-600 hover:bg-green-500 shadow-green-900/50' : 'bg-red-600 hover:bg-red-500 shadow-red-900/50'}`}>
                  {isSubmitting ? 'Guardando...' : `Registrar Movimiento`}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-3xl p-6 flex flex-col h-[600px]">
              <h3 className="text-lg font-bold mb-4">Últimos Movimientos</h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                {transacciones.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <DollarSign size={40} className="mb-2 opacity-20" />
                    <p className="text-sm">Aún no hay movimientos registrados.</p>
                  </div>
                ) : (
                  transacciones.map((t) => (
                    <div key={t.id} className="group bg-gray-900/80 border border-gray-700/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:border-gray-600 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${t.tipo === 'ingreso' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {t.tipo === 'ingreso' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-bold text-white leading-none">{t.categoria}</p>
                              {t.cantidad > 0 && <span className="bg-gray-800 text-gray-400 text-[10px] px-1.5 py-0.5 rounded">x{t.cantidad}</span>}
                              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-1 ${t.metodo_pago === 'efectivo' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                  {t.metodo_pago === 'efectivo' ? <Banknote size={10}/> : <Smartphone size={10}/>}
                                  {t.metodo_pago === 'efectivo' ? 'Efvo' : 'Transf'}
                              </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-[250px]">{t.descripcion || 'Sin nota'}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center justify-end gap-4">
                        <div>
                            <p className={`font-black ${t.tipo === 'ingreso' ? 'text-green-400' : 'text-red-400'}`}>
                            {t.tipo === 'ingreso' ? '+' : '-'}{formatPesos(t.monto)}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                            {new Date(t.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                            </p>
                        </div>
                        
                        <button 
                            onClick={() => handleDelete(t.id)}
                            className="text-gray-600 hover:text-red-500 transition-colors p-2 bg-gray-800 rounded-lg lg:opacity-0 lg:group-hover:opacity-100"
                            title="Eliminar registro"
                        >
                            <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-800/50 border border-gray-700 rounded-[2.5rem] p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black flex items-center gap-3"><Globe className="text-blue-500" /> Radar de Operaciones</h2>
              <p className="text-gray-400 text-sm mt-1">Ubicaciones guardadas de las chapitas activas.</p>
            </div>
            <div className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Mascotas en Radar</span>
              <span className="text-xl font-black text-blue-400">{mascotasUbicadas.length}</span>
            </div>
          </div>
          <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden border-2 border-gray-700 shadow-2xl relative z-0">
            {mascotasUbicadas.length > 0 ? (
              <MapaComunitario mascotas={mascotasUbicadas} />
            ) : (
              <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-gray-500">
                <Globe size={48} className="mb-4 opacity-20" />
                <p>Aún no hay chapitas con ubicación registrada.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}