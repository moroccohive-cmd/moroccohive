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
import { HeroBackgroundSlider } from "@/components/hero-background-slider"
import { FAQItem } from "@/components/faq-item"
import { FAQSchema, ItemListSchema } from "@/components/structured-data"
import { getHomeFaqs, getHomeReviews, localizeFaqs } from "@/lib/site-content"
import { buildMetadata, SITE_RATING_LABEL } from "@/lib/seo"
import prisma from "@/lib/prisma"
import { localizePath, type Locale } from "@/lib/i18n/config"
import { categoryLabel, getMessages } from "@/lib/i18n/messages"
import { fmt, formatDate } from "@/lib/i18n/format"
import { localizeRecord } from "@/lib/i18n/content"

const AgentsSection = dynamic(
  () => import("@/components/agents-section").then((m) => m.AgentsSection),
  { loading: () => <div className="py-24 bg-background min-h-[560px]" /> },
)

const TestimonialsSection = dynamic(
  () => import("@/components/testimonials-section").then((m) => m.TestimonialsSection),
  { loading: () => <div className="py-24 bg-background min-h-[520px]" /> },
)

const FavoriteButton = dynamic(
  () => import("@/components/favorite-button").then((m) => m.FavoriteButton),
  { loading: () => <div className="w-9 h-9" /> },
)

const ContactForm = dynamic(
  () => import("@/components/contact-form").then((m) => m.ContactForm),
  { loading: () => <div className="py-24 bg-background/50" /> },
)

export function homeMetadata(locale: Locale): Metadata {
  const t = getMessages(locale).meta.home
  const title = `${t.title} | Morocco Hive`
  return {
    ...buildMetadata({
      title: t.title,
      description: fmt(t.description, { rating: SITE_RATING_LABEL }),
      path: "/",
      locale,
    }),
    // The root layout's template would otherwise append "| Morocco Hive" twice.
    title: locale === "en" ? title : { absolute: title },
  }
}

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
        translations: true,
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
        translations: true,
      },
    })
  } catch {
    return []
  }
}

