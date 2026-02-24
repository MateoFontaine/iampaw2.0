/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite imágenes de cualquier lado (ideal si los usuarios suben fotos a Supabase o usás links externos). Si querés ser más estricto, poné el dominio de tu bucket de Supabase.
      },
    ],
  },
};

export default nextConfig;