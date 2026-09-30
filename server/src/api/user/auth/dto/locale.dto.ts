// -Path: "Nest TypeScript/src/user/auth/dto/locale.dto.ts"
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { MAIL_LOCALES } from '../../../../mail/mail-i18n';

/** Loose BCP-47 shape: `en`, `th-TH`, `zh-Hans-CN`. The mail resolver maps
 *  it to a catalogue entry and falls back to English, so this only rejects
 *  values that could never be a language tag. */
const LOCALE_PATTERN = /^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

/**
 * The UI locale the request came from, used to pick the language of any
 * email the request triggers. Optional everywhere: omitting it simply
 * means the email is sent in English.
 */
export class LocaleDto {
    @IsOptional()
    @IsString()
    @MaxLength(35)
    @Matches(LOCALE_PATTERN, {
        message: 'locale must be a BCP-47 language tag, e.g. "en" or "th-TH"',
    })
    @ApiProperty({
        type: String,
        required: false,
        example: 'th-TH',
        description: `UI locale for the email language. Supported: ${MAIL_LOCALES.join(', ')}. Falls back to en-US.`,
        enum: MAIL_LOCALES,
    })
    readonly locale?: string;
}
