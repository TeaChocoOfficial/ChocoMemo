// Construction of `DeckData.meta` — the block saying who a deck belongs to,
// when it appeared, and whether anyone else may see it.
//
// Every deck carries meta, but the two kinds get it very differently: a deck
// created on-device is stamped from the session at the moment of creation,
// while a deck shipped inside the bundle is stamped once and never changes.
// Keeping both here means the persisted shape is decided in one place instead
// of being re-invented at every call site.
import { Role } from '~/types/auth';
import { useAuthStore } from '~/stores/config/auth.store';
import { APP_AUTHOR_ID, GUEST_AUTHOR_ID } from '~/constants/deckAuthors';
import type { DeckAuthor, DeckMeta } from '~/types/deck';

/** Deck content revision. Nothing bumps it yet, so everything starts here. */
const INITIAL_VERSION = '0.0.1';

/** When the bundled content landed, stamped onto every deck that ships in the
 *  app. Fixed rather than read from the clock: `app/data` is evaluated once on
 *  the server and again on the client, and a `new Date()` there would desync
 *  the two and trip hydration. */
export const BUNDLED_AT = '2026-09-30T00:00:00.000Z';

/** Author recorded for a deck created while signed out, so a guest deck still
 *  has a byline to show instead of an empty one. */
const GUEST_AUTHOR: DeckAuthor = {
    userId: GUEST_AUTHOR_ID,
    name: 'Guest',
    nameTag: GUEST_AUTHOR_ID,
    role: Role.USER,
};

/** Author of the decks that ship in the bundle. The app itself rather than a
 *  person, which is why it is not the guest stand-in. `avatar` points at the
 *  app logo so a bundled deck shows the mark instead of initials. */
const APP_AUTHOR: DeckAuthor = {
    userId: APP_AUTHOR_ID,
    name: 'ChocoMemo',
    nameTag: APP_AUTHOR_ID,
    avatar: '/logo.png',
    role: Role.ADMIN,
};

/** The signed-in user, narrowed to the fields a deck byline needs. */
function currentAuthor(): DeckAuthor {
    const user = useAuthStore.getState().user;
    if (!user) return GUEST_AUTHOR;
    return {
        userId: user.userId,
        name: user.name,
        nameTag: user.nameTag,
        avatar: user.avatar,
        role: user.role,
    };
}

/** Meta for a deck the user just created on their own device. Private by
 *  default: a local deck is not published anywhere until the user asks.
 *
 *  @param now Stamped as both `createdAt` and `updatedAt`. Overridable so the
 *  date module-level data declares can stay fixed. */
export function newDeckMeta(now: Date = new Date()): DeckMeta {
    const stamp = now.toISOString();
    return {
        author: currentAuthor(),
        createdAt: stamp,
        updatedAt: stamp,
        version: INITIAL_VERSION,
        visibility: 'private',
    };
}

/** Meta for a deck that ships in the bundle, stamped as released rather than
 *  created: the viewer did not make it and cannot edit it. */
export function shippedDeckMeta(): DeckMeta {
    return {
        author: APP_AUTHOR,
        createdAt: BUNDLED_AT,
        updatedAt: BUNDLED_AT,
        version: INITIAL_VERSION,
        visibility: 'public',
    };
}
