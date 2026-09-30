// -Path: 'src/api/deck/deck.service.ts'
// Decks published to an account: browsing them, reading one, and editing one.
//
// Authorship is checked here rather than through `ApiService`, for two reasons.
// That helper is bound to a DTO shape that requires `_id`, `createdBy` and
// friends on the request body, which this feature deliberately does not send;
// and its `findOne` refuses anything the caller does not own, whereas reading a
// public deck is the entire point of this endpoint. The errors are the same ones
// it throws, so the API behaves identically to the img and user routes.
import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, type Model, type QueryFilter } from 'mongoose';
import { nameDB } from '~/hooks/mongodb';
import { Role, type Auth } from '~/types/auth';
import { CONTENT_KIND_BY_TYPE, DeckVisibility } from '~/types/deck';
import { User } from '~/api/user/schemas/user.schema';
import { Deck, type DeckDocument } from './schemas/deck.schema';
import { DeckContentService } from './deck-content.service';
import { cursorFor, decodeDeckCursor, encodeDeckCursor } from './deck-cursor';
import { buildSearchText } from './deck-search-text';
import { checkDeckContent, type CreateDeckDto } from './dto/create-deck.dto';
import { DeckSort, MAX_PAGE_SIZE, type DeckQueryDto } from './dto/deck-query.dto';
import type { UpdateDeckDto } from './dto/update-deck.dto';
import type {
    DeckAuthorDto,
    ResponseDeckDetailDto,
    ResponseDeckDto,
    ResponseDeckPageDto,
} from './dto/response-deck.dto';

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
        private readonly contentService: DeckContentService,
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
            // The row outlived its author (a deleted account). Surfacing a
            // placeholder beats a 500 on somebody else's deck.
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
                downloadUrl: coverUrl(deck.coverImageId),
                downloadCount: deck.downloadCount,
                version: deck.version,
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

    /** One deck by id, with its items when `includeContent` is set. */
    async findOne(auth: Auth, id: string, includeContent = false): Promise<ResponseDeckDetailDto> {
        const deck = await this.deckModel.findById(id).exec();
        if (!deck) throw new NotFoundException(`Deck with ID ${id} not found.`);

        const isOwner = deck.userId === auth?.userId;
        if (!isOwner && deck.visibility === DeckVisibility.PRIVATE) {
            // 404 rather than 403: a private deck's existence is itself private.
            throw new NotFoundException(`Deck with ID ${id} not found.`);
        }

        const response = (await this.toResponse(deck)) as ResponseDeckDetailDto;
        if (includeContent) {
            response.content = await this.content(deck);
        }
        return response;
    }

    /** A deck's items, in the deck's running order. */
    private async content(deck: DeckDocument): Promise<unknown[]> {
        const kind = CONTENT_KIND_BY_TYPE[deck.type];
        if (!kind) return [];
        const byId = await this.contentService.findByDeckId(String(deck._id), kind);
        return deck.contentIds
            .map((contentId) => byId.get(contentId))
            .filter((item): item is unknown => item !== undefined);
    }

    /** Creates a deck and its items.
     *
     *  The items are written first so the deck can reference real ids. There is
     *  no transaction to make the pair atomic — the deployment runs a
     *  standalone MongoDB, which does not have them — so a failure between the
     *  two leaves orphaned items, which `removeAll` cleans up when the deck is
     *  deleted. Losing them is better than a deck pointing at ids that were
     *  never written.
     */
    async create(auth: Auth, data: CreateDeckDto): Promise<ResponseDeckDetailDto> {
        const user = this.requireAuth(auth);
        const kind = CONTENT_KIND_BY_TYPE[data.type];
        if (!kind) throw new BadRequestException(`A ${data.type} deck holds no content.`);

        const created = new this.deckModel({
            userId: user.userId,
            createdBy: user.userId,
            updatedBy: user.userId,
            type: data.type,
            language: data.language,
            name: data.name,
            description: data.description,
            tags: data.tags ?? [],
            nsfw: data.nsfw ?? false,
            visibility: data.visibility ?? DeckVisibility.PRIVATE,
            coverImageId: data.coverImageId,
            contentIds: [],
            searchText: buildSearchText({
                name: data.name,
                description: data.description,
                tags: data.tags,
            }),
        });
        await created.save();

        const contentIds = await this.contentService.replace(
            String(created._id),
            kind,
            data.content,
            user.userId,
        );
        created.contentIds = contentIds;
        await created.save();

        return await this.toResponse(created);
    }

    /** Updates a deck. Metadata-only when `content` is absent.
     *
     *  Content is validated here rather than by the DTO, because a partial
     *  update does not carry `type` and the stored one is what decides the
     *  valid shape.
     */
    async update(auth: Auth, id: string, data: UpdateDeckDto): Promise<ResponseDeckDetailDto> {
        const user = this.requireAuth(auth);
        const deck = await this.deckModel.findById(id).exec();
        if (!deck) throw new NotFoundException(`Deck with ID ${id} not found.`);
        if (deck.userId !== user.userId) throw new BadRequestException('Unauthorized');

        const kind = CONTENT_KIND_BY_TYPE[deck.type];
        if (data.content !== undefined) {
            if (!kind) throw new BadRequestException(`A ${deck.type} deck holds no content.`);
            const check = checkDeckContent(data.content, deck.type);
            if (!check.ok) throw new BadRequestException(check.reason);

            deck.contentIds = await this.contentService.replace(
                id,
                kind,
                data.content,
                user.userId,
            );
            // Bumped because the content moved: a client holding an older copy
            // can tell, without comparing anything.
            deck.version = this.nextVersion(deck.version);
        }

        if (data.name !== undefined) deck.name = data.name;
        if (data.description !== undefined) deck.description = data.description;
        if (data.tags !== undefined) deck.tags = data.tags;
        if (data.nsfw !== undefined) deck.nsfw = data.nsfw;
        if (data.visibility !== undefined) deck.visibility = data.visibility;
        if (data.coverImageId !== undefined) deck.coverImageId = data.coverImageId;
        deck.updatedBy = user.userId;
        deck.searchText = buildSearchText({
            name: deck.name,
            description: deck.description,
            tags: deck.tags,
        });

        await deck.save();
        return await this.toResponse(deck);
    }

    /** Deletes a deck and everything it points at. */
    async remove(auth: Auth, id: string): Promise<{ id: string }> {
        const user = this.requireAuth(auth);
        const deck = await this.deckModel.findById(id).exec();
        if (!deck) throw new NotFoundException(`Deck with ID ${id} not found.`);
        if (deck.userId !== user.userId) throw new BadRequestException('Unauthorized');

        const kind = CONTENT_KIND_BY_TYPE[deck.type];
        await deck.deleteOne();
        if (kind) await this.contentService.removeAll(id, kind);
        return { id };
    }

    /** `0.0.9` -> `0.1.0`. A patch bump is enough: the client only compares
     *  strings to know whether its copy is stale, never to migrate anything. */
    private nextVersion(version: string): string {
        const [major, minor, patch] = version.split('.').map(Number);
        return `${major}.${minor}.${patch + 1}`;
    }
}
