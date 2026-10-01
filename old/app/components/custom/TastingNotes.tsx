// -Path: 'client/app/components/custom/TastingNotes.tsx'
// Shared decorative primitives for the "tea tasting note" card look used by
// the exam-set and review-deck lists. Small, theme-aware, no layout deps.
import { FaCheck } from 'react-icons/fa6';

interface StrengthMeterProps {
    value: string;
    fillPct: number;
}

/** A thin strength bar under a note-count line. `fillPct` 0-100. */
export function StrengthMeter({ value, fillPct }: StrengthMeterProps) {
    return (
        <div>
            <div className='flex items-baseline justify-between gap-3'>
                <span className='font-sans text-base font-semibold italic text-surface-foreground'>
                    {value}
                </span>
            </div>
            <div className='mt-2 h-1.5 w-full overflow-hidden rounded-full border border-line bg-surface-overlay'>
                <div
                    className='h-full rounded-full bg-primary transition-[width] duration-500'
                    style={{ width: `${Math.max(0, Math.min(100, fillPct))}%` }}
                />
            </div>
        </div>
    );
}

interface DueSealProps {
    due: number;
    dueLabel: string;
    readyLabel: string;
}

/** A round wax-seal stamp for a deck: shows the due count (accent), or a
 *  "ready" check when nothing is due (success). */
export function DueSeal({ due, dueLabel, readyLabel }: DueSealProps) {
    const ready = due <= 0;
    return (
        <span
            role='status'
            title={ready ? readyLabel : `${due} ${dueLabel}`}
            className={`flex h-12 w-12 rotate-6 shrink-0 select-none flex-col items-center justify-center rounded-full border-[1.5px] ${
                ready
                    ? 'border-success/60 bg-success-subtle text-success'
                    : 'border-primary/70 bg-primary-subtle text-primary'
            }`}
        >
            {ready ? (
                <>
                    <FaCheck className='h-3.5 w-3.5' />
                    <span className='mt-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.14em]'>
                        {readyLabel}
                    </span>
                </>
            ) : (
                <>
                    <span className='font-sans text-base font-bold leading-none tabular-nums'>
                        {due}
                    </span>
                    <span className='mt-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.14em]'>
                        {dueLabel}
                    </span>
                </>
            )}
        </span>
    );
}
