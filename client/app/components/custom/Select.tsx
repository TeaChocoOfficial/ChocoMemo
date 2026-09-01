//-Path: "Vite-React-TypeScript/src/components/custom/Select.tsx"
import { useTranslation } from 'react-i18next';
import { FaCheck, FaChevronDown } from 'react-icons/fa6';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';

interface SelectOptionProps<ValueType = string> {
    value: ValueType;
    label?: string;
    selected?: boolean;
    className?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    children?: React.ReactNode;
}

function SelectOption<ValueType>({
    icon,
    label,
    value,
    onClick,
    selected,
    children,
    className,
}: SelectOptionProps<ValueType>) {
    const content = children || label || value;

    return (
        <button
            type='button'
            onClick={onClick}
            className={`w-full px-4 py-3 text-left flex items-center gap-3 group ${
                selected
                    ? 'font-black text-accent-foreground bg-accent hover:bg-accent-emphasis'
                    : 'text-surface-foreground hover:bg-surface-overlay'
            } ${className}`}
        >
            {icon && (
                <span
                    className={`${
                        selected ? 'text-accent-foreground' : 'text-surface-muted'
                    }`}
                >
                    {icon}
                </span>
            )}
            <span className='text-sm tracking-tight'>{String(content)}</span>
            {selected && <FaCheck className='absolute h-3.5 w-3.5 right-4' />}
        </button>
    );
}

export interface OptionSelectType<ValueType = string> {
    value: ValueType;
    label: string;
    icon?: React.ReactNode;
}

export interface SelectProps<ValueType = string> {
    label?: string;
    value?: ValueType;
    required?: boolean;
    className?: string;
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

export default function Select<ValueType>({
    icon,
    label,
    value,
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
    const [dropdownAlign, setDropdownAlign] = useState<'none' | 'left' | 'right'>('none');
    const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');

    const handleToggle = () => {
        if (!isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            setDropdownDirection(spaceBelow < 200 && spaceAbove > spaceBelow ? 'up' : 'down');
        }
        setIsOpen((prev) => !prev);
    };

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
                        label: (optionLabel ??
                            (typeof optionChildren === 'string' ? optionChildren : '')) as string,
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
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
                setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useLayoutEffect(() => {
        if (isOpen && optionsRef.current) {
            const rect = optionsRef.current.getBoundingClientRect();
            setDropdownAlign(
                rect.right > window.innerWidth
                    ? 'right'
                    : rect.left > window.innerWidth
                      ? 'left'
                      : 'none',
            );
        }
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
    const triggerClass =
        'w-full px-4 py-3 rounded-sm border bg-surface transition-colors duration-200 flex items-center justify-between gap-3 text-left';

    return (
        <div ref={dropdownRef} className={`relative ${containerClassName}`}>
            {label && (
                <label className={`${labelClass} ${labelClassName}`}>
                    {icon && <span className='text-accent/80'>{icon}</span>}
                    {label}
                    {required && <span className='text-red-500 font-black'>*</span>}
                </label>
            )}

            <button
                type='button'
                onClick={handleToggle}
                className={`${triggerClass} ${className} ${
                    isOpen ? 'border-accent' : 'border-line'
                }`}
            >
                <div className='flex items-center gap-3 truncate'>
                    {(selectedOption?.icon || icon) && (
                        <span className='text-accent shrink-0'>
                            {selectedOption?.icon || icon}
                        </span>
                    )}
                    <span
                        className={`text-sm font-medium truncate ${
                            isOpen ? 'text-accent' : 'text-surface-foreground'
                        }`}
                    >
                        {String(displayText)}
                    </span>
                </div>
                <FaChevronDown
                    className={`w-3.5 h-3.5 transition-colors duration-200 ${
                        isOpen ? 'rotate-180 text-accent' : 'text-surface-muted'
                    }`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={optionsRef}
                        transition={{ duration: 0.15 }}
                        exit={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 4 }}
                        className={`absolute z-100 min-w-full w-max bg-surface-elevated rounded-sm border border-line overflow-hidden ${
                            dropdownDirection === 'up' ? 'bottom-full mb-2' : 'mt-2'
                        } ${dropdownAlign === 'right' ? 'right-0' : dropdownAlign === 'left' ? 'left-0' : ''} ${optionsClassName}`}
                    >
                        <div className='max-h-64 overflow-y-auto'>
                            {children
                                ? children(
                                      ({ value: optionValue, selected, ...optionProps }) => (
                                          <SelectOption<ValueType>
                                              {...optionProps}
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
                                          selected={value === option.value}
                                          onClick={() => handleSelect(option.value)}
                                      />
                                  ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
