// -Path: 'client/app/pages/edit/components/DeckField.tsx'
/** Label styling shared by every field in the deck form. */
const LABEL = 'text-xs font-semibold uppercase tracking-wider text-surface-subtle';

/** Input shell shared by the form's single-line controls, so a new field looks
 *  like the ones beside it without copying the class string. */
export const FIELD_CLASS =
    'w-full rounded-sm border border-line bg-surface px-3 py-2.5 text-sm text-surface-foreground placeholder:text-surface-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60';

/** Textarea shell: the input shell without the manual resize grip. */
export const AREA_CLASS = `${FIELD_CLASS} resize-none`;

/** Props for {@link DeckField}. */
interface DeckFieldProps {
    label: React.ReactNode;
    children: React.ReactNode;
    /** Id of the control the label points at. Omit for composite controls
     *  (a `Select` renders its own button), where the label is a heading. */
    id?: string;
}

/**
 * One labelled row of the deck form. Keeping the label/control pairing in one
 * place makes every field a single block, so adding or removing a property is
 * one entry in `DeckEdit` instead of three copied divs.
 *
 * @param props - The label, the control, and the id the label targets.
 * @returns The rendered field row.
 */
export default function DeckField({ id, label, children }: DeckFieldProps) {
    return (
        <div className='flex flex-col gap-1.5'>
            {id ? (
                <label htmlFor={id} className={LABEL}>
                    {label}
                </label>
            ) : (
                <span className={LABEL}>{label}</span>
            )}
            {children}
        </div>
    );
}
