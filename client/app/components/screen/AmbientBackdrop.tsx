// -Path: 'client/app/components/screen/AmbientBackdrop.tsx'
export default function AmbientBackdrop({
    kanji,
    className = '',
}: {
    kanji?: string;
    className?: string;
}) {
    return (
        <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
        >
            <div className='absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full border border-line' />
            <div className='absolute -right-16 -top-24 h-[20rem] w-[20rem] rounded-full border border-line' />
            <div className='absolute -right-4 -top-12 h-[12rem] w-[12rem] rounded-full border border-line-strong' />
            <div className='absolute -bottom-40 -left-32 h-[30rem] w-[30rem] rounded-full border border-line' />
            <div className='absolute -bottom-24 -left-16 h-[18rem] w-[18rem] rounded-full border border-line' />
            {kanji && (
                <span className='watermark absolute right-[3%] top-1/2 -translate-y-1/2 text-[min(38vw,360px)] leading-none'>
                    {kanji}
                </span>
            )}
        </div>
    );
}