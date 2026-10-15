// -Path: 'client/app/components/edit/SortableList.tsx'
import {
    useSensor,
    DndContext,
    useSensors,
    type DragEndEvent,
    PointerSensor,
    closestCenter,
    KeyboardSensor,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { type ReactNode } from 'react';
import SortableRow from './SortableRow';
import type { SortableItemContext } from './SortableRow';

/** Props for {@link SortableList}. */
interface SortableListProps<T extends { id: string }> {
    items: T[];
    onReorder: (ids: string[]) => void;
    renderItem: (item: T, context: SortableItemContext) => ReactNode;
    className?: string;
}

/**
 * A vertical drag-and-drop list built on dnd-kit. It only knows about `id`s —
 * callers decide how a row looks and what a reorder means — which is what lets
 * every language track reuse the same list.
 *
 * @param props - The items, the reorder sink, and the row renderer.
 * @returns The rendered sortable list.
 */
export default function SortableList<T extends { id: string }>({
    items,
    onReorder,
    renderItem,
    className = '',
}: SortableListProps<T>) {
    /** Pointer plus keyboard activators, so reordering works without a mouse. */
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const ids = items.map((item) => item.id);

    /** Turns a finished drag into an id order, then lets the caller persist it. */
    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;
        const from = items.findIndex((item) => item.id === active.id);
        const to = items.findIndex((item) => item.id === over.id);
        if (from === -1 || to === -1) return;
        onReorder(arrayMove(items, from, to).map((item) => item.id));
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                <ul className={className}>
                    {items.map((item) => (
                        <SortableRow key={item.id} id={item.id}>
                            {(context) => renderItem(item, context)}
                        </SortableRow>
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
}
