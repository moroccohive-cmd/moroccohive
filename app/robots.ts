import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://www.moroccohive.com"

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/dashboard/",
                    "/admin/",
                    "/api/",
                    "/login",
                    "/register",
                    "/forgot-password",
                    "/reset-password",
                    "/verify-email",
                    "/profile",
                    "/access-denied",
                ],
            },
            {
                userAgent: "Googlebot",
                allow: ["/", "/blog/", "/circuits/", "/api/circuits/", "/api/blog/"],
                disallow: [
                    "/dashboard/",
                    "/admin/",
                    "/api/admin/",
                    "/api/auth/",
                    "/api/contact/",
                    "/api/trip-requests/",
                    "/api/favorites/",
                    "/api/settings/",
                    "/api/upload/",
                    "/login",
                    "/register",
                    "/profile",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}
