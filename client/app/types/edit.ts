// -Path: 'client/app/types/edit.ts'
import type { IconType } from 'react-icons';
import type { DeckVisibility, CreateDeckData } from './deck';

/** Every deck property the form edits, straight off the deck model. `id`,
 *  `meta`, `origin` and `targetInfo` are not here: the store owns the first
 *  two, and the last two are download/language bookkeeping. */
type DeckFormKey = keyof Pick<
    CreateDeckData,
    'name' | 'type' | 'tags' | 'image' | 'index' | 'nsfw' | 'source' | 'contentIds' | 'description'
>;

/** Editor shape of one deck property: text, the comma-separated drafts and the
 *  order all bind to a string input, while enums and flags keep the model's
 *  own type. */
type DeckFormValue<Key extends DeckFormKey> = Key extends 'type' | 'nsfw' | 'source'
    ? CreateDeckData[Key]
    : string;

/** Everything the deck form holds, derived from `CreateDeckData` so the form
 *  cannot drift from the deck model. The three meta rows are the addition: they
 *  live on `meta`, which the store stamps with defaults. */
export type DeckFormValues = {
    [Key in DeckFormKey]: DeckFormValue<Key>;
} & {
    version: string;
    allowFork: boolean;
    visibility: DeckVisibility;
};

/** The control a form field renders as. */
export type DeckFieldKind = 'text' | 'textarea' | 'switch' | 'select';

/** One choice of a `select` field, labelled through an i18n key. */
export interface DeckFieldOption {
    value: string;
    icon: IconType;
    labelKey: string;
}

/** One row of the deck form: which value it edits, how, and how it is labelled. */
export interface DeckFieldDef {
    kind: DeckFieldKind;
    key: keyof DeckFormValues;
    labelKey: string;
    rows?: number;
    /** Glyph shown before the label, so a long form stays scannable. */
    icon?: IconType;
    /** Input flavour for a `text` field (e.g. a numeric order). */
    inputType?: 'text' | 'number';
    placeholderKey?: string;
    /** Choices for a `select` field, in display order. */
    options?: DeckFieldOption[];
}
