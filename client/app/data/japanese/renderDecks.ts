// -Path: 'client/app/data/japanese/renderDecks.ts'
import type { RenderDeck } from '~/types/render';

/**
 * Built-in reading decks.
 *
 * Mock content: each deck groups passages by grammar focus rather than by
 * topic, and references them by id so passage text stays in renderPassages.ts
 * (the single source of truth) while decks only describe grouping.
 *
 * Deck ids are stable ("render-daily", ...) and appear under
 * /japanese/render/:deck-id.
 */
export const DEFAULT_RENDER_DECKS: RenderDeck[] = [
    {
        id: 'render-daily',
        name: 'Daily Life',
        description: 'Short everyday scenes — stations, shops, and the weather.',
        source: 'default',
        focus: '〜ます / 〜です',
        tags: ['daily'],
        nsfw: false,
        passageIds: ['p-station', 'p-shop', 'p-weather'],
    },
    {
        id: 'render-numbers',
        name: 'Numbers & Prices',
        description: 'Counting, prices, and asking about cost.',
        source: 'default',
        focus: 'counters',
        tags: ['numbers'],
        nsfw: false,
        passageIds: ['p-shop'],
    },
];
