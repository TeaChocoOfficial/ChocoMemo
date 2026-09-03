//-Path: 'Vite-React-Router-TypeScript/app/routes/Layout.tsx'
import { Outlet } from 'react-router';
import { FaCompassDrafting } from 'react-icons/fa6';
import Navbar from '~/components/layout/Navbar';
import Footer from '~/components/layout/Footer';
import { ToasterProvider } from '~/components/provider/ToasterProvider';
import { useChromeStore } from '~/stores/chrome.store';
import { useTranslation } from 'react-i18next';

export default function Layout() {
    const { t } = useTranslation();
    const showChrome = useChromeStore((s) => s.showChrome);
    const setShowChrome = useChromeStore((s) => s.setShowChrome);

    return (
        <div className='flex flex-col min-h-dvh overflow-auto'>
            <ToasterProvider />
            {showChrome && <Navbar />}
            <main className='flex-1'>
                <Outlet />
            </main>
            {showChrome && <Footer />}

            {!showChrome && (
                <button
                    type='button'
                    title={t('chrome.show')}
                    aria-label={t('chrome.show')}
                    onClick={() => setShowChrome(true)}
                    className='fixed z-50 bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-bold text-surface-foreground shadow-lg transition-colors hover:bg-surface-overlay cursor-pointer'
                >
                    <FaCompassDrafting className='w-4 h-4 text-accent' />
                    <span className='hidden sm:inline'>{t('chrome.toggleLabel')}</span>
                </button>
            )}
        </div>
    );
}