// -Path: "server/src/api/tts/tts.module.ts"
import { Module } from '@nestjs/common';
import { TtsService } from './tts.service';
import { TtsController } from './tts.controller';

@Module({
    controllers: [TtsController],
    providers: [TtsService],
})
export class TtsModule {}
