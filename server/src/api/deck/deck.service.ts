// -Path: 'src/api/deck/deck.service.ts'
// Reading published decks: browsing them, and reading one.
//
// Read-only by design. Nothing here creates, edits or deletes a deck — a deck
// reaches the database by some other route for now, and every write path in this
// phase would be a second opinion on ownership and validation with nothing to
// validate against.
//
// Authorship is not checked here, and does not need to be: reads are governed by
// visibility instead, which is the whole point of a public catalogue.
import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, type Model, type QueryFilter } from 'mongoose';
import { nameDB } from '~/hooks/mongodb';
import { Role, type Auth } from '~/types/auth';
import { DeckVisibility } from '~/types/deck';
import { User } from '~/api/user/schemas/user.schema';
import { Deck, type DeckDocument } from './schemas/deck.schema';
import { cursorFor, decodeDeckCursor, encodeDeckCursor } from './deck-cursor';
import { DeckSort, MAX_PAGE_SIZE, type DeckQueryDto } from './dto/deck-query.dto';
import type { DeckAuthorDto, ResponseDeckDto, ResponseDeckPageDto } from './dto/response-deck.dto';

/** `cursor=mine` is a keyword rather than a base64 position, so "my decks"
 *  stays a link somebody can paste. */
const MINE = 'mine';

/** Cover images live in the existing images collection and are served by id. */
const coverUrl = (coverImageId?: string): string | undefined =>
    coverImageId ? `/api/img/${coverImageId}` : undefined;

@Injectable()
export class DeckService {
    logger = new Logger(DeckService.name);

    constructor(
        @InjectModel(Deck.name, nameDB) private readonly deckModel: Model<Deck>,
        @InjectModel(User.name, nameDB) private readonly userModel: Model<User>,
    ) {}

    /** @throws UnauthorizedException when the caller has no session. */
    private requireAuth(auth: Auth): NonNullable<Auth> {
        if (auth === null) throw new UnauthorizedException('Unauthorized');
        return auth;
    }

    /** A deck's author, read live rather than copied onto the deck: a snapshot
     *  would go stale the moment somebody renames themselves. */
    private async authorsFor(userIds: string[]): Promise<Map<string, DeckAuthorDto>> {
        const unique = [...new Set(userIds)];
        // A user's `userId` is their document id, not a field on it, so the
        // join is on `_id` — the same value `auth.userId` carries.
        const ids = unique.filter((id) => Types.ObjectId.isValid(id));
        const users = await this.userModel
            .find({ _id: { $in: ids } })
            .select('name nameTag avatar role')
            .exec();

        return new Map(
            users.map((user) => [
                String(user._id),
                {
                    userId: String(user._id),
                    name: user.name,
                    nameTag: user.nameTag ?? String(user._id),
                    avatar: user.avatar,
                    role: user.role,
                },
            ]),
        );
    }

    /** The client's own `DeckData`, assembled from the row and its author. */
    private async toResponse(deck: DeckDocument): Promise<ResponseDeckDto> {
        const authors = await this.authorsFor([deck.userId]);
        const author = authors.get(deck.userId);
        if (!author) {
            // The row outlived its author (a deleted account). A placeholder
            // beats a 500 on somebody else's deck.
            this.logger.warn(`Deck ${String(deck._id)} has no author row for ${deck.userId}`);
        }

        return {
            id: String(deck._id),
            name: deck.name,
            description: deck.description,
            type: deck.type,
            language: deck.language,
            tags: deck.tags,
            nsfw: deck.nsfw,
            image: coverUrl(deck.coverImageId),
            contentIds: deck.contentIds,
            meta: {
                author: author ?? {
                    userId: deck.userId,
                    name: 'Unknown',
                    nameTag: 'unknown',
                    role: Role.USER,
                },
                createdAt: (deck.createdAt ?? new Date()).toISOString(),
                updatedAt: (deck.updatedAt ?? new Date()).toISOString(),
                downloadCount: deck.downloadCount,
                version: deck.version,
                // Omitted rather than zero: the client reads an absent count as
                // "nobody has hearted this" and shows no number at all.
                heart: deck.heart > 0 ? deck.heart : undefined,
                visibility: deck.visibility,
            },
        };
    }

    /** One page of decks.
     *
     *  Visibility: an anonymous caller sees public decks only, and a signed-in
     *  one additionally sees their own — including their unlisted and private
     *  decks, because those are the ones they are still working on. Nobody
     *  else's unlisted deck is ever listed; it stays reachable by id, which is
     *  what "unlisted" means.
     */
    async findPage(auth: Auth, query: DeckQueryDto): Promise<ResponseDeckPageDto> {
        const mine = query.cursor === MINE;
        const limit = Math.min(query.limit ?? 20, MAX_PAGE_SIZE);
        const sort = query.sort ?? DeckSort.RECENT;
        const caller = auth?.userId;

        const filter: QueryFilter<Deck> = {};
        if (mine) {
            filter.userId = this.requireAuth(auth).userId;
        } else {
            filter.visibility = DeckVisibility.PUBLIC;
            if (caller) {
                filter.$or = [{ visibility: DeckVisibility.PUBLIC }, { userId: caller }];
            }
        }
        if (query.language) filter.language = query.language;
        if (query.type) filter.type = query.type;
        if (query.tag) filter.tags = query.tag;

        // The sort is the same order the cursor walks, so the two can never
        // disagree — which is what makes a repeated page impossible.
        const order: Record<string, 1 | -1> =
            sort === DeckSort.POPULAR
                ? { heart: -1, createdAt: -1, _id: -1 }
                : { createdAt: -1, _id: -1 };

        if (query.cursor && query.cursor !== MINE) {
            const cursor = decodeDeckCursor(query.cursor);
            if (sort === DeckSort.POPULAR) {
                filter.$or = [
                    { heart: { $lt: cursor.heart } },
                    {
                        heart: cursor.heart,
                        $or: [
                            { createdAt: { $lt: new Date(cursor.createdAt) } },
                            {
                                createdAt: new Date(cursor.createdAt),
                                _id: { $lt: String(new Types.ObjectId(cursor.id)) },
                            },
                        ],
                    },
                ];
            } else {
                filter.$or = [
                    { createdAt: { $lt: new Date(cursor.createdAt) } },
                    {
                        createdAt: new Date(cursor.createdAt),
                        _id: { $lt: String(new Types.ObjectId(cursor.id)) },
                    },
                ];
            }
        }

        // One extra document, to learn whether another page exists without a
        // second count query.
        const found = await this.deckModel
            .find(filter)
            .sort(order)
            .limit(limit + 1)
            .exec();

        const hasMore = found.length > limit;
        const page = hasMore ? found.slice(0, limit) : found;
        const items = await Promise.all(page.map((deck) => this.toResponse(deck)));
        const last = page.at(-1);

        return {
            items,
            nextCursor: hasMore && last ? encodeDeckCursor(cursorFor(last)) : null,
        };
    }

    /** One deck by id. */
    async findOne(auth: Auth, id: string): Promise<ResponseDeckDto> {
        const deck = await this.deckModel.findById(id).exec();
        if (!deck) throw new NotFoundException(`Deck with ID ${id} not found.`);

        if (deck.userId !== auth?.userId && deck.visibility === DeckVisibility.PRIVATE) {
            // 404 rather than 403: a private deck's existence is itself private.
            throw new NotFoundException(`Deck with ID ${id} not found.`);
        }

        return this.toResponse(deck);
    }
}
