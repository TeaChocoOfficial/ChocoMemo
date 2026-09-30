// Placeholder tiles shown while a deck source is still loading. They mirror
// `DeckCard`'s shape — a 16:9 cover, then an avatar and two lines — so the
// grid does not jump when the real cards replace them.
import { useTranslation } from 'react-i18next';
import Skeleton from '~/components/custom/Skeleton';

/** Tiles to show while loading, sized to roughly one screenful. */
const PLACEHOLDERS = 8;

function DeckTileSkeleton() {
    return (
        <div aria-hidden='true'>
            <Skeleton className='aspect-video w-full rounded-[10px]' />
            <div className='mt-3 flex gap-3'>
                <Skeleton className='h-9 w-9 shrink-0 rounded-full' />
                <div className='flex-1'>
                    <Skeleton className='h-4 w-4/5' />
                    <Skeleton className='mt-1.5 h-3 w-1/2' />
                </div>
            </div>
        </div>
    );
}

export default function DeckListSkeleton() {
    const { t } = useTranslation();

    return (
        <div
            role='status'
            aria-live='polite'
            aria-busy='true'
            className='grid grid-cols-1 gap-x-4 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        >
            <span className='sr-only'>{t('deck.loading')}</span>
            {Array.from({ length: PLACEHOLDERS }, (_, index) => (
                <DeckTileSkeleton key={index} />
            ))}
        </div>
    );
}
