// -Path: 'client/app/components/custom/SetTabs.tsx'
import { useId } from 'react';
import { motion } from 'framer-motion';

/** One tab: its id, its label, an optional leading icon and trailing note. */
export interface SetTabOption<
    Value extends string | number = string | number,
    Id extends string = string,
> {
    id: Id;
    label?: Value;
    icon?: React.ReactNode;
    /** Extra node after the label — a live count, a badge, a unit. */
    hint?: React.ReactNode;
}

type SetTabsVariant = 'pill' | 'underline';

/** Props for {@link SetTabs}. */
interface SetTabsProps<T extends SetTabOption = SetTabOption> {
    /** Id of the selected tab. */
    active: string;
    /** The tabs to render, in order. */
    options: T[];
    /** Tab shape: filled pills, or labels over a rule. */
    variant?: SetTabsVariant;
    /** Extra classes for the tab strip (width, scrolling, spacing). */
    className?: string;
    /** Accessible name for the tab list, when the tabs need one. */
    ariaLabel?: string;
    /** Fired with the clicked tab. */
    onChange: (set: T) => void;
}

/**
 * The shared tab strip (character sets, groups, deck sources). One instance per
 * strip: the moving indicator is keyed by `useId`, so two strips on one page
 * never animate into each other.
 *
 * @param props - The active id, the tabs, their shape, and the change handler.
 * @returns The rendered tab strip.
 */
export default function SetTabs<T extends SetTabOption>({
    active,
    onChange,
    options,
    variant = 'pill',
    className,
    ariaLabel,
}: SetTabsProps<T>) {
    // Scoped per instance — a hardcoded layoutId would make two SetTabs
    // rendered on the same page animate into each other's position.
    const instanceId = useId();
    const indicatorLayoutId = `set-tabs-${instanceId}`;

    const isUnderline = variant === 'underline';

    return (
        <div
            role='tablist'
            aria-label={ariaLabel}
            className={`inline-flex items-center ${
                isUnderline
                    ? 'gap-6 border-b border-line'
                    : 'gap-1 p-1 rounded-sm bg-surface-overlay border border-line'
            } ${className || ''}`}
        >
            {options.map((option) => {
                const isActive = option.id === active;
                return (
                    <button
                        type='button'
                        key={option.id}
                        role='tab'
                        aria-selected={isActive}
                        onClick={() => onChange(option)}
                        className={`relative flex items-center gap-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                            isUnderline
                                ? `pb-3 ${isActive ? 'text-primary' : 'text-surface-muted hover:text-surface-foreground'}`
                                : `px-5 py-2 rounded-sm ${
                                      isActive
                                          ? 'text-primary-foreground'
                                          : 'text-surface-muted hover:text-surface-foreground'
                                  }`
                        }`}
                    >
                        {!isUnderline && isActive && (
                            <motion.span
                                layoutId={indicatorLayoutId}
                                className='absolute inset-0 rounded-sm bg-primary'
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className='relative z-10 flex items-center gap-2'>
                            {option.icon}
                            {option.label ?? option.id}
                            {option.hint}
                        </span>
                        {isUnderline && isActive && (
                            <motion.span
                                layoutId={indicatorLayoutId}
                                className='absolute left-0 right-0 -bottom-px h-0.5 bg-primary'
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