export async function HomeView({ locale }: { locale: Locale }) {
  const [circuitsRaw, blogPostsRaw, reviews, faqsRaw] = await Promise.all([
    getFeaturedCircuits(),
    getLatestBlogs(),
    getHomeReviews(),
    getHomeFaqs(),
  ])

  const t = getMessages(locale)
  const h = t.home
  const lp = (path: string) => localizePath(locale, path)

  const circuits = circuitsRaw.map((c) => localizeRecord("circuit", c, locale).data)
  const blogPosts = blogPostsRaw.map((p) => localizeRecord("blog", p, locale).data)
  const faqs = localizeFaqs(faqsRaw, locale)

  // Untranslated FAQs are shown but kept out of the schema, which should be in
  // the page's language.
  const faqSchemaItems = faqs
    .filter((faq) => !faq.lang)
    .map((faq) => ({ q: faq.question, a: faq.answer }))

  return (
    <div className="min-h-screen bg-background/50 flex flex-col font-sans">
      <Header locale={locale} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          <HeroBackgroundSlider alts={t.heroSlider.alts} showLabel={t.heroSlider.show} />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              {h.heroTitle}
            </h1>

            <p className="text-base md:text-2xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto mb-6 md:mb-10">
              {h.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-cta hover:bg-cta/90 text-cta-foreground px-8 h-12 text-base rounded-md font-medium transition-all">
                <Link href={lp("/plan-trip")}>{h.bookCta}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent hover:bg-white/10 text-white/90 border-white/20 px-8 h-12 text-base rounded-md font-medium transition-all">
                <Link href={lp("/circuits")}>{h.viewToursCta}</Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-white/90 text-sm font-medium px-5 py-3 rounded-md backdrop-blur-md border border-white/25 shadow-lg">
                <span>{SITE_RATING_LABEL}</span>
                <span className="text-white/40 hidden sm:inline">|</span>
                <span>{h.travelersGuided}</span>
                <span className="text-white/40 hidden sm:inline">|</span>
                <span>{h.experience}</span>
              </div>
            </div>

            {/* Trustpilot Badge — inline centered on mobile */}
            <div className="mt-4 flex justify-center sm:hidden">
              <TrustpilotBadge label={t.trustpilot.aria} />
            </div>
          </div>

          {/* Trustpilot Badge — absolute on desktop */}
          <div className="hidden sm:block absolute bottom-8 left-6 z-20">
            <TrustpilotBadge label={t.trustpilot.aria} />
          </div>
        </section>

        {/* Why Choose Feature Row */}
        <section className="py-10 bg-card border-b border-border" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">{h.featuresHeading}</h2>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[Shield, Star, Settings2, Check].map((Icon, i) => (
                <div key={i} className="flex items-start gap-4 p-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{h.features[i].title}</h3>
                    <p className="text-muted-foreground text-xs font-light mt-1 leading-relaxed">{h.features[i].desc}</p>
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
              <span className="text-accent font-medium tracking-widest text-xs uppercase">{h.how.eyebrow}</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{h.how.title}</h2>
              <p className="text-muted-foreground font-light">{h.how.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-px border-t border-dashed border-border -translate-y-1/2 z-0" />

              {[MousePointerClick, Settings2, CalendarCheck, Map].map((Icon, idx) => (
                <div key={idx} className="relative z-10 bg-background border border-border/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="text-4xl font-bold text-primary/60 transition-colors">{`0${idx + 1}`}</span>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{h.how.steps[idx].title}</h3>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed">{h.how.steps[idx].desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white/90 px-8 h-12 text-base rounded-md font-medium transition-all">
                <Link href={lp("/plan-trip")}>{h.how.cta}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Circuits */}
        <section className="py-24 bg-background/50 cv-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">{h.featured.title}</h2>
                <p className="text-muted-foreground mt-2 font-light">{h.featured.subtitle}</p>
              </div>
              <Link href={lp("/circuits")} className="flex items-center text-accent hover:text-accent/90 font-medium group text-sm" aria-label={h.featured.viewAllAria}>
                {h.featured.viewAll} <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>

            {circuits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {circuits.map((circuit) => (
                  <Link key={circuit.id} href={lp(`/circuits/${circuit.slug}`)} className="group block h-full" aria-label={fmt(h.featured.tourAria, { name: circuit.name })}>
                    <div className="bg-card rounded-md overflow-hidden shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col transform hover:-translate-y-1">
                      <div className="relative aspect-[4/3] overflow-hidden bg-background">
                        {circuit.images[0] ? (
                          <Image
                            src={circuit.images[0]}
                            alt={fmt(h.featured.imageAlt, { name: circuit.name })}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm">{h.featured.noImage}</div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1 rounded-md bg-white/90 text-xs font-semibold text-accent tracking-wide shadow-sm">
                            {categoryLabel(t, circuit.category)}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                          <FavoriteButton circuitId={circuit.id} />
                        </div>
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                            <span>{fmt(h.featured.days, { days: circuit.duration })}</span>
                            <span className="text-primary">{fmt(h.featured.from, { price: circuit.price })}</span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                            {circuit.name}
                          </h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-6 font-light">
                          {circuit.description}
                        </p>
                        <div className="mt-auto flex items-center text-foreground font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                          {h.featured.explore} <ArrowRight className="ml-2 h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">{h.featured.empty}</div>
            )}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-background cv-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-accent font-medium tracking-widest text-xs uppercase">{h.why.eyebrow}</span>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mt-4">
                  {h.why.titleLine1} <br />
                  {h.why.titleLine2}
                </h2>
                <p className="text-muted-foreground text-lg font-light leading-relaxed mt-6">
                  {h.why.intro}
                </p>

                <div className="mt-10 space-y-6">
                  {h.why.benefits.map((benefit, i) => (
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
                    <h3 className="font-bold text-foreground text-lg">{h.why.cards[0].title}</h3>
                    <p className="text-muted-foreground text-xs font-light mt-2 leading-relaxed">{h.why.cards[0].desc}</p>
                  </div>
                  <div className="bg-card p-8 rounded-3xl border border-border/50 text-center hover:border-primary/30 transition-colors shadow-sm translate-y-8">
                    <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-secondary">
                      <Star className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">{h.why.cards[1].title}</h3>
                    <p className="text-muted-foreground text-xs font-light mt-2 leading-relaxed">{h.why.cards[1].desc}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-card p-8 rounded-3xl border border-border/50 text-center hover:border-primary/30 transition-colors shadow-sm -translate-y-8">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">{h.why.cards[2].title}</h3>
                    <p className="text-muted-foreground text-xs font-light mt-2 leading-relaxed">{h.why.cards[2].desc}</p>
                  </div>
                  <div className="bg-card p-8 rounded-3xl border border-border/50 text-center hover:border-primary/30 transition-colors shadow-sm">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">{h.why.cards[3].title}</h3>
                    <p className="text-muted-foreground text-xs font-light mt-2 leading-relaxed">{h.why.cards[3].desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Local Agents */}
        <AgentsSection locale={locale} />

        {/* Testimonials */}
        <TestimonialsSection reviews={reviews} messages={t.testimonials} cardLabels={t.reviewCard} />

        {/* FAQ */}
        <section className="py-24 bg-card border-y border-border cv-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <span className="text-accent font-medium tracking-widest text-xs uppercase">{h.faq.eyebrow}</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{h.faq.title}</h2>
              <p className="text-muted-foreground font-light">{h.faq.subtitle}</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <FAQItem key={faq.id} question={faq.question} answer={faq.answer} lang={faq.lang} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href={lp("/faq")} className="inline-flex items-center text-accent hover:text-accent/90 font-medium text-sm group" aria-label={h.faq.viewAllAria}>
                {h.faq.viewAll} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Blog Posts */}
        <section className="py-24 bg-card cv-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">{h.blog.title}</h2>
                <p className="text-muted-foreground mt-2 font-light">{h.blog.subtitle}</p>
              </div>
              <Link href={lp("/blog")} className="text-accent hover:text-accent/90 font-medium text-sm flex items-center group" aria-label={h.blog.readAllAria}>
                {h.blog.readAll} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
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
                          alt={fmt(h.blog.coverAlt, { title: post.title })}
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
                          {formatDate(post.createdAt, locale, {
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
                      <Link href={lp(`/blog/${post.slug}`)} className="text-primary font-medium text-sm flex items-center group/link mt-auto" aria-label={fmt(h.blog.readAria, { title: post.title })}>
                        {h.blog.readMore} <ArrowRight className="ml-1 w-3 h-3 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <p>{h.blog.empty}</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact */}
        <ContactForm messages={t.contactForm} />
      </main>

      <FAQSchema items={faqSchemaItems} />
      {circuits.length > 0 && (
        <ItemListSchema
          name={h.schema.featuredName}
          description={h.schema.featuredDescription}
          path="/"
          locale={locale}
          items={circuits.map((c) => ({
            name: c.name,
            path: `/circuits/${c.slug}`,
            description: c.description,
            image: (c.images as string[])?.[0],
            price: c.price,
          }))}
        />
      )}

      <Footer locale={locale} />
    </div>
  )
}
