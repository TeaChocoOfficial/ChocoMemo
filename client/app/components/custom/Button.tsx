//-Path: "vite-extra-react-ssr-ts/src/components/custom/Button.tsx"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'ghost' | 'outline' | 'surface' | 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
    ghost: 'bg-transparent hover:bg-muted text-surface-foreground',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    surface: 'bg-surface-elevated text-surface-foreground hover:bg-surface-overlay',
    primary:
        'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40',
    secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/25 hover:shadow-secondary/40',
};

const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
};

export default function Button({
    size = 'md',
    children,
    className,
    variant = 'primary',
    ...props
}: ButtonProps) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
}
