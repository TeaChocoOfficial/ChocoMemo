// -Path: 'client/app/utils/edit/deckForm.ts'
import { INITIAL_VERSION } from '~/utils/deck/deckMeta';
import { LOCKED_DECK_SOURCES } from '~/constants/deckList';
import { parseIds, parseTags, readLangText, writeLangText } from './edit';
import type { CreateDeckData, DeckType, Version, DeckMeta, DeckData } from '~/types/deck';
import type { DeckFormValues } from '~/types/edit';

/** The deck body a form submit writes, normalized for the store. */
export type DeckFormPatch = Pick<
    CreateDeckData,
    'name' | 'index' | 'tags' | 'image' | 'type' | 'nsfw' | 'source' | 'contentIds' | 'description'
>;

/** What a draft falls back to when the deck does not exist yet. */
interface DraftDefaults {
    /** Type to start as, mirroring the explorer's active filter. */
    type: DeckType;
    /** Order to start at, so a new deck lands after the existing ones. */
    index: number;
}

/**
 * Whether the viewer may change the deck. A draft (null) is always editable;
 * official and community decks belong to someone else, so the form only reads
 * them.
 *
 * @param deck - The deck being edited, or null for a draft.
 * @returns True when the form may be submitted.
 */
export function isDeckEditable(deck: Pick<DeckData, 'source'> | null): boolean {
    return !deck || !LOCKED_DECK_SOURCES.includes(deck.source);
}

/** The shape the deck model accepts for a version, `x.y.z`. */
const VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

/**
 * Form values for the deck being edited, or the blanks of a new one.
 *
 * @param deck - The deck to read, or null when drafting.
 * @param language - i18n language whose text slot is read.
 * @param draft - Type and order a new deck starts with.
 * @returns Every field of the form, filled or blank.
 */
export function readDeckFormValues(
    deck: DeckData | null,
    language: string,
    draft: DraftDefaults,
): DeckFormValues {
    const meta = deck?.meta;
    return {
        tags: (deck?.tags ?? []).join(', '),
        name: readLangText(deck?.name, language),
        index: String(deck?.index ?? draft.index),
        image: deck?.image ?? '',
        nsfw: deck?.nsfw ?? false,
        version: meta?.version ?? INITIAL_VERSION,
        type: deck?.type ?? draft.type,
        source: deck?.source ?? 'local',
        allowFork: meta?.allowFork ?? false,
        contentIds: (deck?.contentIds ?? []).join(', '),
        visibility: meta?.visibility ?? 'private',
        description: readLangText(deck?.description, language),
    };
}

/**
 * Maps form values onto the deck body a submit writes. An existing deck's name
 * and description are merged into the current locale slot instead of being
 * replaced, so the other translations survive the edit; a draft keeps plain
 * strings. Blank optional text is dropped rather than stored as empty, and a
 * non-numeric order falls back to the deck's current one.
 *
 * @param values - The form's current values.
 * @param deck - The deck being edited, or null for a draft.
 * @param language - i18n language whose text slot is written.
 * @returns The patch to create or update the deck with.
 */
export function toDeckPatch(
    values: DeckFormValues,
    deck: DeckData | null,
    language: string,
): DeckFormPatch {
    const name = values.name.trim();
    const description = values.description.trim();
    const index = Number.parseInt(values.index, 10);
    return {
        tags: parseTags(values.tags),
        nsfw: values.nsfw,
        type: values.type,
        source: values.source,
        index: Number.isNaN(index) ? (deck?.index ?? 0) : index,
        contentIds: parseIds(values.contentIds),
        image: values.image.trim() || undefined,
        name: deck ? writeLangText(deck.name, language, name) : name,
        description: description
            ? deck
                ? writeLangText(deck.description, language, description)
                : description
            : undefined,
    };
}

/**
 * Maps the three meta rows onto a meta patch. A version draft that is not
 * `x.y.z` keeps the deck's current version instead of wiping it with a typo.
 *
 * @param values - The form's current values.
 * @param current - Meta of the deck being edited, if it already exists.
 * @returns The meta fields to write, ready to spread over the stored meta.
 */
export function toDeckMeta(values: DeckFormValues, current?: DeckMeta): Partial<DeckMeta> {
    const text = values.version.trim();
    const version = VERSION_PATTERN.test(text) ? (text as Version) : current?.version;
    return {
        allowFork: values.allowFork,
        visibility: values.visibility,
        ...(version ? { version } : {}),
    };
}
