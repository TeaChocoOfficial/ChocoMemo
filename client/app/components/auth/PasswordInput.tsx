import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa6';

export default function PasswordInput({
    value,
    visible,
    onChange,
    onToggle,
    className,
    placeholder,
}: {
    value: string;
    visible: boolean;
    className?: string;
    placeholder: string;
    onToggle: () => void;
    onChange: (value: string) => void;
}) {
    return (
        <div className='relative'>
            <FaLock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-muted' />
            <input
                required
                value={value}
                placeholder={placeholder}
                type={visible ? 'text' : 'password'}
                className={`${className} pl-10 pr-12`}
                onChange={(e) => onChange(e.target.value)}
            />
            <button
                type='button'
                onClick={() => onToggle()}
                className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-surface-muted hover:text-accent'
                aria-label={visible ? 'Hide password' : 'Show password'}
            >
                {visible ? <FaEyeSlash className='h-4 w-4' /> : <FaEye className='h-4 w-4' />}
            </button>
        </div>
    );
}
