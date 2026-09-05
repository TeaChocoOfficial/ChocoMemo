// -Path: 'client/app/pages/japanese/kana/components/KanaGrid.tsx'
import KanaCard from './KanaCard';
import type { Kana } from '~/data/japanese/kana';

interface KanaGridProps {
    kanaList: Kana[];
    columns?: number;
}

export default function KanaGrid({ kanaList, columns = 5 }: KanaGridProps) {
    const gridCols =
        columns === 3 ? 'grid-cols-3' : 'grid-cols-5';

    return (
        <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
            {kanaList.map((kana, index) =>
                kana.char ? (
                    <KanaCard key={kana.char + index} kana={kana} index={index} />
                ) : (
                    <div key={`empty-${index}`} className='invisible' aria-hidden='true' />
                ),
            )}
        </div>
    );
}
