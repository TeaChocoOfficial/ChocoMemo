// -Path: "TeaChoco-Portfolio/client/src/pages/favorites/components/StarRating.tsx"
import { useId } from 'react';

type Props = {
    max?: number;
    color?: string;
    rating: number;
    showNumber?: boolean;
    type?: 'heart' | 'star';
};

const HEART_PATH =
    'M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z';

const STAR_PATH =
    'M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-67.5 128.3 67.5c10.8 5.7 23.9 4.8 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 226c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z';

const EMPTY_COLOR = 'rgba(128,128,128,0.4)';

/**
 * Renders a star or heart with an arbitrary fractional fill (0..1) by clipping
 * the colored fill to the left `fill` fraction over a neutral outline base.
 */
function FractionalIcon({
    type,
    fill,
    color,
}: {
    type: 'heart' | 'star';
    fill: number;
    color: string;
}) {
    const clipId = useId();
    const path = type === 'heart' ? HEART_PATH : STAR_PATH;
    const viewBox = type === 'heart' ? '0 0 512 512' : '0 0 576 512';
    const percentage = Math.max(0, Math.min(1, fill)) * 100;

    return (
        <svg
            viewBox={viewBox}
            aria-hidden='true'
            className='w-[1em] h-[1em] inline-block text-sm'
        >
            <defs>
                <clipPath id={clipId}>
                    <rect x='0' y='0' width={`${percentage}%`} height='100%' />
                </clipPath>
            </defs>
            <g stroke={EMPTY_COLOR} strokeWidth={type === 'heart' ? '40' : '60'} strokeLinejoin='round' strokeLinecap='round'>
                <path d={path} fill='none' />
                <path d={path} fill={color} clipPath={`url(#${clipId})`} stroke='none' />
            </g>
        </svg>
    );
}

export default function Rating({
    type = 'star',
    rating,
    color,
    max = 5,
    showNumber = true,
}: Props) {
    const display = (Math.floor(rating * 10) / 10).toFixed(1);
    const styleColor = color ?? (type === 'heart' ? '#ff6666' : '#f59e0b');

    return (
        <div className='flex items-center gap-2' aria-label={`${rating} / ${max}`}>
            <div className='flex items-center gap-0.5'>
                {Array.from({ length: max }, (_, i) => {
                    const fill = Math.max(0, Math.min(1, rating - i));
                    return <FractionalIcon key={i} type={type} fill={fill} color={styleColor} />;
                })}
            </div>
            {showNumber && (
                <span className='text-sm font-medium text-surface-muted'>
                    {display}
                </span>
            )}
        </div>
    );
}
