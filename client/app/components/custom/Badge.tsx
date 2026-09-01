//-Path: "vite-extra-react-ssr-ts/src/components/custom/Badge.tsx"

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

const variantClasses: Record<string, string> = {
    default: 'border-line-strong text-surface-subtle',
    info: 'border-info/60 text-info',
    error: 'border-error/60 text-error',
    success: 'border-success/60 text-success',
    warning: 'border-warning/60 text-warning',
};

export default function Badge({ children, className, variant = 'default' }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-semibold border font-mono uppercase tracking-[0.14em] ${variantClasses[variant]} ${className || ''}`}>
            {children}
        </span>
    );
}
