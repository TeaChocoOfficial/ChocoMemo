// -Path: 'client/app/components/custom/PageShell.tsx'
import { Link } from '~/i18n/routing';
import { FaArrowLeft } from 'react-icons/fa6';
import Section from './Section';

interface PageShellProps {
    children: React.ReactNode;
    /** Back-link label; omit the link entirely when absent. */
    backLabel?: string;
    backTo?: string;
    /** Page max width. Deck lists are wider than reading views. */
    width?: 'default' | 'narrow';
    className?: string;
}

/**
 * Page frame shared by every routed page: the padded `Section` background, a
 * consistent content column, and the "back" link.
 *
 * Exists so the padding and back-link classes aren't retyped per page — they
 * were duplicated verbatim across the Japanese, language-select, and profile
 * routes, where a one-off tweak would silently diverge.
 */
export default function PageShell({
    children,
    backLabel,
    backTo = '/',
    width = 'default',
    className = '',
}: PageShellProps) {
    return (
        <Section className='items-start justify-center'>
            <div
                className={`mx-auto w-full px-4 sm:px-6 ${width === 'narrow' ? 'max-w-3xl' : 'max-w-5xl'} ${className}`}
            >
                {backLabel && (
                    <Link
                        to={backTo}
                        className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-surface-muted transition-colors hover:text-primary'
                    >
                        <FaArrowLeft className='h-3.5 w-3.5' />
                        {backLabel}
                    </Link>
                )}
                {children}
            </div>
        </Section>
    );
}
