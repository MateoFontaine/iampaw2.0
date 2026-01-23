import type { Metadata } from "next";
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

// --- SEO MASTER CONFIG ---
export const metadata: Metadata = {
  // 1. URL BASE: Fundamental para que las fotos de compartir funcionen
  metadataBase: new URL('https://iampaw.vercel.app'), 

  // 2. TÍTULO INTELIGENTE
  title: {
    default: "IamPaw | Chapitas Inteligentes para Mascotas",
    template: "%s | IamPaw Argentina", 
  },
  
  // 3. DESCRIPCIÓN OPTIMIZADA
  description: "La forma más segura de proteger a tu mascota. Sin aplicaciones, sin pilas y sin suscripciones. Sistema de identificación QR con geolocalización.",
  
  // 4. PALABRAS CLAVE (Keywords)
  keywords: ["chapitas qr", "mascotas perdidas", "identificación mascotas", "perros", "gatos", "seguridad mascotas", "argentina", "placa identificatoria"],

  // 5. AUTOR Y CREADOR
  authors: [{ name: "Mateo Fontaine", url: "https://mateofontaine.com" }],
  creator: "Mateo Fontaine",

  // 6. ROBOTS (Para que Google te indexe)
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

  // 7. OPEN GRAPH (Cómo se ve en Facebook/WhatsApp/LinkedIn)
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://iampaw.vercel.app",
    title: "IamPaw | Que vuelvan rápido a casa",
    description: "Sistema inteligente de identificación para mascotas. Protegé a quien más querés.",
    siteName: "IamPaw",
    images: [
      {
        url: "/og-image.jpg", // (Opcional: después podés subir una imagen linda llamada así a la carpeta public)
        width: 1200,
        height: 630,
        alt: "IamPaw Landing Page",
      },
    ],
  },

  // 8. TWITTER CARDS
  twitter: {
    card: "summary_large_image",
    title: "IamPaw | Chapitas Inteligentes",
    description: "La evolución de la chapita. Escaneá, contactá y recuperá.",
    // images: ["/twitter-image.jpg"], 
  },

  // 9. ÍCONOS (Aunque usamos icon.tsx, esto refuerza)
  icons: {
    icon: '/icon',
    apple: '/icon', // Next.js genera esto automático
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