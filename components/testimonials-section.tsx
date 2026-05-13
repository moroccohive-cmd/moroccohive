import Image from "next/image"
import { Star } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Martin Schreiber",
    location: "Canada",
    date: "Dec 08, 2024",
    image: "/r7.webp",
    text: "Our driver, Abdellatif Iggui, was absolutely outstanding in every way. He was first of all an excellent, safe driver, who knew every inch of the country and of every city. He was always on time, and always knew just how long any of our journeys would take. He made sure we were comfortable throughout, he was happy to stop for pictures or a rest as needed, he was able to share a lot of information about his country, and overall made the journeys very pleasant.",
    stars: 5,
  },
  {
    name: "Brid and Brett",
    location: "USA",
    date: "Nov 2024",
    image: "/r3.webp",
    text: "Hamza We are back in the USA after having a wonderful full trip in Africa. Thank you for all of your work for our Morroco portion of our trip. We had a great time in your country and thouroughly enjoyed all of our time there. Each of our tours was so well done and informative. We particularly loved Chefchouen, the desert and camels and Marrakech. Abdelatif was a great driver and very informative giving us wonderful nsights into the country and people. Thank you again for giving us such wonderful memories.",
    stars: 5,
  },
  {
    name: "Pamelia Bain",
    location: "USA",
    date: "Oct 22, 2024",
    image: "/r4.webp",
    text: "\"From the moment I got off the plane in Casablanca where I first met Abdellatif, I felt completely assured that I was in good hands, especially knowing he would be with me the entire trip. He is truly a professional in his skill and knowledge and he demonstrated that every step of the way. Abdellatif was always on time and kept me informed as we navigated the many kilometers we traveled daily. His enthusiasm, knowledge and love of his country shone through each day. He had a big responsibility for those 13 days with so many long hours. But he readily shared so much about the rich history and the lives of the people. I do not think I could have had a more immersive experience with anyone else.\"",
    stars: 5,
  },
  {
    name: "Natalie Foster",
    location: "USA",
    date: "Sep 3, 2025",
    image: "/r1.webp",
    text: "Morocco We'll Be Back! I want to thank MoroccoHive and the staff that made my Moroccan vacation a beautiful experience for both me and my sister. It was our first time traveling to Morocco. Our driver and guide Abdellatif was very kind and welcoming. He made every day fun and interesting. He even went so far as to teach us some Arabic words (shukran). The Sahara Desert camp site in Merzouga was one of the best highlights of our tour. Watching the sunrise the next morning in the desert was awesome.",
    stars: 5,
  },
  {
    name: "Ines Fonzalida",
    location: "Netherlands",
    date: "Sep 23",
    image: "/r2.webp",
    text: "I recently returned from leading a Mambo group tour through Morocco with your company. Throughout the tour, Abdellatif was far more than just a driver, he was an incredible support, a source of knowledge, and a true ambassador for Morocco. His warm personality, cultural insights, and exceptional people skills had a huge impact on the group's overall experience. It felt as though we had a dedicated local guide alongside us the entire time.",
    stars: 5,
  },
  {
    name: "Claramarie C.",
    location: "San Jose, CA",
    date: "Aug 14, 2025",
    image: "/r6.webp",
    text: "Our trip was spectacular! Hakim was responsive in the planning process and adjusted the items I wanted changed quickly and accurately. The Riads we stayed in were gorgeous across the board. The real star of our vacation was our diver/guide/ honorary family member Abdellatif Iggui. From the moment he met us at the airport until he dropped us at the port eight days later he was a delight. Abdellatif was knowledgeable, friendly, accommodating and fun.",
    stars: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-primary text-white cv-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-secondary font-medium tracking-widest text-xs uppercase">Guest Stories</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Travelers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white/10 border border-white/10 p-8 rounded-xl flex flex-col items-center text-center group"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <div className="grow flex flex-col">
                <details className="group/details text-left">
                  <summary className="list-none cursor-pointer group-open/details:hidden">
                    <p className="text-lg font-light leading-relaxed mb-4 italic text-white/90 line-clamp-4">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <span className="text-secondary text-sm font-medium hover:underline mb-8 block text-center">
                      Read More
                    </span>
                  </summary>
                  <p className="text-base font-light leading-relaxed mb-8 italic text-white/90">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </details>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-secondary/30 flex-shrink-0">
                  <Image src={t.image} alt={`${t.name} - Morocco Hive traveler`} fill sizes="48px" className="object-cover" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-secondary uppercase tracking-wider text-sm">{t.name}</p>
                  <p className="text-white/50 text-xs mt-1">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
