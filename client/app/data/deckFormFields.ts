// -Path: 'client/app/data/deckFormFields.ts'
import {
    FaTag,
    FaEye,
    FaLink,
    FaLock,
    FaGlobe,
    FaListUl,
    FaListOl,
    FaImage,
    FaShapes,
    FaHashtag,
    FaHeading,
    FaCodeFork,
    FaAlignLeft,
    FaDatabase,
    FaTriangleExclamation,
} from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import { DECK_TYPES, LOCKED_DECK_SOURCES } from '~/constants/deckList';
import type { DeckVisibility } from '~/types/deck';
import { DECK_SOURCE_SOURCES } from '~/utils/deck/deckListQuery';
import type { DeckFieldDef, DeckFieldOption } from '~/types/edit';
import { FILTER_ICONS, SOURCE_ICONS } from '~/constants/deckFilterIcons';

/** Deck types as select options; the picker never drifts from the type union. */
const TYPE_OPTIONS: DeckFieldOption[] = DECK_TYPES.map((value) => ({
    value,
    icon: FILTER_ICONS[value],
    labelKey: `deck.type.${value}`,
}));

/** Deck sources a deck may be filed under, in the tally's order. The locked
 *  ones are left out: the viewer cannot author or re-file a deck as theirs. */
const SOURCE_OPTIONS: DeckFieldOption[] = DECK_SOURCE_SOURCES.filter(
    (value) => !LOCKED_DECK_SOURCES.includes(value),
).map((value) => ({
    value,
    icon: SOURCE_ICONS[value],
    labelKey: `deck.source.${value}`,
}));

/** Glyph per visibility, so the choice reads before its label does. */
const VISIBILITY_ICONS: Record<DeckVisibility, IconType> = {
    public: FaGlobe,
    unlisted: FaLink,
    private: FaLock,
};

/** Visibility choices, private last because it is the safest default. */
const VISIBILITY_OPTIONS: DeckFieldOption[] = (['public', 'unlisted', 'private'] as const).map(
    (value) => ({
        value,
        icon: VISIBILITY_ICONS[value],
        labelKey: `deck.visibility.${value}`,
    }),
);

/**
 * The deck form, as data: every row the form renders, in display order. The
 * form is a loop over this list, so adding, removing or reordering a property
 * is an edit here rather than a change to `DeckEdit`'s JSX. `key` must exist in
 * `DeckFormValues` and `kind` must match that value's type.
 */
export const DECK_FORM_FIELDS: DeckFieldDef[] = [
    {
        icon: FaHeading,
        key: 'name',
        kind: 'text',
        labelKey: 'deck.edit.nameLabel',
        placeholderKey: 'deck.edit.namePlaceholder',
    },
    {
        icon: FaShapes,
        key: 'type',
        kind: 'select',
        labelKey: 'deck.edit.typeLabel',
        options: TYPE_OPTIONS,
    },
    {
        icon: FaDatabase,
        key: 'source',
        kind: 'select',
        labelKey: 'deck.edit.sourceLabel',
        options: SOURCE_OPTIONS,
    },
    {
        icon: FaImage,
        key: 'image',
        kind: 'text',
        labelKey: 'deck.edit.imageLabel',
        placeholderKey: 'deck.edit.imagePlaceholder',
    },
    {
        icon: FaAlignLeft,
        key: 'description',
        rows: 4,
        kind: 'textarea',
        labelKey: 'deck.edit.descriptionLabel',
        placeholderKey: 'deck.edit.descriptionPlaceholder',
    },
    {
        icon: FaTag,
        key: 'tags',
        kind: 'text',
        labelKey: 'deck.edit.tagsLabel',
        placeholderKey: 'deck.edit.tagsPlaceholder',
    },
    {
        icon: FaListUl,
        key: 'contentIds',
        kind: 'text',
        labelKey: 'deck.edit.contentIdsLabel',
        placeholderKey: 'deck.edit.contentIdsPlaceholder',
    },
    {
        icon: FaListOl,
        key: 'index',
        kind: 'text',
        inputType: 'number',
        labelKey: 'deck.edit.indexLabel',
    },
    {
        icon: FaHashtag,
        key: 'version',
        kind: 'text',
        labelKey: 'deck.edit.versionLabel',
        placeholderKey: 'deck.edit.versionPlaceholder',
    },
    {
        icon: FaEye,
        key: 'visibility',
        kind: 'select',
        labelKey: 'deck.edit.visibilityLabel',
        options: VISIBILITY_OPTIONS,
    },
    {
        icon: FaCodeFork,
        key: 'allowFork',
        kind: 'switch',
        labelKey: 'deck.edit.allowForkLabel',
    },
    {
        icon: FaTriangleExclamation,
        key: 'nsfw',
        kind: 'switch',
        labelKey: 'deck.edit.nsfwLabel',
    },
];
