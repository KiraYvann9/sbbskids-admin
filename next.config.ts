import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    output: "standalone",

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.sbbskids.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
