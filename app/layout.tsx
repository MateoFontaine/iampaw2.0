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

// --- METADATA GLOBAL (Por defecto) ---
export const metadata: Metadata = {
  title: {
    default: "IamPaw | Chapitas Inteligentes",
    template: "%s | IamPaw", // Esto permite que otras páginas digan "Rocco | IamPaw"
  },
  description: "La forma más segura de proteger a tu mascota. Sin apps, sin pilas, solo un escaneo.",
  openGraph: {
    title: "IamPaw | Chapitas Inteligentes",
    description: "Si se pierde, que vuelva rápido. Tecnología QR para mascotas.",
    url: "https://iampaw.vercel.app", // Poné tu URL real acá cuando la tengas
    siteName: "IamPaw",
    images: [
      {
        url: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&h=630&fit=crop", // Foto genérica linda para la landing
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_AR",
    type: "website",
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