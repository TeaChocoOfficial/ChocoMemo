// -Path: 'client/app/components/edit/SortableRow.tsx'
import type { ReactNode, HTMLAttributes } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

/**
 * Props to spread onto whatever element a caller uses as the drag handle.
 * Modelled as generic HTML attributes because dnd-kit's attribute and listener
 * bags are individually typed but cannot be intersected (the listener index
 * signature would force every attribute to be a function).
 */
export type SortableHandleProps = HTMLAttributes<HTMLElement>;

/** What a row hands back so the caller can wire its own handle. */
export interface SortableItemContext {
    handleProps: SortableHandleProps;
    isDragging: boolean;
}

/** Props for {@link SortableRow}. */
interface SortableRowProps {
    id: string;
    children: (context: SortableItemContext) => ReactNode;
    className?: string;
}

/**
 * A single sortable `<li>`. Owns the dnd-kit node ref, transform and
 * transition, then hands the handle props to `children` so the caller decides
 * which element is draggable.
 *
 * @param props - Row id, render prop, and optional list-item class.
 * @returns The rendered list item.
 */
export default function SortableRow({ id, children, className = '' }: SortableRowProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

    /** Compose dnd-kit's attributes and listeners into one spreadable bag. */
    const handleProps: SortableHandleProps = { ...attributes, ...listeners } as SortableHandleProps;

    return (
        <li
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={className}
        >
            {children({ handleProps, isDragging })}
        </li>
    );
}
