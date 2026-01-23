const QRCode = require('qrcode');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN ---
const CANTIDAD = 10; // ¿Cuántos QRs querés crear hoy?
const DOMINIO = 'http://localhost:3000'; // Ojo: CAMIAR A DOMINIO ORIGNAL 
const SUPABASE_URL = 'https://hlfjzvgaehoynadxgtwh.supabase.co'; // Pegá lo mismo que pusiste en .env.local
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZmp6dmdhZWhveW5hZHhndHdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE4MDkxNiwiZXhwIjoyMDg0NzU2OTE2fQ.O7e-znWgwwuni_Rd26ibcrvxiZb_4gNPzLaBP4DcpGM'; // Pegá la KEY anon que pusiste en .env.local
// ---------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

  for (let i = 0; i < CANTIDAD; i++) {
    const codigo = generarCodigo();
    const urlFinal = `${DOMINIO}/p/${codigo}`; // Esto es lo que lee el celular

    // 1. Guardar en Supabase
    const { error } = await supabase
      .from('chapitas')
      .insert([{ codigo: codigo, estado: 'disponible' }]);

    if (error) {
      console.error(`❌ Error guardando ${codigo}:`, error.message);
      continue; // Si falla (ej: código repetido), salta al siguiente
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