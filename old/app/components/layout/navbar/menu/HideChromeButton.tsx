import { FaEyeSlash } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { useChromeStore } from '~/stores/config/chrome.store';

type HideChromeButtonProps = {
    onHide: () => void;
    className?: string;
    buttonClassName?: string;
    compact?: boolean;
};

export default function HideChromeButton({
    onHide,
    className = '',
    buttonClassName = '',
    compact = false,
}: HideChromeButtonProps) {
    const { t } = useTranslation();
    const { setShowChrome } = useChromeStore();

    const handleClick = () => {
        setShowChrome(false);
        onHide();
    };

    return (
        <div className={className}>
            <button
                type='button'
                onClick={handleClick}
                className={`flex w-full items-center gap-2 text-sm text-surface-muted transition-colors cursor-pointer hover:bg-surface-overlay hover:text-error ${
                    compact ? 'px-2.5 py-2 rounded-sm' : 'px-3 py-2.5'
                } ${buttonClassName}`}
            >
                <FaEyeSlash className='h-3.5 w-3.5' />
                {t('chrome.hide')}
            </button>
        </div>
    );
}