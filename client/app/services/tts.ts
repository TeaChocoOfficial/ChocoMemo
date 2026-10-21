// -Path: 'client/app/services/tts.ts'
import serverRest from './axios';
import { type AxiosResponse } from 'axios';

/** One voice Google Cloud TTS offers for a language. */
export interface TtsVoice {
    name: string;
    languageCode: string;
    gender: string;
    type: string;
}

/** The TTS proxy on the server: voice list + short-text synthesis. */
const ttsAPI = {
    /** The Google voices for a BCP47 language tag, e.g. `th-TH`. */
    voices: async (languageCode: string): Promise<AxiosResponse<TtsVoice[]>> =>
        serverRest.get(`/tts/voices`, { params: { languageCode } }),

    /** Synthesize short text to MP3 bytes. */
    synthesize: async (
        text: string,
        languageCode: string,
        voiceName: string,
    ): Promise<AxiosResponse<Blob>> =>
        serverRest.post(
            `/tts/synthesize`,
            { text, languageCode, voiceName },
            { responseType: 'blob' },
        ),
};

export default ttsAPI;
