// -Path: 'client/app/components/layout/Footer.tsx'
import { Link } from '~/i18n/routing';
import { getAssetUrl } from '~/utils/url';
import { FaGithub } from 'react-icons/fa6';
import { languages } from '~/data/language';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className='mt-auto border-t border-line bg-surface'>
            <div className='mx-auto max-w-6xl px-4 sm:px-6 py-10'>
                <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                    {/* Brand */}
                    <div className='flex flex-col gap-3'>
                        <Link to='/' className='flex items-center gap-3'>
                            <img
                                alt='ChocoMemo'
                                src={getAssetUrl('/icon.png')}
                                className='h-12 shrink-0'
                            />
                        </Link>
                        <p className='max-w-xs text-sm text-surface-muted'>{t('footer.tagline')}</p>
                    </div>

                    {/* Explore */}
                    <div className='flex flex-col gap-3'>
                        <h3 className='text-xs font-semibold uppercase tracking-[0.18em] text-surface-subtle'>
                            {t('footer.explore')}
                        </h3>
                        <ul className='flex flex-col gap-2 text-sm'>
                            <li>
                                <Link
                                    to='/'
                                    className='text-surface-foreground hover:text-primary transition-colors'
                                >
                                    {t('nav.home')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/language-select'
                                    className='text-surface-foreground hover:text-primary transition-colors'
                                >
                                    {t('nav.languages')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/japanese'
                                    className='text-surface-foreground hover:text-primary transition-colors'
                                >
                                    {t('nav.japanese')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Languages */}
                    <div className='flex flex-col gap-3'>
                        <h3 className='text-xs font-semibold uppercase tracking-[0.18em] text-surface-subtle'>
                            {t('footer.learn')}
                        </h3>
                        <ul className='flex flex-wrap gap-2'>
                            {languages.map((lang) => (
                                <li
                                    key={lang.code}
                                    className='border border-line px-3 py-1 text-sm text-surface-subtle'
                                >
                                    {t(`footer.languages.${lang.code}`)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className='mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-line pt-6'>
                    <p className='text-sm text-surface-muted'>© 2026 {t('footer.rights')}</p>
                    <div className='flex gap-4'>
                        <a
                            href='https://github.com/TeaChocoOfficial'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 text-sm text-surface-subtle hover:text-info transition-colors'
                        >
                            <FaGithub className='h-4 w-4' />
                            TeaChoco Official
                        </a>
                        <a
                            href='https://github.com/TeaChoco'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-2 text-sm text-surface-subtle hover:text-info transition-colors'
                        >
                            <FaGithub className='h-4 w-4' />
                            TeaChoco
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
