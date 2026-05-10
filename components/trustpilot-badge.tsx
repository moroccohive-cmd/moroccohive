import Link from "next/link"
import Image from "next/image"

interface TrustpilotBadgeProps {
  variant?: "light" | "dark"
}

export function TrustpilotBadge({ variant = "dark" }: TrustpilotBadgeProps) {
  return (
    <Link
      href="https://www.trustpilot.com/review/moroccohive.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center"
      aria-label="See our reviews on Trustpilot"
    >
      <Image
        src="/Trustpilot_Logo_(2022).svg.webp"
        alt="Trustpilot"
        width={120}
        height={43}
        className="bg-white p-2 px-3 border border-gray-300"
      />
    </Link>
  )
}
