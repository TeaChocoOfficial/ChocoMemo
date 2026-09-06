// -Path: "Nest TypeScript/src/api/img/img.controller.ts"
import {
    Get,
    Put,
    Req,
    Res,
    Body,
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
import { ImgService } from './img.service';
import type { Auth } from '../../types/auth';
import type { UpdateImgDto } from './dto/update-img.dto';
import type { ResponseImgDto } from './dto/response-img.dto';
import { UserAuthGuard } from '../user/auth/guard/user-auth.guard';

// Fastify types
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { MultipartFile } from '@fastify/multipart';
import { MulterFile } from '../../types/multer';

interface AuthenticatedRequest extends FastifyRequest {
    user?: Auth;
}

@ApiTags('API Image')
@Controller('api/img')
export class ImgController {
    logger = new Logger(ImgController.name);

    constructor(private readonly imgService: ImgService) {}

    // @fastify/multipart attaches file parts into req.body when attachFieldsToBody is enabled
    private getMultipartFile(req: FastifyRequest, field: string): MultipartFile | undefined {
        const value = (req.body as Record<string, unknown> | undefined)?.[field];
        if (Array.isArray(value)) return value[0] as MultipartFile;
        return value as MultipartFile | undefined;
    }

    private async toMulterFile(file: MultipartFile): Promise<MulterFile> {
        const buffer = await file.toBuffer();
        return {
            fieldname: file.fieldname,
            originalname: file.filename,
            encoding: file.encoding || '7bit',
            mimetype: file.mimetype,
            size: buffer.length,
            buffer: buffer,
            destination: '',
            filename: file.filename,
            path: '',
        };
    }

    @Post()
    @UseGuards(UserAuthGuard)
    async create(@Req() req: AuthenticatedRequest) {
        const user = req.user as Auth;
        const file = this.getMultipartFile(req, 'file');
        if (!file) throw new BadRequestException('File is required');

        return this.imgService.create(user, await this.toMulterFile(file));
    }

    @Get()
    @UseGuards(UserAuthGuard)
    async findAll(@Req() req: AuthenticatedRequest): Promise<ResponseImgDto[]> {
        const user = req.user as Auth;
        return this.imgService.findAll(user);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
        if (!id || id === 'undefined' || id.length !== 24) {
            throw new NotFoundException();
        }

        const image = await this.imgService.findOneRaw(id);
        if (!image) {
            throw new NotFoundException();
        }

        res.header('Content-Type', image.mimetype);
        return res.send(image.data);
    }

    @Put(':id')
    @UseGuards(UserAuthGuard)
    async update(
        @Req() req: AuthenticatedRequest,
        @Param('id') id: string,
        @Body() data: UpdateImgDto,
    ) {
        const user = req.user as Auth;

        const file = this.getMultipartFile(req, 'file');
        const multerFile = file ? await this.toMulterFile(file) : undefined;

        return this.imgService.update(user, id, data, multerFile);
    }

    @Delete(':id')
    @UseGuards(UserAuthGuard)
    async remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
        const user = req.user as Auth;
        return this.imgService.remove(user, id);
    }
}
