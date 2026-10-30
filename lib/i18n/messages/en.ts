import { common } from "./common/en"

/**
 * English copy — the source of truth. Every other locale is typed against this
 * object, so a missing or misspelt key in fr.ts / es.ts is a compile error.
 *
 * Placeholders use {name} syntax and are filled with `fmt()` from
 * lib/i18n/format.ts.
 */
export const en = {
    common,

    meta: {
        defaultDescription:
            "Morocco-based travel agency offering private, customizable tours led by local guides. Sahara desert, Atlas Mountains, imperial cities - designed around you.",
        home: {
            title: "Private Morocco Tours by Local Experts",
            description:
                "Custom private Morocco tours built by local guides in Marrakech. Sahara desert, Atlas Mountains, imperial cities - designed around you. {rating}.",
        },
        about: {
            title: "About Morocco Hive - Morocco-Based Private Tour Agency",
            description:
                "Morocco Hive is a Marrakech-based travel agency creating private, customizable tours led by local experts. Learn our story, team, and philosophy.",
        },
        circuits: {
            title: "Private Morocco Tour Itineraries | 5–13 Days",
            description:
                "Browse private Morocco tour itineraries - from Sahara desert camps to imperial cities. 5 to 13 days. Fully customizable. From $1,400/person.",
        },
        circuit: {
            notFound: "Circuit Not Found",
            titleWithDuration: "{name} — {days}-Day Private Morocco Tour",
        },
        destinations: {
            title: "Morocco Destinations — Where to Go, Region by Region",
            description:
                "Guides to every region we cover: Marrakech, Fes, the Sahara at Merzouga, the Atlas Mountains, Chefchaouen, Essaouira and more. Written by a local agency.",
            notFound: "Destination Not Found",
        },
        blog: {
            title: "Morocco Travel Blog | Tips & Guides by Local Experts",
            titlePaged: "Morocco Travel Blog — Page {page}",
            description:
                "Insider travel guides, tips, and cultural insights from Morocco - written by locals who live here. Plan smarter before you arrive.",
            notFound: "Post Not Found | Morocco Hive",
        },
        faq: {
            title: "Morocco Travel FAQ — Booking, Safety, Best Time to Visit",
            description:
                "Answers about booking a private Morocco tour: best time to visit, safety, travel insurance, payments, tipping and what's included in our itineraries.",
        },
        reviews: {
            title: "Traveler Reviews",
            description:
                "Read what travelers say about their private Morocco tours with Morocco Hive - honest reviews from guests guided across the Sahara, Atlas Mountains and imperial cities.",
        },
        contact: {
            title: "Contact Morocco Hive - Marrakech Travel Agency",
            description:
                "Reach Morocco Hive in Marrakech for private tours and custom itineraries. Email, phone, or WhatsApp - we reply within 24 hours.",
        },
        planTrip: {
            title: "Plan Your Morocco Trip - Custom Itinerary in 48h",
            description:
                "Tell us your dates, group, and interests. A Morocco-based travel expert sends you a custom private tour proposal within 48 hours. Free, no obligation.",
        },
        privacy: {
            title: "Privacy Policy",
            description: "Morocco Hive Privacy Policy - How we collect, use, and protect your personal information.",
        },
        terms: {
            title: "Terms of Use",
            description: "Morocco Hive Terms of Use - Terms and conditions for using our website and services.",
        },
        circuitThankYou: {
            title: "Booking Request Sent",
            description:
                "Your trip booking request has been received. Our team will get back to you shortly to confirm your booking.",
        },
        planTripThankYou: {
            title: "Thank You",
            description:
                "Your trip plan request has been received. We'll get back to you within 24 hours with a personalized itinerary.",
        },
        ogImageAlt: "Morocco Sahara desert dunes - private tours by Morocco Hive",
    },

    breadcrumb: {
        home: "Home",
        about: "About",
        tours: "Morocco Tours",
        destinations: "Destinations",
        blog: "Blog",
        faq: "FAQ",
        reviews: "Reviews",
        contact: "Contact",
        planTrip: "Plan Your Trip",
    },

    header: {
        location: "Morocco",
        logoAlt: "MoroccoHive Logo",
    },

    footer: {
        tagline: "Private tours and custom itineraries, planned by people who live in Morocco.",
        quickLinks: "Quick Links",
        home: "Home",
        ourTrips: "Our Trips",
        planTrip: "Plan Your Trip",
        reviews: "Guest Reviews",
        faq: "FAQ",
        aboutUs: "About Us",
        contactUs: "Contact Us",
        popularDestinations: "Popular Destinations",
        destinations: {
            marrakech: "Marrakech",
            fes: "Fes",
            sahara: "Sahara Desert",
            chefchaouen: "Chefchaouen",
            atlas: "Atlas Mountains",
            essaouira: "Essaouira",
        },
        allDestinations: "All destinations →",
        contactHeading: "Contact Us",
        location: "Marrakech, Morocco",
        rights: "© {year} MoroccoHive. All rights reserved.",
        builtBy: "Built by",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
    },

    /**
     * Display names for circuit categories, which are stored in English in the
     * database (matched case-insensitively). English shows the stored value
     * unchanged, so this map is empty.
     */
    categories: {} as Record<string, string>,

    trustpilot: {
        aria: "See our reviews on Trustpilot",
    },

    heroSlider: {
        alts: [
            "Merzouga - a camel caravan crossing the golden Erg Chebbi dunes",
            "Ait Ben Haddou - the fortified earthen ksar on the edge of the Sahara",
            "Volubilis - the Roman basilica arches and Triumphal Arch near Meknes",
            "Casablanca - the Hassan II Mosque and its 210-metre minaret on the Atlantic shore",
            "Fes - the Chouara tannery dye pits in the heart of the old medina",
            "Chefchaouen - the blue-washed square of the Blue City beneath the Rif Mountains",
        ],
        show: "Show background image {n}",
    },

    home: {
        heroTitle: "Discover Morocco Through a Local's Eyes",
        heroSubtitle:
            "No crowds, no fixed schedules. Just a trip designed around what you love.",
        bookCta: "Book a Private Tour",
        viewToursCta: "View Our Tours",
        travelersGuided: "200+ Travelers Guided",
        experience: "10+ Years Experience",
        featuresHeading: "Why Choose Morocco Hive",
        features: [
            { title: "100% Private Tours", desc: "Just you. No group tourists. No bus schedules." },
            { title: "Expert Local Guide", desc: "Abdellatif has guided 200+ travelers. Born and raised in Morocco." },
            { title: "Fully Customizable", desc: "Build your own itinerary. Change plans on the fly. It's your tour." },
            { title: "All-Inclusive Pricing", desc: "No hidden costs. Includes guide, driver, activities, and most meals." },
        ],
        how: {
            eyebrow: "Your Journey",
            title: "How it Works",
            subtitle: "From first inspiration to unforgettable memories",
            steps: [
                { title: "Choose Your Style", desc: "Select from our curated itineraries or tell us your travel preferences." },
                { title: "Customize & Refine", desc: "Work with our local experts to tailor every detail to your liking." },
                { title: "Secure Booking", desc: "Finalize your journey with flexible payments and full support." },
                { title: "Explore Morocco", desc: "Embark on an authentic journey guided by local insiders." },
            ],
            cta: "Start Planning",
        },
        featured: {
            title: "Morocco Tours & Itineraries",
            subtitle: "Get inspired by trips other travelers have loved",
            viewAll: "View All Trips",
            viewAllAria: "View all tours and trips",
            tourAria: "View tour: {name}",
            imageAlt: "{name} tour image",
            noImage: "No Image",
            days: "{days} Days",
            from: "From ${price}",
            explore: "Explore",
            empty: "No featured tours at the moment.",
        },
        why: {
            eyebrow: "The Difference",
            titleLine1: "Why Travel with",
            titleLine2: "Morocco Hive?",
            intro:
                "We don't just sell tours; we build relationships. Our commitment to authenticity and quality ensures every trip is a masterpiece of Moroccan hospitality.",
            benefits: [
                { title: "100% Local Expertise", desc: "Our team lives and breathes Morocco, providing insights you won't find anywhere else." },
                { title: "Tailored to You", desc: "No cookie-cutter tours. Every itinerary is adjusted to your pace and interests." },
                { title: "Fair & Transparent", desc: "We prioritize fair wages for our guides and transparent pricing for our guests." },
            ],
            cards: [
                { title: "Safe & Secure", desc: "Top-rated safety protocols and secure payments." },
                { title: "Premium Quality", desc: "Hand-picked luxury riads and expert local guides." },
                { title: "24/7 Support", desc: "Real-time assistance from our team during your trip." },
                { title: "Local Impact", desc: "Supporting local communities and sustainable travel." },
            ],
        },
        faq: {
            eyebrow: "Help & Advice",
            title: "Frequently Asked Questions",
            subtitle: "Everything you need to know about your Moroccan journey",
            viewAll: "View All FAQs",
            viewAllAria: "View all frequently asked questions",
        },
        blog: {
            title: "Travel Insights",
            subtitle: "Stories, tips, and inspiration from Morocco",
            readAll: "Read All Posts",
            readAllAria: "View all blog posts",
            coverAlt: "Cover image for {title}",
            readMore: "Read More",
            readAria: "Read article: {title}",
            empty: "No blog posts found at the moment. Stay tuned!",
        },
        schema: {
            featuredName: "Featured Morocco Tours",
            featuredDescription: "Hand-picked private Morocco itineraries by Morocco Hive.",
        },
    },

    agents: {
        title: "Our Local Agents in Morocco",
        agents: [
            {
                role: "Dedicated Tour Guide",
                description:
                    "Hello, my name is Elhoussain Iggui, and I have been a tour guide in Morocco since 1995. I specialize in hiking: the Atlas Mountains, the Rif ranges, and the Sahara dunes. Over thirty years I have guided hikers of all levels, from short day walks to multi-day expeditions, sharing the history, landscapes, and traditions of the regions we pass through.",
            },
            {
                role: "Professional Driver & Tour Guide",
                description:
                    "Hello, my name is Abdellatif Iggui, and I have been a driver and tour guide in Morocco for over 10 years. I've led more than 200 trips across the country, from Casablanca and Marrakech to the Atlas Mountains and the Sahara. I know the roads, the timing, and the stops that most itineraries miss. Every route I drive is one I know well.",
            },
        ],
        readMore: "Read More",
        eyebrow: "The Heart of Morocco",
        heading: "Guided by the People Who Know It Best",
        body:
            "Our guides were born and raised in Morocco. They know which roads to take, which towns are worth stopping in, and when the crowds arrive. That's the kind of knowledge you only get from living here.",
        cta: "Plan with an Expert",
    },

    testimonials: {
        eyebrow: "Guest Stories",
        title: "What Our Travelers Say",
        note: "Excerpts from public Trustpilot reviews of tours our guides led, quoted with permission.",
        readAll: "Read All Reviews",
        readAllAria: "Read all traveler reviews",
        previous: "Previous reviews",
        next: "Next reviews",
        rail: "Traveler reviews",
    },

    reviewCard: {
        readFull: "Read full review",
        readFullAria: "Read the full review from {name}",
        tour: "Tour:",
        stars: "{rating} out of 5 stars",
    },

    contactForm: {
        eyebrow: "Get in Touch",
        title: "Let's plan your dream trip",
        intro:
            "Have questions or ready to start planning? Send us a message and our travel experts will get right back to you.",
        emailUs: "Email Us",
        callUs: "Call Us",
        visitUs: "Visit Us",
        address: "Morocco Hive, Marrakech, Morocco",
        name: "Name",
        email: "Email",
        phone: "Phone Number",
        subject: "Subject",
        subjectPlaceholder: "Trip Inquiry...",
        message: "Message",
        messagePlaceholder: "Tell us about your dream trip...",
        send: "Send Message",
        sending: "Sending...",
        sentTitle: "Message Sent!",
        sentBody: "Thank you for contacting us. We will get back to you shortly.",
        tooMany: "Too many requests. Please try again later.",
        failed: "Failed to send message.",
        errors: {
            nameRequired: "Name is required",
            nameLetters: "Name can only contain letters",
            nameLong: "Name is too long (max 50 characters)",
            emailRequired: "Email is required",
            emailInvalid: "Please enter a valid email",
            emailLong: "Email is too long",
            phoneRequired: "Phone is required",
            phoneDigits: "Phone can only contain numbers",
            phoneLong: "Phone number is too long",
            subjectRequired: "Subject is required",
            subjectLong: "Subject is too long (max 200 characters)",
            messageRequired: "Message is required",
            messageLong: "Message is too long (max 2000 characters)",
        },
    },

    about: {
        title: "About Morocco Hive",
        lead:
            "A Morocco-based travel agency in Marrakech. We plan private tours and custom itineraries, and we're available before, during, and after your trip.",
        intro:
            "We are a Morocco-based travel agency located in Marrakech, specializing in private tours, small group journeys, and fully customized itineraries designed for travelers from around the world. Our goal is straightforward: help you see more of Morocco than the standard circuit, comfortably and at your own pace.",
        whoTitle: "Who We Are",
        whoP1:
            "Morocco Hive is an independently owned travel business, created by locals who know Morocco well: its landscapes, cultures, traditions, and the places most visitors never reach.",
        whoP2Before: "The name",
        whoP2Brand: "Morocco Hive",
        whoP2After:
            "reflects our philosophy: like a hive, Morocco is alive with diversity (deserts, mountains, cities, coastlines, and cultures) all working together to create something unlike anywhere else. We connect these elements to build journeys that feel organic and well-balanced.",
        whatTitle: "What We Do",
        whatIntro: "We design and organize personalized travel experiences across Morocco, including:",
        services: [
            "Private Morocco tours",
            "Small group tours",
            "Custom-made itineraries",
            "Sahara Desert experiences & desert camps",
            "Camel rides & outdoor adventures",
            "Hotel & traditional riad bookings",
            "Transport with experienced drivers",
            "Local guides & cultural activities",
        ],
        whatOutro:
            "Whether you are visiting Morocco for the first time or returning to explore deeper, we tailor each journey to match your interests, pace, and travel style.",
        whyTitle: "Why Travel With Morocco Hive",
        whyUs: [
            { title: "Local Expertise", description: "We live here. We know the routes, the seasons, and the details that make the difference." },
            { title: "Tailor-Made Journeys", description: "No copy-paste tours. Every itinerary is crafted around you." },
            { title: "No generic packages", description: "We don't sell the same 7-day circuit to everyone. Each itinerary is built around where you actually want to go." },
            { title: "Reliable & Transparent", description: "Clear communication, honest advice, and flexible booking options." },
            { title: "Worldwide Travelers Welcome", description: "We work with travelers from all over the world and understand international expectations." },
        ],
        philosophyTitle: "Our Travel Philosophy",
        philosophyP1:
            "We believe travel should be personal, respectful, and honest. Our goal isn't just to show you the highlights, but to give you context: the food, the history, the hospitality, and the everyday life that makes Morocco worth the trip.",
        philosophyP2:
            "We support responsible tourism by working with local drivers, guides, riads, and desert camps, helping communities benefit directly from tourism.",
        bookingTitle: "Booking & Travel Support",
        bookingFeatures: [
            "Flexible booking options",
            "Deposits available to secure your trip",
            "Pay-on-arrival options for peace of mind",
            "Ongoing support before and during your journey",
        ],
        bookingOutro: "From your first message to the end of your trip, we are here to guide you.",
        schemaDescription:
            "Morocco Hive is a Marrakech-based travel agency creating private, customizable tours led by local experts.",
    },

    circuits: {
        eyebrow: "Explore Morocco",
        title: "Browse Private Morocco Tour Itineraries",
        subtitle: "From Sahara desert camps to imperial cities. 5 to 13 days. Fully customizable. From $1,400/person.",
        schemaName: "Private Morocco Tour Itineraries",
        schemaDescription: "Private, customizable Morocco tours from 5 to 13 days.",
    },

    circuitsList: {
        tripDuration: "Trip Duration",
        tourType: "Tour Type",
        priceRange: "Price Range",
        durations: {
            all: "All Durations",
            "5": "5 Days",
            "6-7": "6-7 Days",
            "8-9": "8-9 Days",
            "10-13": "10-13 Days",
        },
        types: {
            all: "All Types",
            "Luxury & Grand Tours": "Luxury & Grand Tours",
            "Desert & Sahara": "Desert & Sahara",
            "Imperial Cities": "Imperial Cities",
            "Honeymoon & Couples": "Honeymoon & Couples",
            "Family with Kids": "Family with Kids",
        },
        prices: {
            all: "All Prices",
            "under-1500": "Under $1,500",
            "1500-2000": "$1,500 – $2,000",
            "2000-2500": "$2,000 – $2,500",
            "2500+": "$2,500+",
        },
        sort: {
            default: "Featured",
            "price-asc": "Price: Low to High",
            "price-desc": "Price: High to Low",
            "duration-asc": "Duration: Short to Long",
            "duration-desc": "Duration: Long to Short",
        },
        sortAria: "Sort tours",
        showingBefore: "Showing",
        showingOf: "of",
        showingAfter: "tours",
        clear: "Clear filters",
        emptyAll: "No journeys available at the moment.",
        emptyFiltered: "No tours match your filters.",
        cardAria: "View tour: {name} - {days} days from ${price}",
        imageAlt: "{name} – {days}-day Morocco tour",
        noImage: "No Image",
        days: "{days} Days",
        perPerson: "/ person",
        viewItinerary: "View Itinerary",
    },

    circuit: {
        allTrips: "All Trips",
        backAria: "Back to all trips",
        noImage: "No Image",
        heroAlt: "{name} tour hero image",
        experience: "The Experience",
        highlights: "Highlights",
        included: "Included",
        notIncluded: "Not Included",
        optional: "Optional",
        itineraryOverview: "Itinerary Overview",
        day: "Day {n}",
        mapAlt: "Map",
        detailedItinerary: "Detailed Itinerary",
        importantNotes: "Important Notes",
        travelerReviews: "Traveler Reviews",
        review: "review",
        reviews: "reviews",
        englishOnly: "",
    },

    booking: {
        from: "From",
        duration: "Duration",
        days: "{days} Days",
        fromPerPerson: "From ${price} / person",
        startDate: "Earliest Start Date",
        endDate: "Latest End Date",
        whoTraveling: "Who will be traveling?",
        adults: "Adults",
        children: "Children",
        infants: "Infants",
        adultsHint: "Above 12",
        childrenHint: "Ages 2-12",
        infantsHint: "Under 2",
        decrease: "Decrease number of {type}",
        increase: "Increase number of {type}",
        accommodation: "Accommodation",
        accommodationLevels: { Standard: "Standard", Comfort: "Comfort", Luxury: "Luxury" },
        preferredPayment: "Preferred Payment",
        selectPayment: "Select payment method (optional)",
        paymentMethods: {
            "Deposit Payment": "Deposit Payment (Wise / Mercury)",
            "Credit Cards": "Credit Cards (Visa, Mastercard, American Express)",
            PayPal: "PayPal",
            Payoneer: "Payoneer",
            Wise: "Wise",
            Mercury: "Mercury",
        } as Record<string, string>,
        depositTitle: "Deposit Payment Information:",
        depositLine1: "To confirm your booking, a 20% deposit is required.",
        depositLine2: "The remaining balance will be paid in cash upon arrival in Morocco.",
        fullName: "Full Name *",
        email: "Email *",
        phone: "Phone *",
        contactSupport: "Contact Support",
        submit: "Request This Trip",
        submitting: "Sending Request...",
        disclaimer:
            "Request your bespoke Morocco itinerary and receive a professionally crafted, no-obligation proposal within 48 hours.",
        mobileCta: "Request This Tour",
        errors: {
            startRequired: "Start date is required",
            startPast: "Start date cannot be in the past",
            endRequired: "End date is required",
            endPast: "End date cannot be in the past",
            endSame: "End date must be different from start date",
            endBefore: "End date must be after start date",
            nameRequired: "Please enter your full name.",
            nameLetters: "Name can only contain letters and spaces.",
            nameLong: "Name is too long (max 50 characters).",
            emailRequired: "Please enter your email address.",
            emailInvalid: "Please enter a valid email address.",
            emailLong: "Email is too long (max 100 characters).",
            phoneRequired: "Please enter your phone number.",
            phoneDigits: "Phone can only contain numbers.",
            phoneLong: "Phone number is too long (max 20 digits).",
            emailFailed:
                "Your booking was saved but we couldn't send the confirmation email. Our team will contact you soon.",
            failed: "Failed to send booking request. Please try again.",
            network: "Unable to connect to the server. Please check your connection and try again.",
        },
    },

    destinations: {
        eyebrow: "Morocco, region by region",
        title: "Where to Go in Morocco",
        summary:
            "Morocco packs an unusual amount into one country: imperial cities with medieval medinas, the tallest dunes in the Sahara, 4,000-metre peaks in the High Atlas and an Atlantic coast with real surf. Below is a guide to each place we run tours through — what it is, how long to stay, when to go, and which of our itineraries include it.",
        types: {
            City: "City",
            Desert: "Desert",
            Mountains: "Mountains",
            Coast: "Coast",
            Valley: "Valley",
        } as Record<string, string>,
        combineTitle: "Not sure how to combine them?",
        combineBody:
            "Tell us your dates and what you want to see. We'll send a route that actually works — with realistic driving times, not a wish list.",
        planTrip: "Plan Your Trip",
        browseTours: "Browse Tours",
        schemaName: "Morocco Destinations",
        schemaDescription: "Regions and cities covered by Morocco Hive private tours.",
    },

    destination: {
        imageAlt: "{name}, Morocco",
        breadcrumbLabel: "Breadcrumb",
        region: "Region",
        suggestedStay: "Suggested stay",
        bestTime: "Best time to visit",
        about: "About {name}",
        whatToSee: "What to see in {name}",
        toursTitle: "Tours that include {name}",
        toursSubtitle: "All private and fully customisable — durations and routes can be adjusted.",
        days: "{days} days",
        from: "from ",
        faqTitle: "{name}: common questions",
        nearby: "Often combined with",
        ctaTitle: "Want {name} in your itinerary?",
        ctaBody:
            "Tell us your dates and we'll build a private route around it — free proposal within 48 hours, no obligation.",
        planTrip: "Plan Your Trip",
        allDestinations: "All Destinations",
        browseAction: "Browse {count} tours featuring {name}",
    },

    blog: {
        title: "Morocco Hive Blog",
        intro:
            "Insider travel guides, tips, and cultural insights from Morocco - written by locals who live here. Plan smarter before you arrive.",
        emptyTitle: "No posts yet",
        emptyBody: "Check back soon for more stories!",
        readAria: "Read article: {title}",
        coverAlt: "Cover image for {title}",
        defaultAuthor: "Morocco Hive",
        defaultExcerpt: "Discover more about this journey through Morocco...",
        readMore: "Read More",
        schemaName: "Morocco Travel Blog",
        schemaDescription: "Travel guides, tips and cultural insights from local Moroccan experts.",
        back: "Back to Blog",
        backAria: "Back to blog listing",
        adminAuthor: "Morocco Hive Admin",
        mobileTitle: "Plan Your Trip",
        mobileDescription: "Chat with a local specialist",
        mobileButton: "Get Started",
        englishOnly: "",
        faqTitle: "Frequently Asked Questions",
    },

    faq: {
        eyebrow: "Help & Advice",
        title: "Frequently Asked Questions",
        intro:
            "Everything travelers usually ask us before booking. If your question isn't here, send it over - we answer every message.",
        empty: "No questions published yet.",
        generalCategory: "General",
        ctaTitle: "Still have a question?",
        ctaBody: "Ask us anything about your trip - a local expert will get back to you.",
        contact: "Contact Us",
        planTrip: "Plan Your Trip",
    },

    reviews: {
        eyebrow: "Guest Stories",
        title: "Traveler Reviews",
        intro:
            "Every review below comes from a traveler who booked a private tour with us. We publish them unedited apart from trimming for length.",
        average: "average from {count} Trustpilot reviews",
        empty: "No reviews published yet.",
        ctaTitle: "Ready for your own Morocco story?",
        ctaBody: "Tell us how you like to travel and we'll build the itinerary around it.",
        planTrip: "Plan Your Trip",
        browseTours: "Browse Tours",
    },

    contact: {
        title: "Contact Us",
        lead:
            "We're based in Marrakech and answer every message ourselves. Whether you need a full itinerary or just have a question about traveling in Morocco, send us a message.",
        getInTouch: "Get in Touch",
        methods: {
            email: "Email",
            phone: "Phone & WhatsApp",
            location: "Location",
            locationValue: "Marrakech, Morocco",
        },
        worldwide:
            "We work with travelers from all over the world, and we are available to answer questions before, during, and after your trip.",
        planTitle: "Plan Your Trip With Us",
        planIntro: "When contacting us, feel free to share:",
        tripDetails: [
            "Your travel dates",
            "Number of travelers",
            "Places you'd like to visit",
            "Travel style (private, group, luxury, adventure, etc.)",
            "Any special requests or interests",
        ],
        planOutro: "The more details you provide, the better we can tailor your experience.",
        whyTitle: "Why Contact Morocco Hive?",
        whyContact: [
            "Local Morocco-based travel experts",
            "Personalized itineraries, not standard packages",
            "Flexible booking options (deposits & pay on arrival)",
            "Reliable communication via email or WhatsApp",
        ],
        responseTitle: "Response Time",
        responseBody:
            "We aim to respond to all inquiries within 24 hours. If you don't see our reply, please check your spam folder or contact us via WhatsApp for a faster response.",
        ctaTitle: "Ready to plan your trip?",
        ctaBody:
            "Tell us your dates and what you want to see. We'll put together something that fits, whether you have five days or three weeks.",
        emailUs: "Email Us",
        whatsapp: "WhatsApp",
    },

    planTrip: {
        title: "Plan Your Dream Trip",
        introTitle: "Let's together create a dream Morocco tour",
        introQuote:
            "\"Hello, I'm Abdellatif, Moroccohive's personal contact! I'll walk you through the form to construct your ideal tour over the course of the next three minutes. After you're done, a local expert will respond to you with a first customized travel suggestion in no more than 48 hours (and often quicker).\"",
        trust1: "Free consultation ",
        trust2: "· No credit card required",
        trust3: "· Reply within 48h",
        steps: ["Travel Style", "When & Where", "Preferences", "Complete"],
        step1: {
            title: "Who's Traveling?",
            subtitle: "Help us understand your group",
            travelStyle: "Travel Style",
            styles: { Solo: "Solo", Couple: "Couple", Family: "Family", Group: "Group" },
            whoTraveling: "Who will be traveling?",
            oneAdult: "1 Adult",
            twoAdults: "2 Adults",
            soloSelected: "Solo travel selected",
            coupleSelected: "Couple travel selected",
            totalTravelers: "Total travelers:",
        },
        travelers: {
            adults: "Adults",
            children: "Children",
            infants: "Infants",
            adultsHint: "Above 12",
            childrenHint: "Ages 2-12",
            infantsHint: "Under 2",
            adult: "adult",
            adultPlural: "adults",
            child: "child",
            childPlural: "children",
            infant: "infant",
            infantPlural: "infants",
        },
        step2: {
            title: "When & Where?",
            subtitle: "Plan your journey through Morocco",
            window: "Travel Window",
            startDate: "Earliest Start Date",
            endDate: "Latest End Date",
            arrivalCity: "Arrival City",
            departureCity: "Departure City",
            selectCity: "Select city",
        },
        step3: {
            title: "Your Preferences",
            subtitle: "Customize your perfect experience",
            accommodationQuestion: "What is your preferred accommodation type?",
            accommodationLevels: { Standard: "Standard", Comfort: "Comfort", Luxury: "Luxury" } as Record<string, string>,
            budget: "Budget Range (per person)",
            selectBudget: "Select budget",
            activities: "Adventure Activities (Optional)",
            experiencesQuestion: "What experiences are you looking for in Morocco? (Optional)",
            factorsQuestion: "Which of the following are important for this trip to Morocco? (Optional)",
            additionalInfo: "Additional information (optional)",
            additionalPlaceholder: "e.g. local market tours, hiking, river cruises, cooking classes",
        },
        /** Keyed by the English value that is stored with the request. */
        experiences: {
            "History & culture": "History & culture",
            "Nature & landscapes": "Nature & landscapes",
            "Wildlife & safari": "Wildlife & safari",
            "Relaxation & wellness": "Relaxation & wellness",
            "Active & adventure": "Active & adventure",
            "Luxury travel": "Luxury travel",
        } as Record<string, string>,
        factors: {
            "Historical Sites, Museums & Monuments": {
                name: "Historical Sites, Museums & Monuments",
                description:
                    "Immerse yourself in the hustle and bustle of Morocco's cities as you explore labyrinthine backstreets, architecture dating back centuries, and souks brimming with spices, wool rugs, and more.",
            },
            "Nature & Outdoors": {
                name: "Nature & Outdoors",
                description:
                    "From the snowcapped Atlas mountains to the undulating dunes of the Sahara desert and out to the vast coastline, discover Morocco's natural wonders on hikes, nature tours, and other outdoor excursions.",
            },
            "Active Vacation": {
                name: "Active Vacation",
                description:
                    "Morocco offers limitless options for adventure, including mountain hikes through Berber villages, camel rides in the desert, sandboarding down the Sahara dunes, galloping on horseback along the beach, and more.",
            },
            "Local Cuisine": {
                name: "Local Cuisine",
                description:
                    "Experience the highlights of Moroccan cuisine, from cooking classes and market visits to wine tastings in beautiful vineyards and enjoying a home-cooked tajine in the company of locals.",
            },
            "Experience Culture & Local Life": {
                name: "Experience Culture & Local Life",
                description:
                    "Immerse yourself in local life by exploring small villages, getting lost in quirky souqs, and sipping on chai nana (mint tea) on a café patio while enjoying the culture around you.",
            },
        } as Record<string, { name: string; description: string }>,
        activities: {
            "Long Hikes (4 hrs-Full Day)": {
                name: "Long Hikes (4 hrs-Full Day)",
                description:
                    "Get the blood pumping on scenic day hikes like the summit trek up Mount Toubkal or the High Atlas trail.",
            },
            "Multi-Day Trekking": {
                name: "Multi-Day Trekking",
                description:
                    "Pack your overnight gear and head out on multi-day treks throughout Morocco from High Atlas to Sahara.",
            },
            "Horseback Riding": {
                name: "Horseback Riding",
                description: "Experience the beauty of Morocco on horseback as you gallop through the surf near Essaouira.",
            },
            Surfing: {
                name: "Surfing",
                description:
                    "Explore Morocco's long coastline, a prime surf destination for beginners and experienced wave riders.",
            },
            ATV: {
                name: "ATV",
                description:
                    "Hop on an ATV and zip around the gorges of the High Atlas mountains or the arid hills of Agafay Desert.",
            },
            "Hot Air Balloon": {
                name: "Hot Air Balloon",
                description: "Experience breathtaking views of the Atlas Mountains and local landscapes from a hot air balloon.",
            },
        } as Record<string, { name: string; description: string }>,
        step4: {
            title: "Almost Done!",
            subtitleVerified: "Review your trip details and submit your request",
            subtitleGuest: "Fill in your contact details and submit your request",
            welcome: "Welcome!",
            verifiedBody: "Click submit to send your personalized trip request. We'll get back to you within 24 hours.",
            paymentMethod: "Preferred Payment Method",
            fullName: "Full Name",
            email: "Email",
            phone: "Phone",
            submit: "Submit Trip Request",
            submitting: "Submitting...",
        },
        previous: "Previous",
        next: "Next",
        submitRequest: "Submit Request",
        failed: "Failed to submit request",
        errors: {
            travelStyle: "Please select your travel style",
            numberOfTravelers: "Please enter number of travelers",
            startRequired: "Start date is required",
            startPast: "Start date cannot be in the past",
            endRequired: "End date is required",
            endPast: "End date cannot be in the past",
            endSame: "End date must be different from start date",
            endBefore: "End date must be after start date",
            arrivalCity: "Please select arrival city",
            departureCity: "Please select departure city",
            accommodation: "Please select accommodation",
            budget: "Please select budget",
            nameRequired: "Please enter your full name",
            nameLetters: "Name can only contain letters and spaces",
            nameLong: "Name is too long (max 50 characters)",
            emailRequired: "Please enter your email",
            emailInvalid: "Please enter a valid email address",
            emailLong: "Email is too long (max 100 characters)",
            phoneRequired: "Please enter your phone number",
            phoneDigits: "Phone can only contain numbers",
            phoneLong: "Phone number is too long (max 20 digits)",
        },
    },

    thankYou: {
        circuit: {
            title: "Request Sent!",
            body:
                "Thank you for your booking request. Our team will get back to you shortly to confirm your trip details and finalize your itinerary.",
            home: "Back to Home",
            browse: "Browse More Trips",
        },
        planTrip: {
            title: "Thank You!",
            body:
                "We've received your trip request and will get back to you within 24 hours with a personalized itinerary.",
            home: "Back to Home",
            browse: "Browse Trips",
        },
    },

    privacy: {
        title: "Privacy Policy",
        updated: "Last updated: January 15, 2026",
        introBefore:
            "Welcome to Morocco Hive (\"we,\" \"our,\" or \"us\"). We respect your privacy and are committed to protecting any personal information you share with us through our website",
        s1Title: "1. Information We Collect",
        s1Lead: "We may collect the following information when you use our website or contact us:",
        s1Items: [
            "Full name",
            "Email address",
            "Phone number / WhatsApp number",
            "Travel preferences and itinerary details",
            "Any information you voluntarily provide via contact or booking forms",
        ],
        s2Title: "2. How We Use Your Information",
        s2Lead: "We use your information to:",
        s2Items: [
            "Respond to inquiries and requests",
            "Organize tours, bookings, and travel services",
            "Communicate regarding reservations, payments, or itinerary changes",
            "Improve our services and customer experience",
            "Comply with legal obligations",
        ],
        s2Strong: "We do not sell or rent your personal data to third parties.",
        s3Title: "3. Payments",
        s3Text:
            "Morocco Hive may request deposits or allow payment on arrival. We do not store or process credit card details directly on our website. Payment arrangements are handled securely via agreed methods with the client.",
        s4Title: "4. Sharing Information",
        s4Lead: "We may share limited personal information only with trusted partners when necessary, such as:",
        s4Items: ["Hotels", "Transport providers", "Local guides or activity operators"],
        s4Outro: "This information is shared strictly to deliver the requested travel services.",
        s5Title: "5. Data Protection",
        s5Text:
            "We take reasonable technical and organizational measures to protect your personal data from unauthorized access, misuse, or disclosure.",
        s6Title: "6. Cookies",
        s6Text:
            "Our website may use cookies to improve functionality and user experience. You can disable cookies through your browser settings if you prefer.",
        s7Title: "7. Your Rights",
        s7Lead: "You have the right to:",
        s7Items: [
            "Request access to your personal data",
            "Request correction or deletion of your data",
            "Withdraw consent for communication at any time",
        ],
        s7Contact: "To exercise these rights, contact us at",
        s8Title: "8. Contact Information",
        s8Address: "Morocco Hive, Marrakech, Morocco",
        s8Phone: "Phone: +212 634 717 423 | WhatsApp: +212 681 134 299",
        s9Title: "9. Governing Law",
        s9Text: "This Privacy Policy is governed by the laws of Morocco.",
    },

    terms: {
        title: "Terms of Use",
        updated: "Last updated: January 15, 2026",
        introBefore: "By accessing or using",
        introAfter:
            ", you agree to be bound by the following Terms of Use. If you do not agree, please do not use our website or services.",
        s1Title: "1. About Morocco Hive",
        s1Lead:
            "Morocco Hive is an individually owned travel agency registered in Morocco, offering travel and tourism services worldwide, including:",
        s1Items: [
            "Private tours",
            "Group tours",
            "Custom itineraries",
            "Hotel bookings",
            "Transport and drivers",
            "Activities such as camel rides, desert camps, and guided tours",
        ],
        s2Title: "2. Booking Conditions",
        s2Items: [
            "Bookings may require a deposit to confirm services",
            "Remaining balances may be paid on arrival in Morocco, unless otherwise agreed",
            "Prices depend on availability, season, and selected services",
        ],
        s3Title: "3. Cancellations & Changes",
        s3Items: [
            "Cancellation policies vary depending on suppliers (hotels, camps, transport, etc.)",
            "Deposits may be non-refundable depending on the services booked",
            "Changes requested by the client are subject to availability and may incur additional costs",
        ],
        s4Title: "4. Liability Disclaimer",
        s4Lead:
            "Morocco Hive acts as an organizer and intermediary between clients and service providers. We are not liable for:",
        s4Items: [
            "Accidents, injuries, illness, or loss of personal belongings",
            "Delays, cancellations, or disruptions caused by weather, strikes, or force majeure",
            "Actions or omissions of third-party providers",
        ],
        s4Strong: "Clients participate in tours and activities at their own risk.",
        s5Title: "5. Travel Responsibility",
        s5Lead: "Clients are responsible for:",
        s5Items: [
            "Valid passports, visas, and travel documents",
            "Travel insurance (strongly recommended)",
            "Following local laws, customs, and safety instructions",
        ],
        s6Title: "6. Intellectual Property",
        s6Text:
            "All website content (text, images, logos) belongs to Morocco Hive unless stated otherwise and may not be copied or used without written permission.",
        s7Title: "7. Website Use",
        s7Lead: "You agree not to:",
        s7Items: [
            "Use the website for unlawful purposes",
            "Attempt to damage, hack, or disrupt the website",
            "Misuse contact forms or submit false information",
        ],
        s8Title: "8. Governing Law",
        s8Text: "These Terms of Use are governed by and interpreted under the laws of Morocco.",
        s9Title: "9. Contact",
        s9Lead: "For any questions regarding these Terms, contact us at:",
    },
}

export type Messages = typeof en
