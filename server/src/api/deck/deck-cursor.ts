// -Path: 'src/api/deck/deck-cursor.ts'
// Opaque pagination cursors.
//
// A feed like the deck list is only ever read forwards and grows while it is
// being read, so it is walked by index position rather than by `skip`: `skip`
// re-scans everything already passed on every page, which is fine for a
// hundred decks and not for a hundred thousand. The cursor carries the last
// row's sort key so the next page starts exactly where it stopped, including
// when two rows share a timestamp.

import { BadRequestException } from '@nestjs/common';

/** One row's position in a sort. `heart` is only present for the popular sort. */
export interface DeckCursor {
    createdAt: string;
    id: string;
    heart?: number;
}

const encode = (cursor: DeckCursor): string =>
    Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');

/** @throws BadRequestException when the cursor is not one of ours — a client
 *  that mangles it gets a clear 400 rather than a silently wrong page. */
export const decodeDeckCursor = (raw: string): DeckCursor => {
    let parsed: unknown;
    try {
        parsed = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
    } catch {
        throw new BadRequestException('Malformed cursor.');
    }

    const cursor = parsed as Partial<DeckCursor>;
    if (
        typeof cursor?.createdAt !== 'string' ||
        Number.isNaN(new Date(cursor.createdAt).getTime()) ||
        typeof cursor.id !== 'string' ||
        cursor.id.length === 0
    ) {
        throw new BadRequestException('Malformed cursor.');
    }
    return cursor as DeckCursor;
};

/** The `createdAt` for a document, as an ISO string. Mongo stores dates as
 *  milliseconds, and the cursor has to survive a JSON round trip. */
export const cursorFor = (document: {
    _id: unknown;
    createdAt?: Date;
    heart?: number;
}): DeckCursor => ({
    createdAt: (document.createdAt ?? new Date()).toISOString(),
    id: String(document._id),
    ...(typeof document.heart === 'number' ? { heart: document.heart } : {}),
});

export { encode as encodeDeckCursor };
