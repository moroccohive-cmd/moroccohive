import type { NextConfig } from "next";
import { copyLibFiles } from "@builder.io/partytown/utils"
import path from "path"

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 7, // cache optimized images for 7 days
    },
    compress: true,
    poweredByHeader: false,
    experimental: {
        optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-slider'],
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Permissions-Policy",
                        value: [
                            'shared-storage=(self "https://www.googletagmanager.com" "https://www.google.com" "https://www.googleadservices.com")',
                            'shared-storage-select-url=(self "https://www.googletagmanager.com" "https://www.google.com" "https://www.googleadservices.com")',
                            'attribution-reporting=(self "https://www.googletagmanager.com" "https://www.google.com" "https://www.googleadservices.com")',
                            'private-aggregation=(self "https://www.googletagmanager.com" "https://www.google.com" "https://www.googleadservices.com")',
                            'browsing-topics=(self "https://www.googletagmanager.com" "https://www.google.com" "https://www.googleadservices.com")',
                        ].join(", "),
                    },
                ],
            },
        ];
    },
};

// Copy Partytown lib files to public/~partytown at build time
const partytownCopyLib = async () => {
    await copyLibFiles(path.join(process.cwd(), "public", "~partytown"))
}
partytownCopyLib()

export default nextConfig;
