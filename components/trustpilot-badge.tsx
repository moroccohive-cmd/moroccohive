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
        src="/trustpilot.webp"
        alt="Trustpilot"
        width={260}
        height={36}
        className="bg-white"
      />
    </Link>
  )
}
