// -Path: "server/src/api/tts/dto/synthesize-tts.dto.ts"
import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** The BCP47 tags the TTS endpoint accepts, one per study target. */
export const TTS_LANGUAGES = ['th-TH', 'ja-JP', 'en-US', 'ko-KR', 'zh-CN'] as const;

export type TtsLanguage = (typeof TTS_LANGUAGES)[number];

/** A single synthesis request: what to say, in which language, with which voice. */
export class SynthesizeTtsDto {
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    @ApiProperty({ type: String, example: 'ก' })
    text!: string;

    @IsIn(TTS_LANGUAGES)
    @ApiProperty({ type: String, enum: TTS_LANGUAGES, example: 'th-TH' })
    languageCode!: TtsLanguage;

    @IsString()
    @MaxLength(64)
    @ApiProperty({ type: String, example: 'th-TH-Standard-A' })
    voiceName!: string;
}
