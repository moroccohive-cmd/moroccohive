import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Star,
  Shield,
  Heart,
  Clock,
  Check,
  MousePointerClick,
  Settings2,
  CalendarCheck,
  Map,
  Plane,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TrustpilotBadge } from "@/components/trustpilot-badge"
import { FAQItem } from "@/components/faq-item"
import { FAQSchema } from "@/components/structured-data"
import prisma from "@/lib/prisma"
const AgentsSection = dynamic(
  () => import("@/components/agents-section").then((m) => m.AgentsSection),
  { loading: () => <div className="py-24 bg-background min-h-[560px]" /> },
)

const TestimonialsSection = dynamic(
  () => import("@/components/testimonials-section").then((m) => m.TestimonialsSection),
  { loading: () => <div className="py-24 bg-primary min-h-[680px]" /> },
)

const FavoriteButton = dynamic(
  () => import("@/components/favorite-button").then((m) => m.FavoriteButton),
  { loading: () => <div className="w-9 h-9" /> },
)

const ContactForm = dynamic(
  () => import("@/components/contact-form").then((m) => m.ContactForm),
  { loading: () => <div className="py-24 bg-background/50" /> },
)

export const metadata: Metadata = {
  title: "Private Morocco Tours by Local Experts | Morocco Hive",
  description:
    "Custom private Morocco tours built by local guides in Marrakech. Sahara desert, Atlas Mountains, imperial cities - designed around you. 4.9★ on Trustpilot.",
  alternates: {
    canonical: "https://www.moroccohive.com",
  },
  openGraph: {
    title: "Private Morocco Tours by Local Experts | Morocco Hive",
    description:
      "Custom private Morocco tours built by local guides in Marrakech. Sahara desert, Atlas Mountains, imperial cities - designed around you.",
    url: "https://www.moroccohive.com",
    images: [
      {
        url: "/hero-bg.webp",
        width: 1200,
        height: 630,
        alt: "Morocco Sahara desert dunes at golden hour - private tours by Morocco Hive",
      },
    ],
  },
  twitter: {
    title: "Private Morocco Tours by Local Experts | Morocco Hive",
    description:
      "Custom private Morocco tours built by local guides in Marrakech. Sahara desert, Atlas Mountains, imperial cities - designed around you.",
  },
}

// Revalidate every hour - circuits and blogs change infrequently
export const revalidate = 3600

async function getFeaturedCircuits() {
  try {
    return await prisma.circuit.findMany({
      where: { active: true, featured: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        duration: true,
        price: true,
        images: true,
        category: true,
      },
    })
  } catch {
    return []
  }
}

async function getLatestBlogs() {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        createdAt: true,
        tags: true,
      },
    })
  } catch {
    return []
  }
}

const FAQ_ITEMS = [
  {
    q: "When is the best time to visit Morocco?",
    a: "Spring (March to May) and fall (September to mid-November) are the ideal seasons to travel to Morocco. In contrast to the bitter cold and snow of winter or the intense heat of summer, the weather is pleasant but warm. If you enjoy the warmer weather, summer is also a great time to visit. You can travel to the coastal areas.",
  },
  {
    q: "Is Morocco a safe country?",
    a: "Yes, Morocco is generally considered a safe country for tourists, with low levels of violent crime and no significant gun violence, though petty crimes like pickpocketing and scams are common in tourist areas. Official advisories recommend exercising increased caution due to a potential terrorism threat, but this applies to many destinations globally. As of 2025, there are no major conflicts affecting visitors, and millions travel there annually without issues-stick to common-sense precautions like not walking alone at night in isolated areas.",
  },
  {
    q: "Do I need to purchase travel insurance?",
    a: "Yes, before taking part in any of our tours, all travelers using MoroccoHive must have travel insurance. On the first day of your trip, your guide will gather your travel insurance information. It is your duty to ensure that you have appropriate and sufficient travel insurance.",
  },
  {
    q: "Do I need to tip?",
    a: "Tipping service staff is common in Morocco – typically around 15% for a restaurant meal. It is also standard to round up the fare or the bill for taxi drivers and porters (around 20 MAD). Your tour guide and crew would be especially appreciative and honored with this kind of traditional gratitude at the end of your tour.",
  },
]

