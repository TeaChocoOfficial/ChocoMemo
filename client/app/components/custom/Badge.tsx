//-Path: "vite-extra-react-ssr-ts/src/components/custom/Badge.tsx"

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

const variantClasses: Record<string, string> = {
    default: 'bg-primary/10 text-primary border-primary/20',
    info: 'bg-info/10 text-info border-info/20',
    error: 'bg-error/10 text-error border-error/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
};

export default function Badge({ children, className, variant = 'default' }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border tracking-wide ${variantClasses[variant]} ${className || ''}`}>
            {children}
        </span>
    );
}
