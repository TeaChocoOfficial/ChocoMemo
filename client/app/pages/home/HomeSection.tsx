// -Path: 'client/app/pages/home/HomeSection.tsx'
import { motion } from 'framer-motion';
import Section from '~/components/custom/Section';

/**
 * The shared shell for every Home section below the hero: a hairline rule, a
 * mono index and eyebrow, then the title, the one-line hint and the content.
 * One component keeps the editorial rhythm identical across the page, so a new
 * section reads as part of the same document instead of a bolted-on block.
 */
export default function HomeSection({
    index,
    badge,
    title,
    hint,
    children,
    pill,
    id,
}: {
    /** Two-digit section number, shown before the eyebrow. */
    index: string;
    badge: string;
    title: string;
    hint: string;
    children: React.ReactNode;
    /** Optional "Coming soon" pill, shown under the hint. */
    pill?: React.ReactNode;
    /** Anchor id, for the hero link and the footer. */
    id?: string;
}) {
    return (
        <Section className='items-center'>
            <div id={id} className='mx-auto w-full max-w-5xl px-4 sm:px-6'>
                <motion.header
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                    className='border-t border-line pt-6'
                >
                    <div className='flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary'>
                        <span className='tabular-nums'>{index}</span>
                        <span aria-hidden='true' className='h-px w-6 bg-line-strong' />
                        <span>{badge}</span>
                    </div>
                    <h2 className='mt-3 max-w-2xl text-2xl font-bold tracking-tight text-surface-foreground sm:text-3xl'>
                        {title}
                    </h2>
                    <p className='mt-2 max-w-2xl text-sm leading-relaxed text-surface-muted sm:text-base'>
                        {hint}
                    </p>
                    {pill}
                </motion.header>

                <div className='mt-10'>{children}</div>
            </div>
        </Section>
    );
}
