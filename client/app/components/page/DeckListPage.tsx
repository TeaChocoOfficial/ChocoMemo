// -Path: 'client/app/pages/japanese/render/DeckList.tsx'
import { Link } from '~/i18n/routing';
import type { DeckType } from '~/types/deck';
import { FaArrowLeft } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import type { Languages } from '~/data/language';
import Section from '~/components/custom/Section';
import DecksList from '~/components/container/DecksList';

export default function DeckListPage({ type, language }: { type: DeckType; language: Languages }) {
    const { t } = useTranslation();

    return (
        <Section>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 w-full'>
                <Link
                    to={`/${language}`}
                    className='inline-flex items-center gap-2 mb-6 text-sm font-medium text-surface-muted hover:text-primary transition-colors'
                >
                    <FaArrowLeft className='w-3.5 h-3.5' />
                    {t(`${language}.${type}.back_hub`)}
                </Link>

                <div className='relative overflow-hidden rounded-sm border border-line bg-surface shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]'>
                    {/* Faint dot grid — reads as ruled paper in every theme */}
                    <div
                        aria-hidden='true'
                        className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--color-border)_1px,transparent_1px)] bg-size-[18px_18px] opacity-40'
                    />

                    <div className='relative px-5 py-8 sm:px-8 sm:py-10'>
                        <header className='flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between'>
                            <div className='max-w-2xl'>
                                <p className='font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-primary'>
                                    {t(`${language}.${type}.eyebrow`)}
                                </p>
                                <h1 className='mt-2 font-sans text-3xl font-black tracking-tight text-surface-foreground sm:text-4xl'>
                                    {t(`${language}.${type}.title`)}
                                </h1>
                                <p className='mt-2 text-sm leading-relaxed text-surface-subtle'>
                                    {t(`${language}.${type}.description`)}
                                </p>
                            </div>
                        </header>
                        <DecksList type={type} language={language} />
                    </div>
                </div>
            </div>
        </Section>
    );
}
