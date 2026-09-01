//-Path: "Vite-React-TypeScript/src/components/custom/Select.tsx"
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa6';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';

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
            className={`w-full px-4 py-3 text-left transition-all flex items-center gap-3 group ${
                selected
                    ? 'font-black text-primary bg-primary/15 hover:bg-primary/20'
                    : 'text-surface-foreground hover:pl-6 hover:bg-primary/10'
            } ${className}`}
        >
            {icon && (
                <span
                    className={`transition-transform duration-300 group-hover:scale-110 ${
                        selected ? 'text-primary' : 'text-surface-foreground'
                    }`}
                >
                    {icon}
                </span>
            )}
            <span className='text-sm tracking-tight'>{String(content)}</span>
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
    options: OptionSelectType<ValueType>[];
    containerClassName?: string;
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
    containerClassName = '',
}: SelectProps<ValueType>) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
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
        'w-full px-5 py-3.5 rounded-2xl border border-border transition-all duration-300 flex items-center justify-between gap-3 text-left shadow-sm hover:shadow-md';

    return (
        <div ref={dropdownRef} className={`relative ${containerClassName}`}>
            {label && (
                <label className={`${labelClass} ${labelClassName}`}>
                    {icon && <span className='text-primary/70'>{icon}</span>}
                    {label}
                    {required && <span className='text-red-500 font-black'>*</span>}
                </label>
            )}

            <button
                type='button'
                onClick={handleToggle}
                className={`${triggerClass} ${className} ${
                    isOpen
                        ? 'border-primary ring-4 ring-primary/10 bg-surface-elevated/50'
                        : 'border-border-foreground bg-surface/20'
                }`}
            >
                <div className='flex items-center gap-3 truncate'>
                    {(selectedOption?.icon || icon) && (
                        <span className='text-primary shrink-0'>
                            {selectedOption?.icon || icon}
                        </span>
                    )}
                    <span
                        className={`text-sm font-medium truncate ${
                            isOpen ? 'text-primary' : 'text-surface-foreground'
                        }`}
                    >
                        {String(displayText)}
                    </span>
                </div>
                <FaChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-500 ${
                        isOpen ? 'rotate-180 text-primary' : 'text-surface-foreground'
                    }`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        transition={{ duration: 0.2 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        className={`absolute z-100 w-full bg-surface-elevated rounded-2xl shadow-2xl border border-border overflow-hidden ${
                            dropdownDirection === 'up' ? 'bottom-full mb-2' : 'mt-2'
                        }`}
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
