// -Path: "src/api/deck/validators/lang-text.validator.ts"
import { Transform } from 'class-transformer';
import type { ValidationOptions, ValidationArguments } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { isValidObjectId } from 'mongoose';

/** Caps, so one deck cannot carry a megabyte of title. Generous enough for a
 *  paragraph per language across eighteen locales. */
const MAX_LANGUAGES = 20;
const MAX_VALUE_LENGTH = 2000;

/** One bare string is a legitimate title; wrap it so the stored shape is
 *  always a map and search has one place to read. `en` is the client's
 *  fallback locale, so that is where an untagged string belongs. */
const DEFAULT_LANGUAGE = 'en';

const isPlainStringMap = (value: unknown): value is Record<string, string> => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
    return Object.values(value as Record<string, unknown>).every(
        (entry: unknown): boolean => typeof entry === 'string' && entry.length <= MAX_VALUE_LENGTH,
    );
};

/**
 * Accepts a string or a map of language code to string, and normalises it to a
 * map. Needed because `class-validator` has no built-in "A or B" decorator, and
 * a deck's name is legitimately either.
 */
export function IsLangText(options?: ValidationOptions) {
    const validate = (value: unknown) => {
        if (typeof value === 'string') {
            return value.length > 0 && value.length <= MAX_VALUE_LENGTH;
        }
        if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
        const entries = Object.entries(value as Record<string, unknown>);
        if (entries.length === 0 || entries.length > MAX_LANGUAGES) return false;
        return isPlainStringMap(value);
    };

    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isLangText',
            target: object.constructor,
            propertyName: propertyName,
            options,
            validator: {
                validate,
                defaultMessage: (args?: ValidationArguments) =>
                    `${args?.property ?? 'value'} must be a string, or a map of at most ${MAX_LANGUAGES} language codes to strings of at most ${MAX_VALUE_LENGTH} characters`,
            },
        });
    };
}

/** Normalises a bare string to `{ en: value }`. Pair it with `@IsLangText()`,
 *  which has already checked the value is one of the two accepted shapes. */
export const NormalizeLangText = () =>
    Transform(({ value }: { value: unknown }) => {
        if (typeof value === 'string') return { [DEFAULT_LANGUAGE]: value };
        return value;
    });

/** The same, for an array of them — an exam question's options. */
export const NormalizeLangTextArray = () =>
    Transform(({ value }: { value: unknown }) => {
        if (!Array.isArray(value)) return value;
        return value.map((entry: unknown) =>
            typeof entry === 'string' ? { [DEFAULT_LANGUAGE]: entry } : entry,
        );
    });

/** A deck id: a Mongo ObjectId for a published deck. Bundled ids like
 *  `deck-nature` are rejected on purpose — those decks have no row here. */
export const IsDeckId = (options?: ValidationOptions) => (object: object, propertyName: string) =>
    registerDecorator({
        name: 'isDeckId',
        target: object.constructor,
        propertyName,
        options,
        validator: {
            validate: (value: unknown) => typeof value === 'string' && isValidObjectId(value),
            defaultMessage: (args?: ValidationArguments) =>
                `${args?.property ?? 'value'} must be a deck id`,
        },
    });
