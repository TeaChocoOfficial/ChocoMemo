// -Path: 'client/app/pages/edit/dockview/EmptyLayout.tsx'
import { FaLayerGroup } from 'react-icons/fa6';
import Button from '~/components/custom/Button';
import { useTranslation } from 'react-i18next';

/** Props for {@link EmptyLayout}. */
interface EmptyLayoutProps {
    onReset: () => void;
}

/**
 * The workspace's empty state, shown once the last panel has been closed. The
 * dockview header disappears with the last panel, so the "+" action goes with
 * it and this card is the only way back to a usable layout.
 *
 * @param props - The handler that restores the default panels.
 */
export default function EmptyLayout({ onReset }: EmptyLayoutProps) {
    const { t } = useTranslation();

    return (
        <div className='z-10 absolute inset-0 flex items-center justify-center bg-surface p-6'>
            <div className='flex max-w-sm flex-col items-center gap-4 rounded-sm border border-dashed border-line-strong bg-surface-elevated px-8 py-10 text-center'>
                <span className='flex h-12 w-12 items-center justify-center rounded-sm bg-primary-subtle text-primary'>
                    <FaLayerGroup className='h-5 w-5' />
                </span>

                <div className='flex flex-col gap-1'>
                    <h2 className='text-base font-bold tracking-tight text-surface-foreground'>
                        {t('deck.edit.emptyLayoutTitle')}
                    </h2>
                    <p className='text-sm leading-relaxed text-surface-muted'>
                        {t('deck.edit.emptyLayoutHint')}
                    </p>
                </div>

                <Button onClick={onReset}>{t('deck.edit.resetLayout')}</Button>
            </div>
        </div>
    );
}
