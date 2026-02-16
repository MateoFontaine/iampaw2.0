import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- 1. VIEWPORT (SENSACIÓN APP NATIVA) ---
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ff6f00', // El naranja de IamPaw para la barra del navegador
};

// --- 2. SEO & ICONOS MASTER CONFIG ---
export const metadata: Metadata = {
  // Cambiamos a tu dominio oficial para que los buscadores indexen la URL real
  metadataBase: new URL('https://www.iampaw.com.ar'), 

  title: {
    default: "IamPaw | Chapitas QR Inteligentes para Mascotas",
    template: "%s | IamPaw Argentina", 
  },
  
  description: "Protegé a tu mascota con la evolución de la identificación. Sin pilas, sin apps y sin suscripciones. Chapitas con QR y geolocalización en Argentina.",
  
  keywords: ["chapitas qr", "mascotas perdidas argentina", "identificación mascotas", "placa identificación perro", "I Am Paw", "Mateo Fontaine"],

  authors: [{ name: "Mateo Fontaine" }],
  creator: "Devoys",

  // --- CONFIGURACIÓN DE ICONOS (AGREGAR A INICIO) ---
  icons: {
    icon: [
      { url: '/logo-icon.png' }, // Icono normal
      { url: '/logo-icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/logo-icon.png' }, // Este es el que usa iPhone al agregar a inicio
    ],
  },

  // --- CONFIGURACIÓN APPLE WEB APP ---
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IamPaw",
    // startupImage se podría agregar después si tenés un splash screen
  },

  // OPEN GRAPH (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://www.iampaw.com.ar",
    title: "IamPaw | Que vuelvan rápido a casa",
    description: "Identificación inteligente para mascotas. Escaneá el QR y contactá al dueño al instante.",
    siteName: "IamPaw",
    images: [
      {
        url: "/og-image.jpg", // Asegurate de tener esta imagen en /public
        width: 1200,
        height: 630,
        alt: "Mascota protegida con IamPaw",
      },
    ],
  },

  // TWITTER
  twitter: {
    card: "summary_large_image",
    title: "IamPaw | Chapitas Inteligentes",
    description: "La forma más rápida de recuperar a tu mascota perdida.",
    images: ["/og-image.jpg"],
  },

  // CANONICAL (Evita contenido duplicado para Google)
  alternates: {
    canonical: 'https://www.iampaw.com.ar',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Esto ayuda a que el iPhone reconozca el icono de la web app inmediatamente */}
        <link rel="apple-touch-icon" href="/logo-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}