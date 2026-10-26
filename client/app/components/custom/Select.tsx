// -Path: 'client/app/components/custom/Select.tsx'
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCheck, FaChevronDown } from 'react-icons/fa6';
import { useState, useRef, useEffect, useLayoutEffect, useMemo, isValidElement } from 'react';

/**
 * Whether a label candidate can go straight into the tree. Labels are nodes, so
 * a badge, an icon and text can share one option, but a raw `value` (a number,
 * an enum, an object) still has to be turned into text.
 */
function isRenderable(value: unknown): value is React.ReactNode {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        Array.isArray(value) ||
        isValidElement(value)
    );
}

/** Props for {@link SelectOption}. */
interface SelectOptionProps<ValueType = string> {
    value: ValueType;
    selected?: boolean;
    disabled?: boolean;
    className?: string;
    sizeClass?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    label?: React.ReactNode;
    children?: React.ReactNode;
}

function SelectOption<ValueType>({
    icon,
    label,
    value,
    onClick,
    selected,
    disabled,
    children,
    sizeClass,
    className,
}: SelectOptionProps<ValueType>) {
    const content = children || label || value;

    return (
        <button
            type='button'
            onClick={onClick}
            disabled={disabled}
            className={`w-full text-left flex items-center gap-3 group ${
                sizeClass ?? sizeClasses.md
            } ${
                disabled
                    ? 'cursor-not-allowed text-surface-muted opacity-50'
                    : selected
                      ? 'font-black text-primary-foreground bg-primary hover:bg-primary-emphasis'
                      : 'text-surface-foreground hover:bg-surface-overlay'
            } ${className}`}
        >
            {icon && (
                <span className={`${selected ? 'text-primary-foreground' : 'text-surface-muted'}`}>
                    {icon}
                </span>
            )}
            <span className='tracking-tight'>
                {isRenderable(content) ? content : String(content)}
            </span>
            {selected && <FaCheck className='absolute h-3.5 w-3.5 right-4' />}
        </button>
    );
}

export interface OptionSelectType<ValueType = string> {
    value: ValueType;
    label: React.ReactNode;
    icon?: React.ReactNode;
    /** Shown but not selectable, e.g. a language that isn't ready yet. */
    disabled?: boolean;
}

export interface SelectProps<ValueType = string> {
    value?: ValueType;
    required?: boolean;
    className?: string;
    label?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    placeholder?: string;
    icon?: React.ReactNode;
    labelClassName?: string;
    optionsClassName?: string;
    containerClassName?: string;
    options: OptionSelectType<ValueType>[];
    onChange?: (value: ValueType) => void;
    children?: (
        Option: typeof SelectOption<ValueType>,
        options: OptionSelectType<ValueType>[],
    ) => React.ReactNode;
}

const TRIGGER_GAP = 8;
const VIEWPORT_PAD = 8;
/** Preferred cap on the options list; it shrinks to fit tight viewports. */
const MAX_PANEL_HEIGHT = 256;
/** Never collapse the list below this, even on very short viewports. */
const MIN_PANEL_HEIGHT = 120;

/** Trigger and option sizing, mirroring `custom/Button`: padding plus text size,
 *  so a small Select reads the same as a small Button in the same toolbar. */
const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
};

interface PanelPosition {
    /** Anchored to the top for a downward panel, ignored when `bottom` is set. */
    top?: number;
    /** Anchored to the viewport bottom for an upward panel. */
    bottom?: number;
    left: number;
    minWidth: number;
    maxHeight: number;
}

