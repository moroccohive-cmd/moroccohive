import type { NextConfig } from "next";

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
            // robots.txt only asks crawlers not to fetch these — a URL linked from
            // elsewhere can still get indexed without ever being crawled. An
            // X-Robots-Tag is the enforceable version, and it works for the auth
            // pages, which are client components and so cannot export metadata.
            ...[
                "/login",
                "/register",
                "/forgot-password",
                "/reset-password",
                "/verify-email",
                "/profile",
                "/access-denied",
                "/dashboard/:path*",
                "/uploads/:path*",
            ].map((source) => ({
                source,
                headers: [
                    { key: "X-Robots-Tag", value: "noindex, nofollow" },
                ],
            })),
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

export default nextConfig;
