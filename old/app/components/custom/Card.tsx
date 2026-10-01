//-Path: "vite-extra-react-ssr-ts/src/components/custom/Card.tsx"

interface CardProps {
    icon?: React.ReactNode;
    title?: string;
    children: React.ReactNode;
    className?: string;
    description?: string;
}

export default function Card({ icon, title, children, className, description }: CardProps) {
    return (
        <div
            className={`relative rounded-sm border border-line bg-surface p-5 transition-colors duration-200 hover:bg-surface-overlay ${className || ''}`}
        >
            {icon && (
                <div className='mb-4 flex h-11 w-11 items-center justify-center rounded-sm bg-primary text-primary-foreground'>
                    {icon}
                </div>
            )}
            {title && (
                <h3 className='mb-2 text-lg font-bold tracking-tight text-surface-foreground'>
                    {title}
                </h3>
            )}
            {description && (
                <p className='text-sm leading-relaxed text-surface-muted'>{description}</p>
            )}
            {children}
        </div>
    );
}
