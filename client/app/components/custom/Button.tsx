//-Path: "vite-extra-react-ssr-ts/src/components/custom/Button.tsx"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'ghost' | 'outline' | 'surface' | 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
    ghost: 'bg-transparent hover:bg-surface-overlay text-surface-foreground',
    outline: 'border border-line-strong text-accent hover:border-accent hover:bg-accent-subtle',
    surface: 'bg-surface text-surface-foreground border border-line hover:bg-surface-overlay',
    primary: 'bg-accent text-accent-foreground hover:bg-accent-emphasis',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-emphasis',
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
            className={`inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
}
