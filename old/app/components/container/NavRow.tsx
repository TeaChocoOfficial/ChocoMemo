// -Path: 'client/app/components/container/NavRow.tsx'
import { Link } from '~/i18n/routing';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa6';

export interface NavRowProps {
    to: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    action: string;
    /** Stagger position, so the rows cascade in on load. */
    index?: number;
}

const ROW =
    'group flex items-start gap-4 rounded-sm border border-line bg-surface p-5 transition-colors duration-200 hover:border-primary hover:bg-surface-overlay sm:items-center sm:gap-5 sm:p-6';
const ROW_ICON =
    'flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-colors duration-200 group-hover:bg-primary-emphasis sm:h-14 sm:w-14';
const ROW_ACTION =
    'hidden shrink-0 items-center gap-2 text-sm font-semibold text-primary sm:inline-flex';

/**
 * One destination on a track hub (Japanese, English, ...) as a full-width
 *  row rather than a tile.
 *
 * A hub is a list of places to go, read top to bottom, so the glyph, the
 * copy and the action share one line and the whole row is the hit target.
 * Copy is passed in already translated so the hub stays declarative.
 */
export default function NavRow({ to, icon, title, description, action, index = 0 }: NavRowProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
        >
            <Link to={to} className={ROW}>
                <span className={ROW_ICON}>{icon}</span>

                <div className='min-w-0 flex-1'>
                    <h3 className='text-lg font-bold tracking-tight text-surface-foreground sm:text-xl'>
                        {title}
                    </h3>
                    <p className='mt-1 text-sm leading-relaxed text-surface-muted'>{description}</p>
                </div>

                <span className={ROW_ACTION}>
                    {action}
                    <FaArrowRight className='h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1' />
                </span>
            </Link>
        </motion.div>
    );
}
