import { HomeView, homeMetadata } from "@/components/views/home-view"

export const metadata = homeMetadata("en")

// Revalidate every hour - circuits and blogs change infrequently
export const revalidate = 3600

export default function HomePage() {
  return <HomeView locale="en" />
}
