import {
    Get,
    Req,
    Res,
    Post,
    Param,
    Delete,
    Logger,
    UseGuards,
    Controller,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Auth } from '../../../types/auth';
import { AvatarService } from './avatar.service';
import { UserAuthGuard } from '../../user/auth/guard/user-auth.guard';
import { getMultipartFile, toMulterFile } from '../multipart.util';

interface AuthenticatedRequest extends FastifyRequest {
    user?: Auth;
}

@ApiTags('API Avatar')
@Controller('api/avatar')
export class AvatarController {
    logger = new Logger(AvatarController.name);

    constructor(private readonly avatarService: AvatarService) {}

    @Post()
    @UseGuards(UserAuthGuard)
    async create(@Req() req: AuthenticatedRequest) {
        const user = req.user as Auth;
        const file = getMultipartFile(req, 'file');
        if (!file) throw new BadRequestException('File is required');
        return this.avatarService.create(user, await toMulterFile(file));
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
        if (!id || id === 'undefined' || id.length !== 24) {
            throw new NotFoundException();
        }

        const avatar = await this.avatarService.findOneRaw(id);
        if (!avatar) {
            throw new NotFoundException();
        }

        res.header('Content-Type', avatar.mimetype);
        return res.send(avatar.data);
    }

    @Delete(':id')
    @UseGuards(UserAuthGuard)
    async remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
        const user = req.user as Auth;
        return this.avatarService.removeOwn(user, id);
    }
}