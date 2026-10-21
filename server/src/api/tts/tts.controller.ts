// -Path: "server/src/api/tts/tts.controller.ts"
import { Get, Post, Body, Query, Res, Controller } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TtsService } from './tts.service';
import type { FastifyReply } from 'fastify';
import { SynthesizeTtsDto } from './dto/synthesize-tts.dto';
import type { ResponseTtsVoiceDto } from './dto/response-tts.dto';

@ApiTags('API Text-to-Speech')
@Controller('api/tts')
export class TtsController {
    constructor(private readonly ttsService: TtsService) {}

    @Get('voices')
    @ApiOperation({ summary: 'List the Google TTS voices for a language' })
    async voices(@Query('languageCode') languageCode: string): Promise<ResponseTtsVoiceDto[]> {
        return this.ttsService.listVoices(languageCode || 'th-TH');
    }

    @Post('synthesize')
    @ApiOperation({ summary: 'Synthesize short text to MP3' })
    async synthesize(@Body() dto: SynthesizeTtsDto, @Res() res: FastifyReply) {
        const audio = await this.ttsService.synthesize(dto);
        res.header('Content-Type', 'audio/mpeg');
        res.header('Cache-Control', 'public, max-age=86400');
        return res.send(audio);
    }
}
