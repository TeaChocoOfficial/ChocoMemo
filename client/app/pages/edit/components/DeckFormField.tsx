// -Path: 'client/app/pages/edit/components/DeckFormField.tsx'
import Select from '~/components/custom/Select';
import Switch from '~/components/custom/Switch';
import { useTranslation } from 'react-i18next';
import DeckField, { AREA_CLASS, FIELD_CLASS } from './DeckField';
import type { DeckFieldDef } from '~/types/edit';

/** Props for {@link DeckFormField}. */
interface DeckFormFieldProps {
    def: DeckFieldDef;
    /** Renders every control non-interactive, for a deck the viewer cannot edit. */
    disabled?: boolean;
    /** The field's current value; the registry guarantees its type per kind. */
    value: string | boolean;
    onChange: (value: string | boolean) => void;
}

/**
 * Renders one registry field as the control its `kind` names. Keeping the
 * switch here means the deck form stays a loop over `DECK_FORM_FIELDS`: a new
 * property never touches JSX, and a new kind is one branch.
 *
 * @param props - The field definition, its value, and its change sink.
 * @returns The rendered control, wrapped in its label row.
 */
export default function DeckFormField({ def, value, disabled, onChange }: DeckFormFieldProps) {
    const { t } = useTranslation();
    const id = `deck-field-${def.key}`;
    const Icon = def.icon;
    const text = typeof value === 'boolean' ? '' : value;
    const label = (
        <span className='inline-flex items-center gap-1.5'>
            {Icon && <Icon className='h-3 w-3 text-surface-muted' />}
            {t(def.labelKey)}
        </span>
    );
    const placeholder = def.placeholderKey ? t(def.placeholderKey) : undefined;

    if (def.kind === 'switch')
        return (
            <Switch
                label={label}
                checked={value === true}
                disabled={disabled}
                onCheckedChange={(checked) => onChange(checked)}
            />
        );

    if (def.kind === 'select')
        return (
            <DeckField label={label}>
                <Select
                    value={text}
                    disabled={disabled}
                    aria-label={t(def.labelKey)}
                    onChange={(next) => onChange(next)}
                    options={(def.options ?? []).map((option) => ({
                        value: option.value,
                        icon: option.icon ? <option.icon className='h-3.5 w-3.5' /> : undefined,
                        label: t(option.labelKey),
                    }))}
                />
            </DeckField>
        );

    if (def.kind === 'textarea')
        return (
            <DeckField id={id} label={label}>
                <textarea
                    id={id}
                    rows={def.rows ?? 4}
                    value={text}
                    disabled={disabled}
                    className={AREA_CLASS}
                    placeholder={placeholder}
                    onChange={(event) => onChange(event.target.value)}
                />
            </DeckField>
        );

    return (
        <DeckField id={id} label={label}>
            <input
                id={id}
                value={text}
                disabled={disabled}
                className={FIELD_CLASS}
                placeholder={placeholder}
                type={def.inputType ?? 'text'}
                onChange={(event) => onChange(event.target.value)}
            />
        </DeckField>
    );
}
