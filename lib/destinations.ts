/**
 * Geographic dataset powering /destinations.
 *
 * Each entry carries the three things location SEO needs: real coordinates, a
 * `sameAs` link to the canonical encyclopedia entity (so engines resolve
 * "Fes" the place rather than guessing), and enough original prose that the
 * page stands on its own rather than reading as a doorway page.
 *
 * `circuitKeywords` are matched case-insensitively against circuit name,
 * category, tagline and itinerary text to pull the relevant tours onto the page.
 */

export interface DestinationFaq {
    question: string
    answer: string
}

export interface Destination {
    slug: string
    /** Common English name. */
    name: string
    /** Longer, keyword-bearing page title. */
    headline: string
    /** Administrative region, used in PostalAddress + breadcrumbs. */
    region: string
    /** Short label for cards and lists. */
    type: "City" | "Desert" | "Mountains" | "Coast" | "Valley"
    latitude: number
    longitude: number
    /** Canonical entity URLs for schema `sameAs`. */
    sameAs: string[]
    /** Meta description. Keep under ~155 characters. */
    metaDescription: string
    /** Answer-first opening paragraph — the block AI engines are most likely to quote. */
    summary: string
    /** Supporting paragraphs of original copy. */
    body: string[]
    highlights: string[]
    bestTimeToVisit: string
    suggestedStay: string
    /** Nearby places, by slug, for internal linking. */
    nearby: string[]
    faqs: DestinationFaq[]
    circuitKeywords: string[]
    image: string
}

