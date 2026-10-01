// Human-readable age of an ISO timestamp, e.g. "3 days ago".
//
// Deck meta carries machine timestamps but the UI wants "yesterday", so this
// leans on `Intl.RelativeTimeFormat` rather than a date library: it already
// knows the language's phrasing and needs no dependency or plural-key wiring.
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/** Largest unit a value is expressed in, so "45 minutes" never reads as
 *  "0 hours". */
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', YEAR],
    ['month', MONTH],
    ['week', WEEK],
    ['day', DAY],
    ['hour', HOUR],
    ['minute', MINUTE],
];

/**
 * Formats `iso` as a relative age in the given language, falling back to an
 * absolute date for anything that is not a parseable timestamp or that lands
 * more than a year either side of now.
 *
 * @param iso ISO-8601 timestamp, e.g. `DeckMeta.updatedAt`.
 * @param locale BCP-47 tag, normally `i18n.language`.
 * @param now Injectable for tests; defaults to the current time.
 */
export function formatRelativeTime(iso: string, locale: string, now: Date = new Date()): string {
    const then = new Date(iso);
    if (Number.isNaN(then.getTime())) return iso;

    const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const seconds = (then.getTime() - now.getTime()) / 1000;
    const magnitude = Math.abs(seconds);

    for (const [unit, unitSeconds] of UNITS) {
        if (magnitude >= unitSeconds) {
            return formatter.format(Math.round(seconds / unitSeconds), unit);
        }
    }
    return formatter.format(0, 'minute');
}
