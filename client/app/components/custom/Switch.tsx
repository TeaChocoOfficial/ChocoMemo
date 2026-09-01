//-Path: "vite-extra-react-ssr-ts/src/components/custom/Switch.tsx"
import { useId } from 'react';

interface SwitchProps {
    label?: string;
    checked: boolean;
    className?: string;
    onCheckedChange: (checked: boolean) => void;
}

export default function Switch({ label, checked, className, onCheckedChange }: SwitchProps) {
    const id = useId();
    const trackClass = `relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-primary' : 'bg-neutral'
    }`;
    const thumbClass = `pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
    }`;

    return (
        <div className={`flex items-center gap-3 ${className || ''}`}>
            <button
                id={id}
                role="switch"
                type="button"
                className={trackClass}
                aria-checked={checked}
                onClick={() => onCheckedChange(!checked)}>
                <span className={thumbClass} />
            </button>
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-bold tracking-tight text-surface-foreground cursor-pointer">
                    {label}
                </label>
            )}
        </div>
    );
}
