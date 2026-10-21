// -Path: "server/src/api/tts/dto/response-tts.dto.ts"
import { ApiProperty } from '@nestjs/swagger';

/** One voice Google Cloud TTS offers for a language. */
export class ResponseTtsVoiceDto {
    @ApiProperty({ type: String, example: 'th-TH-Standard-A' })
    name!: string;

    @ApiProperty({ type: String, example: 'th-TH' })
    languageCode!: string;

    @ApiProperty({ type: String, example: 'FEMALE' })
    gender!: string;

    @ApiProperty({ type: String, example: 'STANDARD' })
    type!: string;
}
