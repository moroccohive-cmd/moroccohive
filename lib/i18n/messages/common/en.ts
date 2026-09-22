/**
 * Strings needed by client components anywhere on the site (header menus,
 * favourites, pagination…). Kept deliberately small: this is the only message
 * set that reaches the browser on every page. Page-specific copy lives in
 * ../en.ts and is passed down as props instead.
 */
export const common = {
    nav: {
        home: "Home",
        tripIdeas: "Trip Ideas",
        destinations: "Destinations",
        planTrip: "Plan Your Trip",
        blog: "Blog",
        reviews: "Guest Reviews",
        faq: "FAQ",
        about: "About",
        contact: "Contact",
    },
    menu: {
        open: "Open menu",
        close: "Close menu",
        startPlanning: "Start Planning",
        logIn: "Log In",
        logInAria: "Log in",
        openUserMenu: "Open user menu",
        profile: "Profile",
        favorites: "My Favorites",
        dashboard: "Admin Dashboard",
        signOut: "Sign Out",
    },
    language: {
        label: "Language",
        change: "Change language",
    },
    favorite: {
        add: "Add to favorites",
        remove: "Remove from favorites",
    },
    price: {
        perPerson: "/ person",
        from: "From",
    },
    pagination: {
        nav: "Blog pagination",
        previous: "Previous",
        next: "Next",
        previousAria: "Go to previous page",
        nextAria: "Go to next page",
        pageOf: "Page {current} of {total}",
    },
    whatsapp: "Contact us on WhatsApp",
}

export type CommonMessages = typeof common
