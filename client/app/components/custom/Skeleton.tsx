// -Path: 'Vite-React-TypeScript/src/components/custom/Skeleton.tsx'

export default function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse rounded-xl bg-surface-muted/50 ${className}`} />;
}