export default async function HomePage() {
  const [circuits, blogPosts] = await Promise.all([getFeaturedCircuits(), getLatestBlogs()])

  return (
    <div className="min-h-screen bg-background/50 flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-bg.webp"
              alt="Morocco Sahara desert dunes at golden hour - private tour by MoroccoHive"
              fill
              className="object-cover"
              priority
              sizes="100vw"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              Private Morocco Tours Built by a Local Who Actually Lives Here
            </h1>

            <p className="text-base md:text-2xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto mb-6 md:mb-10">
              100% customizable private tours. Expert local guides. No group tours. From Sahara camps to medina walks — designed exactly how you want it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-white/90 px-8 h-12 text-base rounded-md font-medium transition-all">
                <Link href="/plan-trip">Book a Private Tour</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent hover:bg-white/10 text-white/90 border-white/20 px-8 h-12 text-base rounded-md font-medium transition-all">
                <Link href="/circuits">View Our Tours</Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-white/90 text-sm font-medium px-5 py-3 rounded-md backdrop-blur-md border border-white/25 shadow-lg">
                <span>4.8★ on Trustpilot</span>
                <span className="text-white/40 hidden sm:inline">|</span>
                <span>200+ Travelers Guided</span>
                <span className="text-white/40 hidden sm:inline">|</span>
                <span>10+ Years Experience</span>
              </div>
            </div>

            {/* Trustpilot Badge — inline centered on mobile */}
            <div className="mt-4 flex justify-center sm:hidden">
              <TrustpilotBadge />
            </div>
          </div>

          {/* Trustpilot Badge — absolute on desktop */}
          <div className="hidden sm:block absolute bottom-8 left-6 z-20">
            <TrustpilotBadge />
          </div>
        </section>

        {/* Why Choose Feature Row */}
        <section className="py-10 bg-card border-b border-border" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">Why Choose Morocco Hive</h2>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: "100% Private Tours", desc: "Just you. No group tourists. No bus schedules." },
                { icon: Star, title: "Expert Local Guide", desc: "Abdellatif has guided 200+ travelers. Born and raised in Morocco." },
                { icon: Settings2, title: "Fully Customizable", desc: "Build your own itinerary. Change plans on the fly. It's your tour." },
                { icon: Check, title: "All-Inclusive Pricing", desc: "No hidden costs. Includes guide, driver, activities, and most meals." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
                    <p className="text-muted-foreground text-xs font-light mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <span className="text-accent font-medium tracking-widest text-xs uppercase">Your Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">How it Works</h2>
              <p className="text-muted-foreground font-light">From first inspiration to unforgettable memories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-px border-t border-dashed border-border -translate-y-1/2 z-0" />

              {[
                { step: "01", title: "Choose Your Style", desc: "Select from our curated itineraries or tell us your travel preferences.", icon: MousePointerClick },
                { step: "02", title: "Customize & Refine", desc: "Work with our local experts to tailor every detail to your liking.", icon: Settings2 },
                { step: "03", title: "Secure Booking", desc: "Finalize your journey with flexible payments and full support.", icon: CalendarCheck },
                { step: "04", title: "Explore Morocco", desc: "Embark on an authentic journey guided by local insiders.", icon: Map },
              ].map((item, idx) => (
                <div key={idx} className="relative z-10 bg-background border border-border/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="text-4xl font-bold text-primary/20 transition-colors">{item.step}</span>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white/90 px-8 h-12 text-base rounded-md font-medium transition-all">
                <Link href="/plan-trip">Start Planning</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Circuits */}
        <section className="py-24 bg-background/50 cv-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Morocco Tours &amp; Itineraries</h2>
                <p className="text-muted-foreground mt-2 font-light">Get inspired by trips other travelers have loved</p>
              </div>
              <Link href="/circuits" className="flex items-center text-accent hover:text-accent/90 font-medium group text-sm" aria-label="View all tours and trips">
                View All Trips <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>

            {circuits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {circuits.map((circuit) => (
                  <Link key={circuit.id} href={`/circuits/${circuit.slug}`} className="group block h-full" aria-label={`View tour: ${circuit.name}`}>
                    <div className="bg-card rounded-md overflow-hidden shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col transform hover:-translate-y-1">
                      <div className="relative aspect-[4/3] overflow-hidden bg-background">
                        {circuit.images[0] ? (
                          <Image
                            src={circuit.images[0]}
                            alt={`${circuit.name} tour image`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1 rounded-md bg-white/90 text-xs font-semibold text-accent tracking-wide shadow-sm">
                            {circuit.category}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                          <FavoriteButton circuitId={circuit.id} />
                        </div>
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                            <span>{circuit.duration} Days</span>
                            <span className="text-primary">From ${circuit.price}</span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                            {circuit.name}
                          </h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-6 font-light">
                          {circuit.description}
                        </p>
                        <div className="mt-auto flex items-center text-foreground font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                          Explore <ArrowRight className="ml-2 h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">No featured tours at the moment.</div>
            )}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-background cv-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-accent font-medium tracking-widest text-xs uppercase">The Difference</span>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mt-4">
                  Why Travel with <br />
                  Morocco Hive?
                </h2>
                <p className="text-muted-foreground text-lg font-light leading-relaxed mt-6">
                  We don&apos;t just sell tours; we build relationships. Our commitment to authenticity and quality ensures every trip is a masterpiece of Moroccan hospitality.
                </p>

                <div className="mt-10 space-y-6">
                  {[
                    { title: "100% Local Expertise", desc: "Our team lives and breathes Morocco, providing insights you won't find anywhere else." },
                    { title: "Tailored to You", desc: "No cookie-cutter tours. Every itinerary is adjusted to your pace and interests." },
                    { title: "Fair & Transparent", desc: "We prioritize fair wages for our guides and transparent pricing for our guests." },
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mt-1">
                        <Check className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{benefit.title}</h3>
                        <p className="text-muted-foreground text-sm font-light mt-1">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-card p-8 rounded-3xl border border-border/50 text-center hover:border-primary/30 transition-colors shadow-sm">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">Safe &amp; Secure</h3>
                    <p className="text-muted-foreground text-xs font-light mt-2 leading-relaxed">Top-rated safety protocols and secure payments.</p>
                  </div>
                  <div className="bg-card p-8 rounded-3xl border border-border/50 text-center hover:border-primary/30 transition-colors shadow-sm translate-y-8">
                    <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-secondary">
                      <Star className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">Premium Quality</h3>
                    <p className="text-muted-foreground text-xs font-light mt-2 leading-relaxed">Hand-picked luxury riads and expert local guides.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-card p-8 rounded-3xl border border-border/50 text-center hover:border-primary/30 transition-colors shadow-sm -translate-y-8">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">24/7 Support</h3>
                    <p className="text-muted-foreground text-xs font-light mt-2 leading-relaxed">Real-time assistance from our team during your trip.</p>
                  </div>
                  <div className="bg-card p-8 rounded-3xl border border-border/50 text-center hover:border-primary/30 transition-colors shadow-sm">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">Local Impact</h3>
                    <p className="text-muted-foreground text-xs font-light mt-2 leading-relaxed">Supporting local communities and sustainable travel.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Local Agents */}
        <AgentsSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* FAQ */}
        <section className="py-24 bg-card border-y border-border cv-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <span className="text-accent font-medium tracking-widest text-xs uppercase">Help &amp; Advice</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
              <p className="text-muted-foreground font-light">Everything you need to know about your Moroccan journey</p>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Blog Posts */}
        <section className="py-24 bg-card cv-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Travel Insights</h2>
                <p className="text-muted-foreground mt-2 font-light">Stories, tips, and inspiration from Morocco</p>
              </div>
              <Link href="/blog" className="text-accent hover:text-accent/90 font-medium text-sm flex items-center group" aria-label="View all blog posts">
                Read All Posts <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>

            {blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <div key={post.id} className="group bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border/50 flex flex-col h-full">
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={`Cover image for ${post.title}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <Plane className="w-12 h-12 opacity-20" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <time dateTime={new Date(post.createdAt).toISOString()}>
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 font-light mb-4 flex-1">
                        {post.excerpt ?? ""}
                      </p>
                      <Link href={`/blog/${post.slug}`} className="text-primary font-medium text-sm flex items-center group/link mt-auto" aria-label={`Read article: ${post.title}`}>
                        Read More <ArrowRight className="ml-1 w-3 h-3 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <p>No blog posts found at the moment. Stay tuned!</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact */}
        <ContactForm />
      </main>
      <FAQSchema items={FAQ_ITEMS} />

      <Footer />
    </div>
  )
}
