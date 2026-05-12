import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const LOCAL_AGENTS = [
  {
    name: "Elhoussain",
    role: "Dedicated Tour Guide",
    image: "/agent-1.webp",
    description:
      "Hello, my name is Elhoussain Iggui, and I have been a tour guide in Morocco since 1995. I specialize in hiking: the Atlas Mountains, the Rif ranges, and the Sahara dunes. Over thirty years I have guided hikers of all levels, from short day walks to multi-day expeditions, sharing the history, landscapes, and traditions of the regions we pass through.",
  },
  {
    name: "Abdellatif",
    role: "Professional Driver & Tour Guide",
    image: "/agent-2.webp",
    description:
      "Hello, my name is Abdellatif Iggui, and I have been a driver and tour guide in Morocco for over 7 years. I've led more than 210 trips across the country, from Casablanca and Marrakech to the Atlas Mountains and the Sahara. I know the roads, the timing, and the stops that most itineraries miss. Every route I drive is one I know well.",
  },
]

export function AgentsSection() {
  return (
    <section className="py-24 bg-background overflow-hidden border-b border-border cv-auto">
      <div className="max-w-7xl justify-center mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative gap-4 p-4">
            <div className="flex flex-col items-center gap-8 pt-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Our Local Agents in Morocco</h2>

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
                        <p className="text-xs text-primary font-semibold uppercase tracking-widest">{agent.role}</p>
                      </div>
                      <details className="group/details w-full text-left">
                        <summary className="list-none cursor-pointer flex justify-center group-open/details:hidden">
                          <span className="inline-flex items-center px-6 py-1.5 rounded-full border border-primary/20 text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
                            Read More
                          </span>
                        </summary>
                        <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                          {agent.description}
                        </p>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <span className="text-accent font-medium tracking-widest text-xs uppercase">The Heart of Morocco</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
              Guided by the People Who Know It Best
            </h2>
            <div className="space-y-6">
              <p className="text-muted-foreground text-lg font-light leading-relaxed">
                Our guides were born and raised in Morocco. They know which roads to take, which towns are worth stopping in,
                and when the crowds arrive. That's the kind of knowledge you only get from living here.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-md h-12 px-8 shadow-lg shadow-primary/10">
            <Link href="/plan-trip">Plan with an Expert</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
