export default function Loading() {
  return (
    <div className="min-h-screen bg-white font-sans pb-10">
      
      {/* --- HERO IMAGE SKELETON --- */}
      {/* Un bloque gris gigante que titila (animate-pulse) */}
      <div className="relative h-[65vh] w-full bg-gray-200 animate-pulse flex flex-col justify-end p-6 pb-16">
          <div className="h-4 w-16 bg-gray-300 rounded mb-2"></div>
          <div className="h-10 w-3/4 bg-gray-300 rounded mb-2"></div>
          <div className="h-5 w-1/2 bg-gray-300 rounded"></div>
      </div>

      {/* --- CUERPO SKELETON --- */}
      <div className="relative -mt-8 bg-white rounded-t-[1.5rem] px-6 pt-6 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        
        {/* BOTÓN WHATSAPP SKELETON */}
        <div className="w-full h-16 bg-gray-200 rounded-xl mb-8 animate-pulse"></div>

        {/* MAPA SKELETON */}
        <div className="mb-8 animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded mb-3"></div>
            <div className="w-full h-48 bg-gray-200 rounded-2xl"></div>
        </div>

        {/* GRILLA DE DATOS SKELETON */}
        <div className="grid grid-cols-2 gap-3 mb-6 animate-pulse">
            <div className="bg-gray-100 h-16 rounded-xl border border-gray-50"></div>
            <div className="bg-gray-100 h-16 rounded-xl border border-gray-50"></div>
            <div className="bg-gray-100 h-16 rounded-xl border border-gray-50 col-span-2"></div>
        </div>

        {/* INFO DUEÑO SKELETON */}
        <div className="flex items-center gap-3 animate-pulse">
            <div className="bg-gray-200 w-10 h-10 rounded-full shrink-0"></div>
            <div className="w-full">
                <div className="h-3 w-24 bg-gray-200 rounded mb-1"></div>
                <div className="h-5 w-40 bg-gray-200 rounded"></div>
            </div>
        </div>

      </div>
    </div>
  );
}