export default function Select<ValueType>({
    icon,
    label,
    value,
    size = 'md',
    options,
    required,
    children,
    onChange,
    className = '',
    placeholder,
    labelClassName = '',
    optionsClassName = '',
    containerClassName = '',
}: SelectProps<ValueType>) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [panelPos, setPanelPos] = useState<PanelPosition | null>(null);

    const handleToggle = () => setIsOpen((prev) => !prev);

    const selectedOption = useMemo(() => {
        let option = options.find((option) => option.value === value);
        children?.(
            ({
                icon: optionIcon,
                value: optionValue,
                label: optionLabel,
                children: optionChildren,
            }: SelectOptionProps<ValueType>) => {
                if (optionValue === value) {
                    option = {
                        icon: optionIcon,
                        value: optionValue,
                        label: optionLabel ?? (typeof optionChildren === 'string' ? optionChildren : ''),
                    };
                }
                return <></>;
            },
            options,
        );
        return option;
    }, [children, options, value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            // The options panel lives in a portal, so it is NOT inside
            // dropdownRef — both must count as "inside" or picking an
            // option would close the list before its click lands.
            if (!dropdownRef.current?.contains(target) && !optionsRef.current?.contains(target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /* The options panel is portalled to <body> so ancestor scroll/overflow
       containers (nav dropdowns, modals) can never clip it. Position it
       against the trigger's viewport rect and keep it there on scroll/resize. */
    useLayoutEffect(() => {
        if (!isOpen) {
            setPanelPos(null);
            return;
        }

        const place = () => {
            const trigger = dropdownRef.current;
            const panel = optionsRef.current;
            if (!trigger || !panel) return;

            const rect = trigger.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom - TRIGGER_GAP - VIEWPORT_PAD;
            const spaceAbove = rect.top - TRIGGER_GAP - VIEWPORT_PAD;

            // Open toward the roomier side, and cap the list to whatever that
            // side actually offers — so the panel can never grow off-screen.
            const direction = spaceBelow >= spaceAbove ? 'down' : 'up';
            const available = direction === 'down' ? spaceBelow : spaceAbove;
            const maxHeight = Math.max(MIN_PANEL_HEIGHT, Math.min(MAX_PANEL_HEIGHT, available));

            setPanelPos({
                // Anchoring the upward panel to the viewport bottom keeps it
                // correct without needing to measure its height first.
                ...(direction === 'down'
                    ? { top: rect.bottom + TRIGGER_GAP }
                    : { bottom: window.innerHeight - rect.top + TRIGGER_GAP }),
                left: Math.max(
                    VIEWPORT_PAD,
                    Math.min(rect.left, window.innerWidth - panel.offsetWidth - VIEWPORT_PAD),
                ),
                minWidth: rect.width,
                maxHeight,
            });
        };

        place();
        window.addEventListener('scroll', place, true);
        window.addEventListener('resize', place);
        return () => {
            window.removeEventListener('scroll', place, true);
            window.removeEventListener('resize', place);
        };
    }, [isOpen]);

    const handleSelect = (optionValue: ValueType) => {
        if (onChange) onChange(optionValue);
        setIsOpen(false);
    };

    const displayText =
        selectedOption?.label ||
        selectedOption?.value ||
        placeholder ||
        label ||
        t('common.select');
    const labelClass = 'flex gap-2 text-sm font-bold text-surface-foreground mb-2 ml-1';
    const triggerClass = `w-full rounded-sm border bg-surface transition-colors duration-200 flex items-center justify-between gap-3 text-left ${sizeClasses[size]}`;

    return (
        <div ref={dropdownRef} className={`relative ${containerClassName}`}>
            {label && (
                <label className={`${labelClass} ${labelClassName}`}>
                    {icon && <span className='text-primary/80'>{icon}</span>}
                    {label}
                    {required && <span className='text-red-500 font-black'>*</span>}
                </label>
            )}

            <button
                type='button'
                onClick={handleToggle}
                className={`${triggerClass} ${className} ${
                    isOpen ? 'border-primary' : 'border-line'
                }`}
            >
                <div className='flex items-center gap-3 truncate'>
                    {(selectedOption?.icon || icon) && (
                        <span className='text-primary shrink-0'>
                            {selectedOption?.icon || icon}
                        </span>
                    )}
                    <span
                        className={`font-medium truncate ${
                            isOpen ? 'text-primary' : 'text-surface-foreground'
                        }`}
                    >
                        {isRenderable(displayText) ? displayText : String(displayText)}
                    </span>
                </div>
                <FaChevronDown
                    className={`w-3.5 h-3.5 transition-colors duration-200 ${
                        isOpen ? 'rotate-180 text-primary' : 'text-surface-muted'
                    }`}
                />
            </button>

            {typeof document !== 'undefined' &&
                createPortal(
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                key='select-options'
                                ref={optionsRef}
                                transition={{ duration: 0.15 }}
                                exit={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 4 }}
                                style={{
                                    position: 'fixed',
                                    top: panelPos?.top,
                                    bottom: panelPos?.bottom,
                                    left: panelPos?.left ?? 0,
                                    minWidth: panelPos?.minWidth,
                                }}
                                className={`z-100 w-max overflow-hidden rounded-sm border border-line bg-surface-elevated shadow-xl shadow-black/10 ${optionsClassName}`}
                            >
                                <div
                                    className='overflow-y-auto overscroll-contain'
                                    style={{ maxHeight: panelPos?.maxHeight ?? MAX_PANEL_HEIGHT }}
                                >
                                    {children
                                        ? children(
                                              ({
                                                  value: optionValue,
                                                  selected,
                                                  ...optionProps
                                              }) => (
                                                  <SelectOption<ValueType>
                                                      {...optionProps}
                                                      sizeClass={sizeClasses[size]}
                                                      value={optionValue}
                                                      onClick={() => handleSelect(optionValue)}
                                                      selected={selected || value === optionValue}
                                                  />
                                              ),
                                              options,
                                          )
                                        : options.map((option) => (
                                              <SelectOption<ValueType>
                                                  key={String(option.value)}
                                                  {...option}
                                                  sizeClass={sizeClasses[size]}
                                                  selected={value === option.value}
                                                  onClick={() => handleSelect(option.value)}
                                              />
                                          ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </div>
    );
}
