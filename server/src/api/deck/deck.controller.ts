// -Path: 'src/api/deck/deck.controller.ts'
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseBoolPipe,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
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
import { CreateDeckDto } from './dto/create-deck.dto';
import { DeckQueryDto } from './dto/deck-query.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { ResponseDeckDetailDto, ResponseDeckPageDto } from './dto/response-deck.dto';

interface AuthenticatedRequest extends FastifyRequest {
    user?: Auth;
}

/** `UserAuthGuard` never rejects — it resolves to `null` when there is no valid
 *  session — so guarding a read is what makes the endpoint work for both a
 *  signed-in caller and an anonymous one. */
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
    async findPage(
        @Req() req: AuthenticatedRequest,
        @Query() query: DeckQueryDto,
    ): Promise<ResponseDeckPageDto> {
        return this.deckService.findPage(req.user as Auth, query);
    }

    @Get(':id')
    @UseGuards(UserAuthGuard)
    @ApiOperation({
        summary: 'Get a deck',
        description: 'One deck by id. `include=content` returns its items in running order.',
    })
    @ApiResponse({ status: 200, type: ResponseDeckDetailDto, description: 'Success' })
    @ApiResponse({ status: 404, description: 'Not found, or not visible to the caller' })
    async findOne(
        @Req() req: AuthenticatedRequest,
        @Param('id') id: string,
        @Query('include', new ParseBoolPipe({ optional: true })) include?: boolean,
    ): Promise<ResponseDeckDetailDto> {
        return this.deckService.findOne(req.user as Auth, id, include === true);
    }

    @Post()
    @UseGuards(UserAuthGuard)
    @ApiOperation({
        summary: 'Create a deck',
        description: 'Creates a deck and its items. Private unless `visibility` says otherwise.',
    })
    @ApiResponse({ status: 201, type: ResponseDeckDetailDto, description: 'Created' })
    @ApiResponse({ status: 400, description: 'Invalid deck, or items that do not match its type' })
    @ApiResponse({ status: 401, description: 'No session' })
    async create(
        @Req() req: AuthenticatedRequest,
        @Body() data: CreateDeckDto,
    ): Promise<ResponseDeckDetailDto> {
        return this.deckService.create(req.user as Auth, data);
    }

    @Put(':id')
    @UseGuards(UserAuthGuard)
    @ApiOperation({
        summary: 'Update a deck',
        description:
            'Updates metadata and, when `content` is present, replaces every item and bumps the version.',
    })
    @ApiResponse({ status: 200, type: ResponseDeckDetailDto, description: 'Success' })
    @ApiResponse({ status: 400, description: 'Not the owner, or invalid items' })
    @ApiResponse({ status: 401, description: 'No session' })
    @ApiResponse({ status: 404, description: 'Not found' })
    async update(
        @Req() req: AuthenticatedRequest,
        @Param('id') id: string,
        @Body() data: UpdateDeckDto,
    ): Promise<ResponseDeckDetailDto> {
        return this.deckService.update(req.user as Auth, id, data);
    }

    @Delete(':id')
    @UseGuards(UserAuthGuard)
    @ApiOperation({ summary: 'Delete a deck', description: 'Deletes a deck and its items.' })
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiResponse({ status: 400, description: 'Not the owner' })
    @ApiResponse({ status: 401, description: 'No session' })
    @ApiResponse({ status: 404, description: 'Not found' })
    async remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
        if (!id) throw new BadRequestException('Deck id is required.');
        return this.deckService.remove(req.user as Auth, id);
    }
}
