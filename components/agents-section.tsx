import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DEFAULT_LOCALE, localizePath, type Locale } from "@/lib/i18n/config"
import { getMessages } from "@/lib/i18n/messages"

const LOCAL_AGENTS = [
  { name: "Elhoussain", image: "/agent-1.webp" },
  { name: "Abdellatif", image: "/agent-2.webp" },
]

export function AgentsSection({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getMessages(locale).agents

  return (
    <section className="py-24 bg-background overflow-hidden border-b border-border cv-auto">
      <div className="max-w-7xl justify-center mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative gap-4 p-4">
            <div className="flex flex-col items-center gap-8 pt-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">{t.title}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
                {LOCAL_AGENTS.map((agent, i) => (
                  <div
                    key={i}
                    className="group relative bg-card rounded-2xl border border-border/50 p-6 transition-all hover:border-primary/30 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/10 shadow-inner">
                        <Image
                          src={agent.image}
                          alt={agent.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{agent.name}</h3>
                        <p className="text-xs text-primary font-semibold uppercase tracking-widest">{t.agents[i].role}</p>
                      </div>
                      <details className="group/details w-full text-left">
                        <summary className="list-none cursor-pointer flex justify-center group-open/details:hidden">
                          <span className="inline-flex items-center px-6 py-1.5 rounded-full border border-primary/20 text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
                            {t.readMore}
                          </span>
                        </summary>
                        <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                          {t.agents[i].description}
                        </p>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <span className="text-accent font-medium tracking-widest text-xs uppercase">{t.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
              {t.heading}
            </h2>
            <div className="space-y-6">
              <p className="text-muted-foreground text-lg font-light leading-relaxed">
                {t.body}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-md h-12 px-8 shadow-lg shadow-primary/10">
            <Link href={localizePath(locale, "/plan-trip")}>{t.cta}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