export const DESTINATIONS: Destination[] = [
    {
        slug: "marrakech",
        name: "Marrakech",
        headline: "Marrakech Tours & Travel Guide",
        region: "Marrakech-Safi",
        type: "City",
        latitude: 31.6295,
        longitude: -7.9811,
        sameAs: ["https://en.wikipedia.org/wiki/Marrakesh"],
        metaDescription:
            "Marrakech travel guide by a local agency: what to see, how many days to stay, best season, and private tours starting from the red city.",
        summary:
            "Marrakech is Morocco's most-visited city and the usual starting point for a Moroccan tour. Its walled medina — a UNESCO World Heritage site — holds the Jemaa el-Fnaa square, the Koutoubia Mosque, the Saadian Tombs and the Bahia Palace, all within walking distance of each other. Most travellers spend two to three days here before heading to the desert or the Atlas Mountains.",
        body: [
            "The city splits cleanly in two. The medina is the historic walled core: souks, riads, madrasas and the open-air food stalls that fill Jemaa el-Fnaa every evening. Gueliz, the newer district built during the French protectorate, is where you find wider streets, restaurants and the Jardin Majorelle. Staying inside the medina puts you closest to the sights but means arriving on foot — cars cannot reach most riads.",
            "Marrakech is also Morocco's main transport hub for southern routes. The road over the Tizi n'Tichka pass to Ouarzazate and the Sahara starts here, as does the shorter run into the High Atlas towards Imlil and the Ourika Valley. Any tour that includes the desert almost certainly begins or ends in Marrakech.",
            "Our tours through Marrakech are private, so the pace is yours. A typical first day covers the Saadian Tombs, the Bahia Palace and the souks with a licensed local guide, leaving the evening free for Jemaa el-Fnaa. Travellers who prefer gardens and galleries to monuments can swap the itinerary entirely.",
        ],
        highlights: [
            "Jemaa el-Fnaa — the main square, busiest after sunset",
            "Koutoubia Mosque and its 12th-century minaret",
            "Bahia Palace and the Saadian Tombs",
            "The souks: spices, leather, lanterns and carpets",
            "Jardin Majorelle and the Yves Saint Laurent Museum",
            "Day trips to the Ourika Valley and the Agafay desert",
        ],
        bestTimeToVisit:
            "March to May and September to November. Summer regularly passes 40°C, and while winter days are mild, evenings get genuinely cold.",
        suggestedStay: "2–3 days",
        nearby: ["atlas-mountains", "essaouira", "ouarzazate-ait-benhaddou"],
        faqs: [
            {
                question: "How many days do you need in Marrakech?",
                answer:
                    "Two to three days is enough to see the medina's main monuments, spend an evening at Jemaa el-Fnaa, and still have time for the Jardin Majorelle or a day trip to the Ourika Valley. If Marrakech is your only stop in Morocco, four days lets you add the Agafay desert or a High Atlas village.",
            },
            {
                question: "Is Marrakech a good base for exploring Morocco?",
                answer:
                    "Yes. Marrakech has the busiest international airport in the south of the country and sits at the head of the main routes to the Sahara, the Atlas Mountains and the Atlantic coast. Most of our multi-day circuits start or finish here.",
            },
            {
                question: "How far is Marrakech from the Sahara desert?",
                answer:
                    "Merzouga and the Erg Chebbi dunes are roughly 560 km from Marrakech — about nine to ten hours of driving, which is why it is normally done over two days with an overnight stop in the Dades or Todra area. Zagora, the closer desert option, is around seven hours.",
            },
        ],
        circuitKeywords: ["marrakech", "marrakesh", "imperial"],
        image: "/hero-bg.webp",
    },
    {
        slug: "fes",
        name: "Fes",
        headline: "Fes Tours & Travel Guide",
        region: "Fès-Meknès",
        type: "City",
        latitude: 34.0331,
        longitude: -5.0003,
        sameAs: ["https://en.wikipedia.org/wiki/Fez,_Morocco"],
        metaDescription:
            "Fes travel guide: the medina, the tanneries, how long to stay, and private Morocco tours that include the country's oldest imperial city.",
        summary:
            "Fes is the oldest of Morocco's four imperial cities and home to Fes el-Bali, one of the largest car-free urban areas in the world. Founded in the 9th century, it holds the al-Qarawiyyin — recognised as the world's oldest continuously operating university — along with the Chouara tanneries and the Bou Inania Madrasa. Two days is the usual stay.",
        body: [
            "Fes el-Bali is a genuine maze: several thousand alleys, most too narrow for vehicles, with goods still moved by handcart and mule. This is the main practical difference between Fes and Marrakech — Fes feels less adapted to tourism, which is exactly why many travellers prefer it. A local guide is close to essential on a first visit, not for safety but for navigation.",
            "The Chouara tanneries are the city's signature sight, worked by hand with methods largely unchanged since the medieval period. Surrounding leather shops let visitors onto their terraces for the view. The Bou Inania and al-Attarine madrasas show Marinid-era craftsmanship at its peak, and the Dar Batha museum holds the city's ceramics collection — Fes blue pottery is made nowhere else.",
            "Fes works well as the northern anchor of a Morocco circuit. From here it is a straightforward drive to Chefchaouen in the Rif, to Meknes and the Roman ruins at Volubilis, or south through the Middle Atlas cedar forests towards Merzouga and the Sahara.",
        ],
        highlights: [
            "Fes el-Bali medina, a UNESCO World Heritage site",
            "Chouara tanneries, viewed from the leather-shop terraces",
            "Al-Qarawiyyin mosque and university",
            "Bou Inania and al-Attarine madrasas",
            "Bab Bou Jeloud, the blue gate",
            "Fes blue ceramics and traditional zellige workshops",
        ],
        bestTimeToVisit:
            "April to June and September to October. Fes sits inland and gets hotter than the coast in summer, with cold, wet spells in winter.",
        suggestedStay: "2 days",
        nearby: ["meknes-volubilis", "chefchaouen", "sahara-desert-merzouga"],
        faqs: [
            {
                question: "Is Fes or Marrakech better to visit?",
                answer:
                    "They serve different appetites. Marrakech is livelier, better set up for visitors and closer to the desert and mountain routes. Fes is older, denser and more intact — the better choice if your interest is history, craft and architecture. Most of our longer circuits include both.",
            },
            {
                question: "Do you need a guide in the Fes medina?",
                answer:
                    "For a first visit, we strongly recommend one. Fes el-Bali has thousands of unnamed alleys and mapping apps lose signal between the walls. A licensed guide also gets you into workshops and terraces you would otherwise walk straight past.",
            },
            {
                question: "How far is Fes from Chefchaouen?",
                answer:
                    "About 200 km, or four hours by road through the Rif Mountains. It is a common leg on northern circuits and easily done in a morning.",
            },
        ],
        circuitKeywords: ["fes", "fez", "imperial"],
        image: "/hero-bg.webp",
    },
    {
        slug: "sahara-desert-merzouga",
        name: "Sahara Desert (Merzouga)",
        headline: "Sahara Desert Tours from Merzouga & Erg Chebbi",
        region: "Drâa-Tafilalet",
        type: "Desert",
        latitude: 31.0997,
        longitude: -4.0122,
        sameAs: [
            "https://en.wikipedia.org/wiki/Merzouga",
            "https://en.wikipedia.org/wiki/Erg_Chebbi",
        ],
        metaDescription:
            "Sahara desert tours to Merzouga and the Erg Chebbi dunes: camel treks, desert camps, how to get there, and the best months to go.",
        summary:
            "Merzouga is the village at the edge of Erg Chebbi, the dune field most travellers picture when they think of the Moroccan Sahara. Dunes reach around 150 metres, and the standard experience is a camel trek in at sunset, a night in a desert camp, and sunrise from the ridge above camp. Merzouga is roughly two days' drive from Marrakech or one long day from Fes.",
        body: [
            "There are two main desert options in Morocco, and the difference matters. Erg Chebbi at Merzouga has the tall, classic dunes and the better camps, but it is further from the cities. Erg Chigaga, reached via Zagora and M'Hamid, is remoter and requires a 4x4 transfer across open desert. Zagora itself is closer to Marrakech but its dunes are small — travellers who choose it for the shorter drive are often disappointed.",
            "Camps range from shared canvas tents with communal washrooms to private suites with ensuite bathrooms, proper beds and electricity. We book according to what you tell us; the difference in comfort is significant and worth deciding deliberately rather than by default.",
            "A night in the desert is usually the anchor of a Morocco itinerary rather than a standalone trip. The drive from Marrakech crosses the Tizi n'Tichka pass, passes Aït Benhaddou and Ouarzazate, and runs through the Dades and Todra gorges — the route is much of the point, and rushing it in one day is the most common itinerary mistake we correct.",
        ],
        highlights: [
            "Camel trek into the Erg Chebbi dunes at sunset",
            "Overnight in a Berber desert camp under open sky",
            "Sunrise from the top of the dunes",
            "4x4 excursions to Khamlia and the Gnawa music villages",
            "Sandboarding and quad biking on the erg",
            "Some of the darkest night skies accessible in Morocco",
        ],
        bestTimeToVisit:
            "October to April. Midsummer daytime temperatures in the erg regularly exceed 45°C; December and January nights can drop near freezing, so camps supply heavy blankets.",
        suggestedStay: "1–2 nights",
        nearby: ["dades-todra-gorges", "ouarzazate-ait-benhaddou", "fes"],
        faqs: [
            {
                question: "Is Merzouga or Zagora better for a Sahara tour?",
                answer:
                    "Merzouga, in almost every case. The Erg Chebbi dunes near Merzouga are far larger and more dramatic than the modest dunes at Zagora, and the camps are better. Zagora's only real advantage is being closer to Marrakech, which matters if you have just two days.",
            },
            {
                question: "How long is the drive from Marrakech to Merzouga?",
                answer:
                    "Around 560 km and nine to ten hours of driving. We split it over two days with an overnight in the Dades or Todra valley, which also lets you see Aït Benhaddou, Ouarzazate and the gorges properly instead of through a car window.",
            },
            {
                question: "What should I pack for a night in the desert?",
                answer:
                    "A warm layer regardless of season — the temperature drop after sunset surprises people. Also a scarf for wind-blown sand, closed shoes for the dunes, a torch, and a small overnight bag, since your main luggage stays in the vehicle rather than going on the camel.",
            },
            {
                question: "Is a camel trek required to reach the camp?",
                answer:
                    "No. Camps can be reached by 4x4 if you would rather not ride, or if mobility or back problems make the trek uncomfortable. Just tell us in advance and we arrange the transfer instead.",
            },
        ],
        circuitKeywords: ["sahara", "desert", "merzouga", "erg chebbi", "dunes"],
        image: "/sahara.webp",
    },
    {
        slug: "chefchaouen",
        name: "Chefchaouen",
        headline: "Chefchaouen Tours & Travel Guide — The Blue City",
        region: "Tanger-Tétouan-Al Hoceïma",
        type: "City",
        latitude: 35.1688,
        longitude: -5.2636,
        sameAs: ["https://en.wikipedia.org/wiki/Chefchaouen"],
        metaDescription:
            "Chefchaouen travel guide: why the blue city is painted, how to get there from Fes or Tangier, how long to stay, and tours that include it.",
        summary:
            "Chefchaouen is a small town in the Rif Mountains of northern Morocco, known for the blue-washed walls that cover most of its medina. It sits at about 600 metres altitude, is compact enough to walk end to end in an afternoon, and is usually visited as an overnight stop between Fes and Tangier rather than as a destination in itself.",
        body: [
            "The blue is the draw and the town knows it, but Chefchaouen is genuinely pleasant beyond the photographs. It is quieter and cooler than the imperial cities, the medina is small enough that getting lost is a pleasure rather than a problem, and vendors are noticeably less insistent than in Fes or Marrakech.",
            "Explanations for the colour vary — Jewish residents who settled here in the 1930s, a mosquito deterrent, a way to keep houses cool. No single account is settled, and locals will offer you all three. The walls are repainted regularly, which is why the blue always looks fresh.",
            "The best light is early morning, before the day-trip coaches arrive from Tangier and Fes around eleven. Staying overnight is what separates a rushed stop from a good one. Above the town, the Spanish Mosque is a twenty-minute uphill walk and gives the standard view over the blue rooftops at sunset.",
        ],
        highlights: [
            "The blue-painted medina and Place Outa el-Hammam",
            "The Kasbah and its gardens",
            "Sunset from the Spanish Mosque viewpoint",
            "Ras el-Maa waterfall at the edge of town",
            "Rif Mountain hiking and Akchour waterfalls nearby",
            "Local wool goods and goat cheese from the surrounding villages",
        ],
        bestTimeToVisit:
            "April to June and September to October. The altitude keeps summer bearable, but winter brings real rain to the Rif.",
        suggestedStay: "1 night",
        nearby: ["fes", "tangier", "meknes-volubilis"],
        faqs: [
            {
                question: "Is Chefchaouen worth visiting?",
                answer:
                    "Yes, if you have the days for it. It is a genuine change of pace from the imperial cities — smaller, cooler, calmer, and visually unlike anywhere else in Morocco. On a tight one-week itinerary it competes with the Sahara, and the desert usually wins.",
            },
            {
                question: "How do you get to Chefchaouen?",
                answer:
                    "By road only — there is no airport or train station. It is about four hours from Fes, two from Tangier and around two and a half from Tetouan. Our tours cover the leg by private vehicle with stops on the way.",
            },
            {
                question: "How long should you stay in Chefchaouen?",
                answer:
                    "One night is enough for the medina, the Kasbah and the Spanish Mosque viewpoint. Add a second if you want to hike to the Akchour waterfalls in the Rif.",
            },
        ],
        circuitKeywords: ["chefchaouen", "blue city", "rif", "north"],
        image: "/hero-bg.webp",
    },
    {
        slug: "atlas-mountains",
        name: "Atlas Mountains",
        headline: "High Atlas Mountains Tours & Berber Village Guide",
        region: "Marrakech-Safi / Drâa-Tafilalet",
        type: "Mountains",
        latitude: 31.0595,
        longitude: -7.9153,
        sameAs: [
            "https://en.wikipedia.org/wiki/Atlas_Mountains",
            "https://en.wikipedia.org/wiki/Toubkal",
        ],
        metaDescription:
            "High Atlas Mountains guide: Imlil, Toubkal, the Ourika Valley and Berber villages — day trips and multi-day tours from Marrakech.",
        summary:
            "The High Atlas runs south-west to north-east across Morocco and rises to Toubkal at 4,167 metres, the highest peak in North Africa. The range starts about an hour from Marrakech, which makes Berber villages, terraced valleys and serious mountain scenery an easy day trip — or the backbone of a multi-day trek.",
        body: [
            "Three areas take most visitors. Imlil, at 1,740 metres, is the trailhead for Toubkal and the base for village walks that need no technical skill. The Ourika Valley is closer to Marrakech, greener, and busy at weekends with Moroccan families. The Aït Bougmez valley, further east and much less visited, is the one to choose if you want walking days without other tour groups.",
            "The villages here are Amazigh (Berber), and the language on the street is Tashelhit rather than Arabic. Terraced fields of walnut and cherry climb the valley sides, and mud-brick houses are built into the slope. Guided village walks with tea in a family home are the standard half-day; they are worthwhile, and we work with the same households rather than rotating strangers.",
            "The Tizi n'Tichka pass, at 2,260 metres, is the road link between Marrakech and the south. Every desert circuit crosses it, so even travellers who have not planned mountain time end up seeing the High Atlas properly. The road is fully paved and, since the recent widening works, straightforward.",
        ],
        highlights: [
            "Imlil village and the trail towards Mount Toubkal",
            "Ourika Valley and the Setti Fatma waterfalls",
            "Tizi n'Tichka pass, 2,260 m, on the road south",
            "Amazigh village walks and lunch in a family home",
            "Aït Bougmez, the 'happy valley', for quieter trekking",
            "Argan cooperatives and walnut terraces",
        ],
        bestTimeToVisit:
            "April to October for walking and trekking. Snow closes the higher passes and Toubkal routes from roughly December to March, when winter kit becomes necessary.",
        suggestedStay: "1 day trip, or 2–4 days for trekking",
        nearby: ["marrakech", "ouarzazate-ait-benhaddou", "dades-todra-gorges"],
        faqs: [
            {
                question: "Can you visit the Atlas Mountains as a day trip from Marrakech?",
                answer:
                    "Easily. Imlil and the Ourika Valley are both about an hour and a half from the city, which leaves plenty of time for a village walk, lunch and a return the same evening. Reaching Toubkal's summit needs at least two days.",
            },
            {
                question: "Do you need to be fit to hike in the High Atlas?",
                answer:
                    "For village walks and valley trails, no — they are gentle and can be shortened at any point. Climbing Toubkal is a different matter: two long days with real altitude, best attempted with some hill-walking experience behind you.",
            },
            {
                question: "Is the road over the Tizi n'Tichka pass difficult?",
                answer:
                    "It is paved throughout and in good condition after the widening works, but it is a mountain road with sustained switchbacks. Passengers prone to motion sickness should take something beforehand. In winter, snow can close it briefly, and we reroute when it does.",
            },
        ],
        circuitKeywords: ["atlas", "mountain", "imlil", "toubkal", "ourika", "trek"],
        image: "/hero-bg.webp",
    },
    {
        slug: "ouarzazate-ait-benhaddou",
        name: "Ouarzazate & Aït Benhaddou",
        headline: "Ouarzazate & Aït Benhaddou Tours — Morocco's Film Country",
        region: "Drâa-Tafilalet",
        type: "Valley",
        latitude: 30.9335,
        longitude: -6.9370,
        sameAs: [
            "https://en.wikipedia.org/wiki/Ouarzazate",
            "https://en.wikipedia.org/wiki/A%C3%AFt_Benhaddou",
        ],
        metaDescription:
            "Ouarzazate and Aït Benhaddou guide: the UNESCO ksar, Atlas Film Studios, Kasbah Taourirt and where they fit in a Morocco itinerary.",
        summary:
            "Ouarzazate sits just south of the High Atlas and functions as the gateway to the desert and the Draa Valley. Thirty kilometres away, Aït Benhaddou is a fortified earthen ksar and UNESCO World Heritage site, familiar from Gladiator, Lawrence of Arabia and Game of Thrones. Both are standard stops on the drive between Marrakech and Merzouga.",
        body: [
            "Aït Benhaddou is the reason to stop. The ksar is a cluster of earthen kasbahs stacked up a hillside above the Ounila River, built from rammed earth and straw and continuously repaired for centuries. A handful of families still live inside; the rest is preserved as a monument. Crossing the riverbed and climbing to the granary at the top takes about an hour and gives the view back over the Ounila valley.",
            "Ouarzazate itself is a working town rather than a sight. Atlas Film Studios and CLA Studios are here — Morocco's film industry is genuinely centred on this stretch of desert — and Kasbah Taourirt, once a Glaoui stronghold, is worth thirty minutes. Most travellers eat lunch, look at one of the two, and continue.",
            "The town is the junction for two different southern routes: south-east through Skoura and the Dades Valley towards Merzouga, or south-west down the Draa Valley past Agdz towards Zagora and Erg Chigaga. Which one you take is effectively the decision about which desert you are visiting.",
        ],
        highlights: [
            "Aït Benhaddou ksar, UNESCO World Heritage site",
            "Atlas Film Studios and the standing film sets",
            "Kasbah Taourirt in central Ouarzazate",
            "Skoura palm oasis and Kasbah Amridil",
            "The Noor solar complex, among the largest in the world",
            "Gateway to both the Dades and Draa valleys",
        ],
        bestTimeToVisit:
            "October to April. The pre-Saharan plateau gets very hot from June to August, with little shade at the ksar.",
        suggestedStay: "Half day, or 1 night as a stopover",
        nearby: ["sahara-desert-merzouga", "dades-todra-gorges", "marrakech"],
        faqs: [
            {
                question: "Is Aït Benhaddou worth stopping for?",
                answer:
                    "Yes — it is the most complete example of southern Moroccan earthen architecture still standing, and it sits directly on the Marrakech–desert road, so it costs you an hour or two rather than a detour.",
            },
            {
                question: "How far is Ouarzazate from Marrakech?",
                answer:
                    "About 200 km over the Tizi n'Tichka pass, which takes four hours allowing for the mountain road and photo stops. It is the natural lunch point on day one of a desert circuit.",
            },
            {
                question: "Should you stay overnight in Ouarzazate?",
                answer:
                    "Only if you are breaking a long drive. Most of our itineraries push on to Dades or Skoura for the night, which are more attractive places to wake up, and see Aït Benhaddou in the afternoon on the way through.",
            },
        ],
        circuitKeywords: ["ouarzazate", "ait benhaddou", "aït benhaddou", "kasbah", "draa"],
        image: "/hero-bg.webp",
    },
    {
        slug: "dades-todra-gorges",
        name: "Dades & Todra Gorges",
        headline: "Dades Valley & Todra Gorge Tours — The Road of a Thousand Kasbahs",
        region: "Drâa-Tafilalet",
        type: "Valley",
        latitude: 31.5900,
        longitude: -5.5900,
        sameAs: ["https://en.wikipedia.org/wiki/Todgha_Gorge"],
        metaDescription:
            "Dades Valley and Todra Gorge guide: canyon walls, kasbah routes, rock climbing and where the gorges fit on the road to the Sahara.",
        summary:
            "The Dades and Todra gorges cut north into the High Atlas from the Road of a Thousand Kasbahs, the route linking Ouarzazate to Merzouga. Todra's narrowest section runs between limestone walls up to 300 metres high and barely 10 metres apart. Both are standard overnight stops on the drive to the Sahara.",
        body: [
            "Todra is the more dramatic of the two. A road and a shallow river share the canyon floor where it narrows, and the scale is immediate — you drive in and the sky becomes a strip. It is one of Morocco's established rock-climbing venues, with several hundred bolted routes on the walls.",
            "Dades is the wider, greener valley, lined with old kasbahs and cultivated terraces. Its signature feature is the hairpin road climbing out of the valley head — a sequence of tight switchbacks stacked up the cliff face that appears in most photographs of the area. The rock formations locally called 'monkey fingers' sit lower down the same valley.",
            "Breaking the Marrakech–Merzouga drive here is what turns a punishing transit into a proper day. Guesthouses in both valleys are simple but well run, and evenings are quiet in a way the cities are not.",
        ],
        highlights: [
            "Todra Gorge's 300-metre canyon narrows",
            "The Dades hairpin switchbacks",
            "'Monkey fingers' rock formations",
            "Rose Valley and Kelaat M'Gouna, harvested each May",
            "Skoura and Kasbah Amridil on the same route",
            "Rock climbing and short canyon walks",
        ],
        bestTimeToVisit:
            "March to May and September to November. Spring brings meltwater to the rivers and the rose harvest to Kelaat M'Gouna.",
        suggestedStay: "1 night",
        nearby: ["sahara-desert-merzouga", "ouarzazate-ait-benhaddou", "atlas-mountains"],
        faqs: [
            {
                question: "Should you stay in Dades or Todra?",
                answer:
                    "Either works as the overnight between Ouarzazate and Merzouga. Dades has the better sunset and the famous switchbacks; Todra puts you at the canyon mouth for an early morning walk before the coaches. We usually suggest Dades northbound and Todra southbound.",
            },
            {
                question: "What is the Road of a Thousand Kasbahs?",
                answer:
                    "The route running east from Ouarzazate through Skoura, Kelaat M'Gouna, Boumalne Dades and Tinghir towards the desert, named for the fortified earthen kasbahs strung along it. It is the road every Marrakech-to-Merzouga tour follows.",
            },
            {
                question: "Can you walk in the gorges without a guide?",
                answer:
                    "Yes. The canyon floor at Todra is flat and obvious, and the palm-grove paths in Dades are easy to follow. A guide is only needed for the longer routes climbing out of the valleys onto the plateau.",
            },
        ],
        circuitKeywords: ["dades", "todra", "todgha", "gorge", "kasbah"],
        image: "/hero-bg.webp",
    },
    {
        slug: "essaouira",
        name: "Essaouira",
        headline: "Essaouira Tours & Travel Guide — Morocco's Atlantic Port",
        region: "Marrakech-Safi",
        type: "Coast",
        latitude: 31.5085,
        longitude: -9.7595,
        sameAs: ["https://en.wikipedia.org/wiki/Essaouira"],
        metaDescription:
            "Essaouira travel guide: the fortified medina, the fishing port, wind sports and easy day trips from Marrakech to the Atlantic coast.",
        summary:
            "Essaouira is a fortified port on Morocco's Atlantic coast, two and a half hours west of Marrakech. Its 18th-century medina is a UNESCO World Heritage site, laid out on a regular grid rather than the usual maze, and the constant Atlantic wind has made it a well-known kitesurfing and windsurfing spot. Most visitors come as a day trip or stay one or two nights.",
        body: [
            "The town is noticeably easier than Marrakech. Streets are straight and wide, the sea air keeps the temperature down even in August, and the pace is slower. The ramparts along the Skala de la Ville look straight out over the Atlantic, and the working fishing port still lands its catch each morning, sold and grilled at the stalls beside the harbour.",
            "Essaouira has a long association with music — the Gnaoua World Music Festival each June draws large crowds — and with woodwork, particularly thuya, the burled cedar carved in workshops throughout the medina.",
            "The wide beach south of town is where the wind sports happen. It is exposed and consistently breezy, which is ideal with a kite and less so if you wanted a still afternoon of sunbathing; Agadir or Taghazout are calmer for that.",
        ],
        highlights: [
            "The fortified medina, a UNESCO World Heritage site",
            "Skala de la Ville ramparts and cannon batteries",
            "The working fishing port and harbour grills",
            "Kitesurfing and windsurfing on the main beach",
            "Thuya woodwork and argan oil cooperatives",
            "Gnaoua World Music Festival each June",
        ],
        bestTimeToVisit:
            "April to October. Essaouira stays mild year-round, but the wind is strongest in summer — excellent for sports, less so for a still beach day.",
        suggestedStay: "1–2 days",
        nearby: ["marrakech", "casablanca", "agadir"],
        faqs: [
            {
                question: "Is Essaouira a good day trip from Marrakech?",
                answer:
                    "It works, and many people do it — two and a half hours each way with argan cooperative stops on the road. But it makes for a long day, and Essaouira is a town that rewards an unhurried evening. One overnight is a much better trade.",
            },
            {
                question: "Is Essaouira good for swimming?",
                answer:
                    "The Atlantic here is cool and often choppy, and the wind that makes it a kitesurfing destination works against lazy beach days. If swimming is a priority, the sheltered coast around Agadir suits better.",
            },
            {
                question: "How do you get from Marrakech to Essaouira?",
                answer:
                    "By road, about 175 km on a good route across the Haouz plain. Our transfers are private, which lets you stop at the argan oil cooperatives and the goats-in-trees stretch without waiting on a coach schedule.",
            },
        ],
        circuitKeywords: ["essaouira", "coast", "atlantic", "mogador"],
        image: "/hero-bg.webp",
    },
    {
        slug: "casablanca",
        name: "Casablanca",
        headline: "Casablanca Tours & Travel Guide",
        region: "Casablanca-Settat",
        type: "City",
        latitude: 33.5731,
        longitude: -7.5898,
        sameAs: ["https://en.wikipedia.org/wiki/Casablanca"],
        metaDescription:
            "Casablanca travel guide: the Hassan II Mosque, art deco downtown, and how the country's largest city fits into a Morocco tour.",
        summary:
            "Casablanca is Morocco's largest city, its economic centre, and the site of Mohammed V International Airport — the country's main international gateway. The Hassan II Mosque, built partly over the Atlantic with a 210-metre minaret, is the principal sight and one of the few working mosques in Morocco that non-Muslims may enter. Most itineraries allow half a day.",
        body: [
            "Casablanca is a modern commercial city rather than a historic one, and travellers arriving with imperial-city expectations are sometimes caught out. Its appeal is different: Mauresque art deco architecture from the protectorate era around Place Mohammed V, a long corniche, and a food scene that is the best in the country.",
            "The Hassan II Mosque justifies the stop on its own. Completed in 1993, it holds 25,000 worshippers inside and 80,000 more on the surrounding plaza, and the guided tours run several times daily in multiple languages. The prayer hall's retractable roof and glass floor over the water are the details people remember.",
            "For most visitors Casablanca is an arrival or departure point. Landing here and driving straight to Rabat, Fes or Marrakech is entirely reasonable — but the mosque tour fits comfortably into the gap before a late flight home.",
        ],
        highlights: [
            "Hassan II Mosque, open to non-Muslim visitors on guided tours",
            "Art deco and Mauresque architecture downtown",
            "Place Mohammed V and the Habous quarter",
            "The corniche at Aïn Diab",
            "Morocco's main international airport",
            "The strongest restaurant scene in the country",
        ],
        bestTimeToVisit:
            "Year-round. Atlantic weather keeps the city mild and free of the extremes found inland.",
        suggestedStay: "Half day to 1 day",
        nearby: ["rabat", "marrakech", "essaouira"],
        faqs: [
            {
                question: "Is Casablanca worth visiting?",
                answer:
                    "For half a day, yes — chiefly for the Hassan II Mosque, which is exceptional. As a multi-day destination it does not compete with Fes or Marrakech, and we generally build it in as an arrival or departure stop.",
            },
            {
                question: "Can non-Muslims enter the Hassan II Mosque?",
                answer:
                    "Yes. It is one of the very few mosques in Morocco open to non-Muslim visitors, on guided tours that run several times a day in English, French, Spanish and Arabic. Modest dress is required and shoes come off at the door.",
            },
            {
                question: "How far is Casablanca from Marrakech?",
                answer:
                    "About 240 km. The train takes roughly three hours and the drive a little over three; our tours cover it by private vehicle so you can stop in Rabat or El Jadida on the way.",
            },
        ],
        circuitKeywords: ["casablanca", "casa"],
        image: "/hero-bg.webp",
    },
    {
        slug: "rabat",
        name: "Rabat",
        headline: "Rabat Tours & Travel Guide — Morocco's Capital",
        region: "Rabat-Salé-Kénitra",
        type: "City",
        latitude: 34.0209,
        longitude: -6.8416,
        sameAs: ["https://en.wikipedia.org/wiki/Rabat"],
        metaDescription:
            "Rabat travel guide: the Kasbah of the Udayas, Hassan Tower, Chellah and how Morocco's calm capital fits an imperial cities tour.",
        summary:
            "Rabat is Morocco's capital and the calmest of its four imperial cities. Its historic core — the Kasbah of the Udayas, the Hassan Tower, the Chellah necropolis and the Mohammed V Mausoleum — is a UNESCO World Heritage site, and the whole city can be seen comfortably in a day. It sits an hour north of Casablanca on the Atlantic.",
        body: [
            "The Kasbah of the Udayas is the highlight: a 12th-century fortified quarter above the mouth of the Bou Regreg, with blue-and-white lanes and an Andalusian garden. It is small, quiet and free to walk through, and the terrace at the far end looks across the river to Salé.",
            "The Hassan Tower is the unfinished minaret of a 12th-century mosque abandoned at the death of Yacoub al-Mansour — the surrounding field of truncated columns marks where the prayer hall was to stand. The Mohammed V Mausoleum faces it across the plaza. Chellah, a little south, layers a medieval Muslim necropolis directly onto the Roman town of Sala Colonia, with storks nesting on the ruins.",
            "Rabat is a working administrative capital, so it lacks the pressure of Marrakech or Fes entirely — no persistent hawking, wide boulevards, a tram. It fits naturally into a northern circuit between Casablanca and Fes or Chefchaouen.",
        ],
        highlights: [
            "Kasbah of the Udayas and its Andalusian garden",
            "Hassan Tower and the Mohammed V Mausoleum",
            "Chellah — Roman ruins and a Merinid necropolis",
            "The Royal Palace and the Mohammed VI Museum of Modern Art",
            "Bou Regreg riverfront and Salé across the water",
            "Calmest of the four imperial cities",
        ],
        bestTimeToVisit:
            "Year-round; April to June and September to October are the most pleasant. The Atlantic keeps summers moderate.",
        suggestedStay: "1 day",
        nearby: ["casablanca", "meknes-volubilis", "fes"],
        faqs: [
            {
                question: "Is Rabat worth a stop?",
                answer:
                    "On a northern circuit, yes. Its historic sites are genuinely good and the city is relaxed in a way Fes and Marrakech are not. On a one-week trip focused on the desert and Marrakech, it is usually the first thing to drop.",
            },
            {
                question: "How long do you need in Rabat?",
                answer:
                    "One full day covers the Kasbah of the Udayas, Hassan Tower, the mausoleum and Chellah without rushing. Half a day works if you skip Chellah.",
            },
            {
                question: "What are Morocco's four imperial cities?",
                answer:
                    "Marrakech, Fes, Meknes and Rabat — each served as a royal capital at some point in Moroccan history. Circuits described as 'imperial cities' tours cover all four, typically over eight to ten days.",
            },
        ],
        circuitKeywords: ["rabat", "imperial", "capital"],
        image: "/hero-bg.webp",
    },
    {
        slug: "meknes-volubilis",
        name: "Meknes & Volubilis",
        headline: "Meknes & Volubilis Tours — Imperial City and Roman Ruins",
        region: "Fès-Meknès",
        type: "City",
        latitude: 33.8935,
        longitude: -5.5473,
        sameAs: [
            "https://en.wikipedia.org/wiki/Meknes",
            "https://en.wikipedia.org/wiki/Volubilis",
        ],
        metaDescription:
            "Meknes and Volubilis guide: Bab Mansour, the imperial granaries, and Morocco's best-preserved Roman city — usually visited from Fes.",
        summary:
            "Meknes is the smallest and least crowded of Morocco's imperial cities, built up by Sultan Moulay Ismail in the 17th century and known for the monumental Bab Mansour gate and the vast Heri es-Souani granaries. Thirty kilometres north lie the ruins of Volubilis, the best-preserved Roman city in Morocco. Both are commonly done as a day trip from Fes.",
        body: [
            "Moulay Ismail intended Meknes as a Moroccan Versailles, and the scale of what he built shows it — kilometres of rampart, stables said to have held twelve thousand horses, and granaries with walls thick enough to keep grain cool through a Moroccan summer. Bab Mansour, facing Place el-Hedim, is generally considered the finest monumental gate in North Africa.",
            "Volubilis was the western administrative centre of Roman Mauretania Tingitana, and its mosaic floors have survived largely in place, still open to the sky where they were laid. The Capitol, basilica and triumphal arch of Caracalla are all standing, and the site is walkable in about ninety minutes. It became a UNESCO World Heritage site in 1997.",
            "Moulay Idriss Zerhoun, the whitewashed hill town between the two, holds the tomb of the founder of Morocco's first Islamic dynasty and is among the country's most important pilgrimage sites. Pairing all three makes a full and well-balanced day out of Fes.",
        ],
        highlights: [
            "Bab Mansour, the monumental gate at Place el-Hedim",
            "Heri es-Souani granaries and royal stables",
            "Volubilis — Roman mosaics, basilica and triumphal arch",
            "Moulay Idriss Zerhoun hill town",
            "Mausoleum of Moulay Ismail",
            "Quieter and cheaper than Fes or Marrakech",
        ],
        bestTimeToVisit:
            "March to May and September to November. Volubilis is an open site with almost no shade, which makes midsummer midday visits punishing.",
        suggestedStay: "1 day trip from Fes",
        nearby: ["fes", "rabat", "chefchaouen"],
        faqs: [
            {
                question: "Can you visit Volubilis and Meknes in one day?",
                answer:
                    "Yes, comfortably, and it is the standard way to do it from Fes — roughly an hour's drive each way, with Moulay Idriss added between the two if the timing allows.",
            },
            {
                question: "Is Volubilis worth visiting?",
                answer:
                    "If Roman archaeology interests you at all, yes — the mosaics are in situ and remarkably intact, and the setting below the Zerhoun hills is beautiful. Travellers with no particular interest in ruins sometimes find ninety minutes enough.",
            },
            {
                question: "Is Meknes better than Fes?",
                answer:
                    "Not better, but easier. Meknes has grander individual monuments and far fewer visitors; Fes has the more extraordinary medina. Meknes is a day, Fes is two.",
            },
        ],
        circuitKeywords: ["meknes", "volubilis", "imperial", "roman"],
        image: "/hero-bg.webp",
    },
    {
        slug: "tangier",
        name: "Tangier",
        headline: "Tangier Tours & Travel Guide",
        region: "Tanger-Tétouan-Al Hoceïma",
        type: "Coast",
        latitude: 35.7595,
        longitude: -5.8340,
        sameAs: ["https://en.wikipedia.org/wiki/Tangier"],
        metaDescription:
            "Tangier travel guide: the kasbah, Cap Spartel, the Caves of Hercules, and Morocco's northern gateway from Spain.",
        summary:
            "Tangier sits at the Strait of Gibraltar where the Mediterranean meets the Atlantic, with Spain visible across the water on a clear day. It is the arrival point for ferries from Tarifa and Algeciras and the northern terminus of Morocco's high-speed rail line. The kasbah, the Caves of Hercules and Cap Spartel are the main sights, and a day or two is typical.",
        body: [
            "Tangier spent decades as an International Zone administered jointly by several foreign powers, and that history still marks it — a mixed architectural record, a literary reputation built by Bowles, Burroughs and the Beats, and an outlook that faces Europe as much as Africa. Substantial redevelopment of the port and corniche over the last decade has changed the city considerably.",
            "The kasbah occupies the high ground above the medina, and the Kasbah Museum in the former sultan's palace covers the region from prehistory onward. Below it the medina drops towards the Petit Socco, smaller and more manageable than the medinas of Fes or Marrakech.",
            "Cap Spartel, where the two seas meet at the north-west corner of Africa, is fifteen kilometres out of town, with the Caves of Hercules just beside it — a sea cave whose opening, worn into the shape of the African continent, is the most photographed thing in the region.",
        ],
        highlights: [
            "The kasbah and the Kasbah Museum",
            "Caves of Hercules and Cap Spartel lighthouse",
            "Where the Mediterranean meets the Atlantic",
            "Café Hafa, overlooking the strait since 1921",
            "Ferry connections to Spain",
            "Al Boraq high-speed rail to Casablanca",
        ],
        bestTimeToVisit:
            "April to October. Northern Morocco stays mild but sees real Mediterranean rain from November through February.",
        suggestedStay: "1–2 days",
        nearby: ["chefchaouen", "fes", "rabat"],
        faqs: [
            {
                question: "Is Tangier a good place to start a Morocco tour?",
                answer:
                    "It is, particularly if you are arriving by ferry from Spain or flying into the north. From Tangier a natural route runs south through Chefchaouen to Fes, then on to the desert and Marrakech.",
            },
            {
                question: "How far is Tangier from Chefchaouen?",
                answer:
                    "About 115 km, or two hours by road through the Rif foothills. It is the shortest hop on most northern circuits.",
            },
            {
                question: "Can you take a day trip to Spain from Tangier?",
                answer:
                    "Yes — fast ferries reach Tarifa in about an hour. Bear in mind you are crossing an international border, so check visa requirements for your nationality before planning it.",
            },
        ],
        circuitKeywords: ["tangier", "tanger", "north", "strait"],
        image: "/hero-bg.webp",
    },
]

/** Fast lookup by slug. */
export function getDestination(slug: string): Destination | undefined {
    return DESTINATIONS.find((d) => d.slug === slug)
}

export function getDestinationSlugs(): string[] {
    return DESTINATIONS.map((d) => d.slug)
}

interface MatchableCircuit {
    name: string
    category: string
    tagline?: string | null
    description?: string
    itineraryGlance?: string[]
}

/**
 * Scores a circuit against a destination's keywords. Name and category matches
 * count double so a "Sahara Desert Adventure" outranks a circuit that merely
 * passes through Merzouga on day six.
 */
export function scoreCircuitForDestination(
    circuit: MatchableCircuit,
    destination: Destination,
): number {
    const strong = `${circuit.name} ${circuit.category}`.toLowerCase()
    const weak = `${circuit.tagline ?? ""} ${circuit.description ?? ""} ${(
        circuit.itineraryGlance ?? []
    ).join(" ")}`.toLowerCase()

    let score = 0
    for (const keyword of destination.circuitKeywords) {
        const needle = keyword.toLowerCase()
        if (strong.includes(needle)) score += 2
        else if (weak.includes(needle)) score += 1
    }
    return score
}
