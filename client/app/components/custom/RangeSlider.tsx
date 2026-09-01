//-Path: "TeaChoco-Portfolio/client/src/components/custom/RangeSlider.tsx"
import { useId } from 'react';

type LabelPosition = 'top' | 'left' | 'right';

interface RangeSliderProps {
    label?: string;
    value: number;
    min?: number;
    max: number;
    step?: number;
    className?: string;
    ariaLabel?: string;
    labelPosition?: LabelPosition;
    valueFormatter?: (value: number) => string;
    showValue?: boolean;
    onChange: (value: number) => void;
}

const labelCls =
    'text-sm font-bold tracking-tight text-surface-foreground cursor-pointer whitespace-nowrap';
const valueCls = 'text-xs font-medium whitespace-nowrap text-surface-muted';

export default function RangeSlider({
    label,
    value,
    min = 0,
    max,
    step = 1,
    className,
    ariaLabel,
    labelPosition = 'top',
    valueFormatter,
    showValue = true,
    onChange,
}: RangeSliderProps) {
    const id = useId();
    const progress = max === min ? 0 : ((value - min) / (max - min)) * 100;
    const hasLabel = Boolean(label || (showValue && valueFormatter));

    const labelNode = label ? (
        <label htmlFor={id} className={labelCls}>
            {label}
        </label>
    ) : null;

    const valueNode =
        showValue && valueFormatter ? <span className={valueCls}>{valueFormatter(value)}</span> : null;

    const sliderNode = (
        <input
            id={id}
            type='range'
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label={ariaLabel ?? label}
            className='h-1.5 flex-1 cursor-pointer appearance-none rounded-sm bg-surface-sunken accent-[var(--color-accent)]
                [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent
                [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface
                [&::-webkit-slider-thumb]:transition-colors
                [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface'
            style={{
                background: `linear-gradient(to right, var(--color-accent) ${progress}%, var(--color-border) ${progress}%)`,
            }}
        />
    );

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
