const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                port: "",
                pathname: `/${process.env.GCP_SECONDARY_BUCKET_NAME}/**`,
            },
        ],
    },
    webpack: (config, { isServer }) => {
        config.resolve.alias["@"] = path.join(__dirname, "src");
        return config;
    },
};

module.exports = nextConfig;
