// -Path: "TeaChoco-Portfolio/client/src/layout/Section.tsx"
import { motion } from 'framer-motion';
import { useChromeStore } from '~/stores/config/chrome.store';

export default function Section({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { showChrome } = useChromeStore();

    return (
        <motion.section
            transition={{ duration: 0.6 }}
            initial={{ opacity: 0, y: 24 }}
            viewport={{ margin: '-100px' }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`flex relative ${showChrome ? 'min-h-100dvh py-16 sm:py-20' : 'min-h-[calc(100dvh-32px)] py-8'} ${className}`}
        >
            {children}
        </motion.section>
    );
}
