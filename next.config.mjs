/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración optimizada para Vercel
  typescript: {
    // Removido ignoreBuildErrors para detectar errores en producción
  },
  images: {
    // Vercel optimiza imágenes automáticamente
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
