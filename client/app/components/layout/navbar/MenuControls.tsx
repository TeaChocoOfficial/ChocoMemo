import LanguageSwitcher from '../../config/LanguageSwitcher';
import ThemePicker from '../../config/ThemePicker';
import { useTranslation } from 'react-i18next';

type MenuControlsProps = {
    className?: string;
    showLabels?: boolean;
};

export default function MenuControls({ className = '', showLabels = true }: MenuControlsProps) {
    const { t } = useTranslation();

    const labelClass =
        'block text-[10px] font-bold uppercase tracking-[0.16em] text-surface-muted mb-1.5 px-0.5';

    return (
        <div className={className}>
            <div>
                {showLabels && <span className={labelClass}>{t('nav.language')}</span>}
                <LanguageSwitcher />
            </div>
            <div>
                {showLabels && <span className={labelClass}>{t('nav.theme')}</span>}
                <ThemePicker />
            </div>
        </div>
    );
}