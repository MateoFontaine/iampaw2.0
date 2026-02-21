const path = require('path');
// Carga las variables desde el archivo .env.local en la carpeta raíz
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// --- PARCHE DE CONEXIÓN (Para que no falle en Windows/Node 24) ---
const fetch = require('node-fetch');
const dns = require('dns');
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');
// ------------------------------------------------------------------

const QRCode = require('qrcode');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// --- CONFIGURACIÓN DEL LOTE ---
const CANTIDAD = 20;  // Cantidad de chapitas a generar
const PREFIJO = 'A';  // Letra del lote (A, B, C...)

// 🔥 CAMBIO CLAVE: Ponemos el dominio oficial directo aquí
const DOMINIO = 'https://www.iampaw.com.ar'; 

// --- SEGURIDAD ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Faltan las claves en .env.local');
  console.error('Asegurate de tener SUPABASE_SERVICE_ROLE_KEY definida.');
  process.exit(1);
}

// Inicializamos Supabase con fetch personalizado
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  global: { fetch: fetch }
});

// Función modificada: PREFIJO + 5 Caracteres Random
function generarCodigo() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return `${PREFIJO}${randomPart}`; 
}

async function generarLote() {
  const dir = path.join(__dirname, 'qrs_para_laser');
  
  // Crear carpeta si no existe
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  // Limpiar imágenes viejas de la carpeta
  const archivosViejos = fs.readdirSync(dir);
  for (const archivo of archivosViejos) {
    fs.unlinkSync(path.join(dir, archivo));
  }

  console.log(`🚀 Generando Lote "${PREFIJO}" (${CANTIDAD} chapitas)...`);
  console.log(`🔗 Dominio oficial: ${DOMINIO}`);

  let creados = 0;

  while (creados < CANTIDAD) {
    const codigo = generarCodigo();
    // Esto generará algo como: https://www.iampaw.com.ar/p/A1B2C3
    const urlFinal = `${DOMINIO}/p/${codigo}`; 

    // 1. Guardar en Supabase
    const { error } = await supabase
      .from('chapitas')
      .insert([
        { 
          codigo: codigo, 
          estado: 'disponible',
          mascota_id: null 
        }
      ]);

    if (error) {
      console.error(`❌ Error con ${codigo}:`, error.message);
      if (error.message.includes('row-level security')) {
        console.error("🛑 STOP: La clave SUPABASE_SERVICE_ROLE_KEY no tiene permisos o es incorrecta.");
        process.exit(1);
      }
      continue; 
    }

    // 2. Generar QR
    await QRCode.toFile(path.join(dir, `${codigo}.png`), urlFinal, {
      width: 500, margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
    });

    creados++;
    console.log(`✅ [${creados}/${CANTIDAD}] ${codigo}`);
  }

  console.log(`\n✨ ¡LISTO! Revisá la carpeta: ${dir}`);
}

generarLote();