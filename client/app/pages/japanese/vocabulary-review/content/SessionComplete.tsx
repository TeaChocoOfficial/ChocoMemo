import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SessionComplete() {
    const { t } = useTranslation();

    return (
        <div className='flex-1 flex flex-col items-center justify-center gap-3 w-full'>
            <p className='text-2xl font-bold text-surface-foreground'>
                {t('japanese.vocabularyReview.complete')}
            </p>
            <p className='text-surface-muted'>
                {t('japanese.vocabularyReview.completeDescription')}
            </p>
        </div>
    );
}
