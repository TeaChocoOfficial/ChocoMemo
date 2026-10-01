// -Path: 'src/api/deck/deck.controller.ts'
// Reading published decks. Browse a page, or read one.
//
// Every route is read-only, and every one is open to an anonymous caller — the
// service decides what that caller may see from the deck's visibility. The guard
// is here only to tell the two apart: `UserAuthGuard` never rejects, it
// resolves to `null` when there is no valid session, which is exactly what
// "read public decks without an account" needs.
import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import { DeckService } from './deck.service';
import { UserAuthGuard } from '~/api/user/auth/guard/user-auth.guard';
import type { Auth } from '~/types/auth';
// Value imports, not `import type`: Nest reads each route parameter's type from
// the emitted `design:paramtypes` metadata, and a type-only import is erased at
// compile time — the metadata then degrades to `Function`, the ValidationPipe
// skips the parameter as unvalidatable, and every rule below silently stops
// being enforced.
import { DeckQueryDto } from './dto/deck-query.dto';
import { ResponseDeckDto, ResponseDeckPageDto } from './dto/response-deck.dto';

interface AuthenticatedRequest extends FastifyRequest {
    user?: Auth;
}

@ApiTags('API Decks')
@Controller('api/decks')
export class DeckController {
    constructor(private readonly deckService: DeckService) {}

    @Get()
    @UseGuards(UserAuthGuard)
    @ApiOperation({
        summary: 'Browse decks',
        description:
            "One page of decks. Public only, plus the caller's own. Pass `cursor=mine` for every deck the caller owns, in any visibility.",
    })
    @ApiResponse({ status: 200, type: ResponseDeckPageDto, description: 'Success' })
    @ApiResponse({ status: 400, description: 'Malformed query or cursor' })
    @ApiResponse({ status: 401, description: 'No session, with `cursor=mine`' })
    async findPage(
        @Req() req: AuthenticatedRequest,
        @Query() query: DeckQueryDto,
    ): Promise<ResponseDeckPageDto> {
        return this.deckService.findPage(req.user as Auth, query);
    }

    @Get(':id')
    @UseGuards(UserAuthGuard)
    @ApiOperation({ summary: 'Get a deck', description: 'One deck by id.' })
    @ApiResponse({ status: 200, type: ResponseDeckDto, description: 'Success' })
    @ApiResponse({ status: 404, description: 'Not found, or not visible to the caller' })
    async findOne(
        @Req() req: AuthenticatedRequest,
        @Param('id') id: string,
    ): Promise<ResponseDeckDto> {
        return this.deckService.findOne(req.user as Auth, id);
    }
}
