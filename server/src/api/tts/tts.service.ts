// -Path: "server/src/api/tts/tts.service.ts"
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SecureService } from '../../secure/secure.service';
import type { ResponseTtsVoiceDto } from './dto/response-tts.dto';
import type { SynthesizeTtsDto } from './dto/synthesize-tts.dto';

/** The Google Cloud TTS REST base. */
const TTS_BASE = 'https://texttospeech.googleapis.com/v1';

/** A voice as returned by the Google `voices` endpoint. */
interface GoogleVoice {
    name: string;
    languageCodes: string[];
    ssmlGender: string;
    naturalSampleRateHertz: number;
}

/** The `voices` endpoint payload. */
interface GoogleVoicesResponse {
    voices?: GoogleVoice[];
}

/** The `text:synthesize` endpoint payload. */
interface GoogleSynthesizeResponse {
    audioContent?: string;
}

/**
 * Google Cloud Text-to-Speech proxy. The API key never reaches the browser:
 * the client asks this service for the voice list and for synthesized audio,
 * and the service talks to Google with the server-side key.
 */
@Injectable()
export class TtsService {
    logger = new Logger(TtsService.name);

    constructor(private readonly secureService: SecureService) {}

    /** The Google API key, or a clear error when it is not configured. */
    private apiKey(): string {
        const key = this.secureService.getEnvConfig().GOOGLE_TTS_API_KEY;
        if (!key) throw new BadRequestException('Google TTS is not configured');
        return key;
    }

    /**
     * The voices Google offers for one language, flattened to the fields the
     * picker needs.
     *
     * @param languageCode - BCP47 tag, e.g. `th-TH`.
     * @returns The available voices for that language.
     */
    async listVoices(languageCode: string): Promise<ResponseTtsVoiceDto[]> {
        const url = `${TTS_BASE}/voices?languageCode=${encodeURIComponent(languageCode)}&key=${this.apiKey()}`;
        const response = await fetch(url);
        if (!response.ok) {
            this.logger.error(`Google voices failed: ${response.status}`);
            throw new BadRequestException('Could not load voices');
        }

        const data = (await response.json()) as GoogleVoicesResponse;
        return (data.voices ?? []).map((voice) => ({
            name: voice.name,
            languageCode: voice.languageCodes[0] ?? languageCode,
            gender: voice.ssmlGender,
            type: voice.name.includes('Neural2')
                ? 'NEURAL2'
                : voice.name.includes('Wavenet')
                  ? 'WAVENET'
                  : 'STANDARD',
        }));
    }

    /**
     * Synthesize one short text to MP3.
     *
     * @param dto - Text, language and voice to speak with.
     * @returns The MP3 bytes.
     */
    async synthesize(dto: SynthesizeTtsDto): Promise<Buffer> {
        const url = `${TTS_BASE}/text:synthesize?key=${this.apiKey()}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: { text: dto.text },
                voice: { languageCode: dto.languageCode, name: dto.voiceName },
                audioConfig: { audioEncoding: 'MP3' },
            }),
        });

        if (!response.ok) {
            this.logger.error(`Google synthesize failed: ${response.status}`);
            throw new BadRequestException('Could not synthesize speech');
        }

        const data = (await response.json()) as GoogleSynthesizeResponse;
        if (!data.audioContent) throw new BadRequestException('No audio returned');
        return Buffer.from(data.audioContent, 'base64');
    }
}
