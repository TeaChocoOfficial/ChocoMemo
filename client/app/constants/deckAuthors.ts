// Ids of the two deck authors that are not people.
//
// A deck is stamped with whoever is signed in when it is created, so most
// authors are real users with a profile. These two are not: the app authors the
// decks that ship in the bundle, and a guest stands in for a deck created while
// signed out. Neither has a profile page, so the UI must not offer to navigate
// to one. Kept here rather than in `deckMeta.ts` so components can check without
// importing the store that module pulls in.
export const APP_AUTHOR_ID = 'chocomemo';
export const GUEST_AUTHOR_ID = 'guest';
