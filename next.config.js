/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                port: '',
                pathname: `/${process.env.GCP_SECONDARY_BUCKET_NAME}/**`,
            },
        ],
        domains: ['storage.googleapis.com'],
    },
}

module.exports = nextConfig
