import { ChevronDown } from "lucide-react"

export function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-background rounded-xl border border-border/50 shadow-sm transition-all duration-300 open:border-primary open:shadow-md hover:shadow-md">
      <summary className="w-full flex items-center justify-between p-6 text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="text-base font-semibold text-foreground pr-4">{question}</span>
        <ChevronDown className="w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <p className="px-6 pb-6 text-muted-foreground font-light leading-relaxed">{answer}</p>
    </details>
  )
}
