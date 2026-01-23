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

// --- 1. CONFIGURACIÓN VIEWPORT (SENSACIÓN APP NATIVA) ---
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
  // ESTA ES LA CLAVE MÁGICA:
  viewportFit: 'cover', 
};

// --- 2. SEO MASTER CONFIG ---
export const metadata: Metadata = {
  // URL BASE: Fundamental para que las fotos de compartir funcionen
  metadataBase: new URL('https://iampaw.vercel.app'), 

  // TÍTULO INTELIGENTE
  title: {
    default: "IamPaw | Chapitas Inteligentes para Mascotas",
    template: "%s | IamPaw Argentina", 
  },
  
  // DESCRIPCIÓN OPTIMIZADA
  description: "La forma más segura de proteger a tu mascota. Sin aplicaciones, sin pilas y sin suscripciones. Sistema de identificación QR con geolocalización.",
  
  // PALABRAS CLAVE
  keywords: ["chapitas qr", "mascotas perdidas", "identificación mascotas", "perros", "gatos", "seguridad mascotas", "argentina", "placa identificatoria"],

  // AUTOR Y CREADOR
  authors: [{ name: "Mateo Fontaine", url: "https://mateofontaine.com" }],
  creator: "Mateo Fontaine",

  // ROBOTS
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // OPEN GRAPH
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://iampaw.vercel.app",
    title: "IamPaw | Que vuelvan rápido a casa",
    description: "Sistema inteligente de identificación para mascotas. Protegé a quien más querés.",
    siteName: "IamPaw",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "IamPaw Landing Page",
      },
    ],
  },

  // TWITTER CARDS
  twitter: {
    card: "summary_large_image",
    title: "IamPaw | Chapitas Inteligentes",
    description: "La evolución de la chapita. Escaneá, contactá y recuperá.",
  },

  // ÍCONOS
  icons: {
    icon: '/icon',
    apple: '/icon',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}