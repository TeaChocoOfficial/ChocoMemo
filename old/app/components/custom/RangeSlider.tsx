//-Path: "TeaChoco-Portfolio/client/src/components/custom/RangeSlider.tsx"
import { useId, useMemo } from 'react';

type LabelPosition = 'top' | 'left' | 'right';
type SliderVariant = 'line' | 'bar' | 'ticks';

interface RangeSliderProps {
    max: number;
    min?: number;
    step?: number;
    value: number;
    label?: string;
    className?: string;
    ariaLabel?: string;
    showValue?: boolean;
    variant?: SliderVariant;
    labelPosition?: LabelPosition;
    onChange: (value: number) => void;
    valueFormatter?: (value: number) => string;
}

const labelCls =
    'text-sm font-bold tracking-tight text-surface-foreground cursor-pointer whitespace-nowrap';
const valueCls = 'text-xs font-medium whitespace-nowrap text-surface-muted tabular-nums';

/** Shared classes that neutralize the native range input's track/thumb
 *  so only our custom flat visuals show, while keeping the element itself
 *  focusable/visible for the app-wide :focus-visible outline. */
const nativeInputCls =
    'absolute inset-0 w-full h-full m-0 cursor-pointer appearance-none bg-transparent z-10 ' +
    '[&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-4 ' +
    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-transparent ' +
    '[&::-moz-range-track]:bg-transparent [&::-moz-range-track]:h-4 ' +
    '[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:border-none';

/** Caps the visual segment count for the "ticks" variant — a slider with
 *  200 steps would render 200 tiny bars and look like noise, so anything
 *  above this falls back to evenly-spaced display segments instead of
 *  one segment per step. */
const MAX_TICK_SEGMENTS = 24;

export default function RangeSlider({
    label,
    value,
    min = 0,
    max,
    step = 1,
    className,
    ariaLabel,
    variant = 'bar',
    labelPosition = 'top',
    valueFormatter,
    showValue = true,
    onChange,
}: RangeSliderProps) {
    const id = useId();
    const progress = max === min ? 0 : ((value - min) / (max - min)) * 100;
    const hasLabel = Boolean(label || (showValue && valueFormatter));

    const tickSegments = useMemo(() => {
        const rawSteps = Math.round((max - min) / (step || 1));
        return Math.min(Math.max(rawSteps, 2), MAX_TICK_SEGMENTS);
    }, [min, max, step]);

    const labelNode = label ? (
        <label htmlFor={id} className={labelCls}>
            {label}
        </label>
    ) : null;

    const valueNode =
        showValue && valueFormatter ? (
            <span className={valueCls}>{valueFormatter(value)}</span>
        ) : null;

    const inputNode = (
        <input
            id={id}
            type='range'
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label={ariaLabel ?? label}
            className={nativeInputCls}
        />
    );

    let sliderNode: React.ReactNode;

    if (variant === 'line') {
        sliderNode = (
            <div className='group relative flex-1 h-4 flex items-center'>
                <div className='absolute inset-x-0 h-px bg-line' />
                <div
                    className='absolute left-0 h-px bg-primary group-hover:bg-primary-emphasis transition-colors'
                    style={{ width: `${progress}%` }}
                />
                <div
                    className='absolute top-1/2 w-[2px] h-3 -translate-y-1/2 -translate-x-1/2 bg-primary
                        group-hover:bg-primary-emphasis transition-colors pointer-events-none'
                    style={{ left: `${progress}%` }}
                />
                {inputNode}
            </div>
        );
    } else if (variant === 'ticks') {
        sliderNode = (
            <div className='group relative flex-1 h-5 flex items-center gap-1'>
                {Array.from({ length: tickSegments }).map((_, i) => {
                    const segmentThreshold = (i / (tickSegments - 1)) * 100;
                    const filled = segmentThreshold <= progress;
                    return (
                        <div
                            key={i}
                            className={`flex-1 h-3 rounded-sm transition-colors ${
                                filled
                                    ? 'bg-primary group-hover:bg-primary-emphasis'
                                    : 'bg-surface-sunken'
                            }`}
                        />
                    );
                })}
                {inputNode}
            </div>
        );
    } else {
        // 'bar' — default
        sliderNode = (
            <div className='group relative flex-1 h-6 flex items-center'>
                <div className='absolute inset-x-0 h-2 rounded-sm bg-surface-sunken' />
                <div
                    className='absolute left-0 h-2 rounded-sm bg-primary group-hover:bg-primary-emphasis transition-colors'
                    style={{ width: `${progress}%` }}
                />
                <div
                    className='absolute top-1/2 w-3 h-6 -translate-y-1/2 -translate-x-1/2 bg-surface
                        border-2 border-primary group-hover:border-primary-emphasis rounded-sm
                        transition-colors pointer-events-none'
                    style={{ left: `${progress}%` }}
                />
                {inputNode}
            </div>
        );
    }

    if (labelPosition === 'right') {
        return (
            <div className={`flex items-center gap-3 ${className || ''}`}>
                {labelNode}
                {sliderNode}
                {valueNode}
            </div>
        );
    }

    if (labelPosition === 'left') {
        return (
            <div className={`flex items-center gap-3 ${className || ''}`}>
                {valueNode}
                {sliderNode}
                {labelNode}
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-2 ${className || ''}`}>
            {hasLabel && (
                <div className='flex items-center justify-between gap-3'>
                    {labelNode}
                    {valueNode}
                </div>
            )}
            {sliderNode}
        </div>
    );
}
