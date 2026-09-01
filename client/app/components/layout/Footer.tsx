//-Path: "Vite-React-TypeScript/src/components/layout/Footer.tsx"
import { useTranslation } from 'react-i18next';
import { SiReactrouter } from 'react-icons/si';
import type { IconType } from 'react-icons/lib';
import { FaGithub, FaBook, FaRocket } from 'react-icons/fa';

function FooterLink({
    href,
    Icon,
    children,
}: {
    href: string;
    Icon: IconType;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1 text-info-emphasis hover:text-info hover:underline transition-colors text-sm'
        >
            <Icon />
            {children}
        </a>
    );
}

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className='border-t border-border/50 bg-surface-overlay/30'>
            <div className='mx-auto max-w-6xl px-4 sm:px-6 py-6'>
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <p className='flex items-center gap-1 text-sm text-surface-foreground'>
                        {t('footer.built_with')} <span className='text-error'>❤</span>{' '}
                        {t('footer.by')}{' '}
                        <FooterLink href='https://github.com/TeaChoco' Icon={FaGithub}>
                            TeaChoco
                        </FooterLink>
                    </p>
                    <div className='flex items-center gap-4'>
                        <FooterLink
                            href='https://github.com/TeaChoco/Vite-React-Router-TypeScript'
                            Icon={FaGithub}
                        >
                            GitHub
                        </FooterLink>

                        <FooterLink href='https://reactrouter.com/docs' Icon={SiReactrouter}>
                            React Router Docs
                        </FooterLink>
                        <FooterLink href='https://vite.dev' Icon={FaRocket}>
                            Vite Docs
                        </FooterLink>
                        <FooterLink href='https://react.dev' Icon={FaBook}>
                            React Docs
                        </FooterLink>
                    </div>
                </div>
            </div>
        </footer>
    );
}
