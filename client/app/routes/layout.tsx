//-Path: 'Vite-React-Router-TypeScript/app/routes/Layout.tsx'
import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import Navbar from '~/components/layout/Navbar';
import Footer from '~/components/layout/Footer';
import { FaCompassDrafting } from 'react-icons/fa6';
import { useChromeStore } from '~/stores/chrome.store';
import { AnimatePresence, motion } from 'framer-motion';
import { ToasterProvider } from '~/components/provider/ToasterProvider';

export default function Layout() {
    const { t } = useTranslation();
    const { showChrome, setShowChrome } = useChromeStore();

    return (
        <div className='flex flex-col min-h-dvh'>
            <ToasterProvider />

            <AnimatePresence>
                {showChrome && (
                    <motion.div
                        key='navbar'
                        initial={{ y: '-100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '-100%' }}
                        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                        className='fixed inset-x-0 top-0 z-50 h-14'
                    >
                        <Navbar />
                    </motion.div>
                )}
            </AnimatePresence>

            <main className='flex-1'>
                <Outlet />
            </main>

            <AnimatePresence>
                {showChrome && (
                    <motion.div
                        key='footer'
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className='mt-auto'
                    >
                        <Footer />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!showChrome && (
                    <motion.button
                        key='chrome-fab'
                        type='button'
                        title={t('chrome.show')}
                        aria-label={t('chrome.show')}
                        onClick={() => setShowChrome(true)}
                        initial={{ opacity: 0, scale: 0.8, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 8 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        className='fixed z-50 bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-bold text-surface-foreground shadow-lg transition-colors hover:bg-surface-overlay cursor-pointer'
                    >
                        <FaCompassDrafting className='w-4 h-4 text-accent' />
                        <span className='hidden sm:inline'>{t('chrome.toggleLabel')}</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}