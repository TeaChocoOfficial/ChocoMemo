export default function OtpInput({
    value,
    onChange,
    disabled,
    autoFocus,
}: {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    autoFocus?: boolean;
}) {
    const inputClass =
        'w-full rounded-sm border border-line bg-surface px-3 py-2.5 text-center text-xl tracking-[0.5em] text-sm text-surface-foreground placeholder:text-surface-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

    return (
        <input
            type='text'
            inputMode='numeric'
            autoComplete='one-time-code'
            maxLength={6}
            required
            autoFocus={autoFocus}
            disabled={disabled}
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className={inputClass}
            placeholder='••••••'
        />
    );
}