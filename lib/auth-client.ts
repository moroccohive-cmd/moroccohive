import { createAuthClient } from "better-auth/react"

// No baseURL: the browser client always calls its own origin, so the app works
// on whatever port `next dev` picks and needs no CORS handling in production.
export const authClient = createAuthClient()
