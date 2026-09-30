// -Path: 'src/api/deck/dto/update-deck.dto.ts'
import { OmitType, PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDeckDto } from './create-deck.dto';

/** A partial update.
 *
 *  `type` and `language` are absent on purpose: they decide which collection a
 *  deck's content lives in, so changing one means creating a different deck
 *  rather than mutating this one. `content` is validated by the service against
 *  the *stored* type for the same reason — a partial update cannot know it from
 *  the body. It replaces the deck's items wholesale: a deck is a study list,
 *  and merging would need per-item identity the API deliberately does not keep. */
export class UpdateDeckDto extends PartialType(
    OmitType(CreateDeckDto, ['type', 'content'] as const),
) {
    @ApiProperty({
        required: false,
        description: "The deck's items. Replaces every existing item when present.",
    })
    content?: unknown[];
}
