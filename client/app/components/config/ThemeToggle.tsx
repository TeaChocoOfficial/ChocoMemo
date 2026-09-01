//-Path: "TeaChoco-Portfolio/client/src/components/ThemeToggle.tsx"
import { FaSun, FaMoon } from 'react-icons/fa6';
import { useThemeStore } from '~/stores/theme.store';

export default function ThemeToggle() {
    const { theme, toggleTheme, _hydrated } = useThemeStore();

    if (!_hydrated) return <div className='h-8 w-14 rounded-full bg-border animate-pulse' />;

    return (
        <button
            onClick={toggleTheme}
            aria-label='Toggle Theme'
            className={`relative h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-sky-200'
            }`}
        >
            <span
                className={`absolute left-1 top-1 flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`}
            >
                {theme === 'dark' ? (
                    <FaMoon className='h-4 w-4 text-slate-800' />
                ) : (
                    <FaSun className='h-4 w-4 text-orange-500' />
                )}
            </span>
        </button>
    );
}
