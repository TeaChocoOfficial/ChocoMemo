// -Path: 'client/app/pages/characters/kana/components/KanaGrid.tsx'
import KanaCard from './KanaCard';
import type { KanaChars } from '~/data/ja/kana';
import type { ReadableChar } from '~/types/characters';
import { useCharacterToolbar } from '~/hooks/characters/useChacterToolbar';

const groupColumns: Record<keyof KanaChars, number> = {
    voiceless: 5,
    voiced: 5,
    contracted: 3,
};

interface KanaGridProps {
    activeChar?: string | null;
    onRead?: (kana: ReadableChar, index: number) => void;
}

export default function KanaGrid({ activeChar = null, onRead }: KanaGridProps) {
    const { items, activeGroup } = useCharacterToolbar('ja');
    const columns = groupColumns[activeGroup];
    const gridCols = columns === 3 ? 'grid-cols-3' : 'grid-cols-5';

    return (
        <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
            {items.map((item, index) =>
                item.char ? (
                    <KanaCard
                        key={item.char + index}
                        kana={item}
                        index={index}
                        active={item.char === activeChar}
                        onRead={onRead}
                    />
                ) : (
                    <div key={`empty-${index}`} className='invisible' aria-hidden='true' />
                ),
            )}
        </div>
    );
}
