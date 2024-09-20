/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*'
      }
    ];
  },
  webpack(config) {
    config.experiments = {
      layers: true,
      asyncWebAssembly: true,
      syncWebAssembly: true,
    };
    return config;
  },
};

export default nextConfig;
