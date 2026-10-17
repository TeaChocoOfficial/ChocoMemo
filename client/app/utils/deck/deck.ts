// -Path: 'client/app/utils/deck.ts'
import { z } from 'zod';
import type { DeckData } from '~/types/deck';
import type { LangText } from '~/types/type';

// A name/description is either a plain string or a per-locale record,
// matching LangText used everywhere else in the app.
const langTextField = z.string().or(z.record(z.string(), z.string()));

/** Validates the shape of an imported deck file. Doesn't trust the file's
 *  own `id` / `source` / `type` — those are reassigned by the caller so an
 *  imported file can't silently overwrite an existing deck or declare itself
 *  as a type it isn't. Content ids must be given; whether they resolve to
 *  real words/passages is checked by the store.
 *
 *  The field is `wordIds` here, not `contentIds`, so exported `.json` files
 *  stay readable by older builds; the store maps it across. */
export const importedDeckSchema = z.object({
    name: langTextField,
    description: langTextField.optional(),
    wordIds: z.array(z.string()).min(1),
});

/** First non-empty localized string for filename slugs. */
function firstText(text: LangText): string {
    if (typeof text === 'string') return text;
    const value = Object.values(text).find((v) => v && v.trim().length > 0);
    return value ?? '';
}

/** Downloads a deck as a .json file that `importDeck` can read back. */
export function exportDeck(deck: DeckData) {
    const payload: { name: LangText; description?: LangText; wordIds: string[] } = {
        name: deck.name,
        description: deck.description,
        wordIds: deck.contentIds,
    };
    const slug = firstText(deck.name).replace(/\s+/g, '-').toLowerCase() || 'deck';
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.chocomemo-deck.json`;
    a.click();
    URL.revokeObjectURL(url);
}
