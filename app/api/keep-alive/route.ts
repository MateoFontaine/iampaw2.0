import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ESTO ES CLAVE: Le dice a Next.js que NO guarde esta respuesta en caché.
// Si no ponés esto, Vercel responde desde la memoria y nunca toca la base de datos.
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  // 1. Verificación de seguridad (Opcional pero recomendada para que no te la spameen)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Si querés hacerlo simple sin clave, borrá este if.
    // Pero Vercel recomienda proteger los Crons.
    // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. HACEMOS UNA CONSULTA REAL A LA DB
    // Buscamos solo 1 ID de cualquier tabla (ej: mascotas) para gastar pocos recursos
    // pero forzar la conexión.
    const { data, error } = await supabase
      .from('mascotas')
      .select('id')
      .limit(1)
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      status: 'Alive', 
      message: 'Supabase despertado exitosamente ☕️',
      timestamp: new Date().toISOString() 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}