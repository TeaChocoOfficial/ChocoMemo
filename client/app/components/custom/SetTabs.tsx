//-Path: "client/app/components/custom/SetTabs.tsx"
import { useId } from 'react';
import { motion } from 'framer-motion';

export interface SetTabOption<
    Value extends string | number = string | number,
    Id extends string = string,
> {
    id: Id;
    label?: Value;
    icon?: React.ReactNode;
}

type SetTabsVariant = 'pill' | 'underline';

interface SetTabsProps<T extends SetTabOption = SetTabOption> {
    active: string;
    options: T[];
    variant?: SetTabsVariant;
    className?: string;
    onChange: (set: T) => void;
}

export default function SetTabs<T extends SetTabOption>({
    active,
    onChange,
    options,
    variant = 'pill',
    className,
}: SetTabsProps<T>) {
    // Scoped per instance — a hardcoded layoutId would make two SetTabs
    // rendered on the same page animate into each other's position.
    const instanceId = useId();
    const indicatorLayoutId = `set-tabs-${instanceId}`;

    const isUnderline = variant === 'underline';

    return (
        <div
            role='tablist'
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
                                ? `pb-3 ${isActive ? 'text-accent' : 'text-surface-muted hover:text-surface-foreground'}`
                                : `px-5 py-2 rounded-sm ${
                                      isActive
                                          ? 'text-accent-foreground'
                                          : 'text-surface-muted hover:text-surface-foreground'
                                  }`
                        }`}
                    >
                        {!isUnderline && isActive && (
                            <motion.span
                                layoutId={indicatorLayoutId}
                                className='absolute inset-0 rounded-sm bg-accent'
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className='relative z-10 flex items-center gap-2'>
                            {option.icon}
                            {option.label ?? option.id}
                        </span>
                        {isUnderline && isActive && (
                            <motion.span
                                layoutId={indicatorLayoutId}
                                className='absolute left-0 right-0 -bottom-px h-[2px] bg-accent'
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
