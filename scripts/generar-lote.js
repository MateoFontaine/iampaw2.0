// 1. Cargar variables de entorno (Lee tu archivo .env.local)
require('dotenv').config({ path: '.env.local' });

const QRCode = require('qrcode');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN ---
const CANTIDAD = 10; 
// Usamos una variable de entorno para el dominio, o un fallback por si no existe
const DOMINIO = process.env.NEXT_PUBLIC_SITE_URL || 'https://iampaw.vercel.app'; 

// --- SEGURIDAD: LEER CLAVES DEL ENV ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// IMPORTANTE: Para scripts de administración como este, a veces se necesita 
// la "SERVICE_ROLE_KEY" si la tabla tiene seguridad (RLS). 
// Si te falla con la ANON KEY, agregá la SERVICE a tu .env.local y usala acá.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; 

// Validamos que las claves existan antes de arrancar
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR CRÍTICO: No se encontraron las claves de Supabase.');
  console.error('Asegurate de tener el archivo .env.local con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}
// ---------------------

const supabase = createClient(supabaseUrl, supabaseKey);

// Función para crear un código aleatorio de 6 caracteres (ej: A4X9P2)
function generarCodigo() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let resultado = '';
  for (let i = 0; i < 6; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
}

async function generarLote() {
  // Crear carpeta para guardar las imágenes si no existe
  const dir = './qrs_para_laser';
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }

  console.log(`🚀 Generando ${CANTIDAD} chapitas...`);
  console.log(`🔗 Usando dominio: ${DOMINIO}`);

  for (let i = 0; i < CANTIDAD; i++) {
    const codigo = generarCodigo();
    const urlFinal = `${DOMINIO}/p/${codigo}`; // Esto es lo que lee el celular

    // 1. Guardar en Supabase
    const { error } = await supabase
      .from('chapitas')
      .insert([{ codigo: codigo, estado: 'disponible' }]);

    if (error) {
      console.error(`❌ Error guardando ${codigo}:`, error.message);
      // Si el error es por código duplicado, restamos 1 al iterador para intentar de nuevo
      if (error.code === '23505') i--; 
      continue; 
    }

    // 2. Generar la imagen del QR
    const archivoImagen = path.join(dir, `${codigo}.png`);
    await QRCode.toFile(archivoImagen, urlFinal, {
      color: {
        dark: '#000000',  // Puntos negros
        light: '#ffffff'  // Fondo blanco
      },
      width: 500 // Tamaño de la imagen
    });

    console.log(`✅ [${i+1}/${CANTIDAD}] Creado: ${codigo}`);
  }

  console.log(`\n✨ ¡Listo! Revisá la carpeta "${dir}"`);
}

generarLote();