/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://songifind-345f23dfea60.herokuapp.com/api/:path*',
            },
        ];
    },
    output: 'export',
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
                port: '',
                pathname: '/**'
            }
        ],
    }
};

module.exports = nextConfig;