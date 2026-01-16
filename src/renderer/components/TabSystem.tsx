import React from 'react'
import { useAppStore } from '../store'
import { X, Plus } from 'lucide-react'
import { clsx } from 'clsx'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// --- Single Tab Component ---
function SortableTab({ tab, isActive, onActivate, onClose }: { tab: any, isActive: boolean, onActivate: () => void, onClose: (e: React.MouseEvent) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: tab.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onActivate}
            className={clsx(
                "group relative flex items-center h-[26px] min-w-[70px] max-w-[150px] px-2 rounded-t-md transition-colors cursor-default text-[11px] no-drag select-none",
                isActive ? "bg-youtube-surface text-white z-10" : "bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200"
            )}
        >
            <div className="flex-1 truncate font-medium pr-4 pointer-events-none">
                {tab.title || 'YouTube'}
            </div>

            <button
                className={clsx(
                    "absolute right-1 p-0.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all",
                    isActive && "opacity-100"
                )}
                onClick={onClose}
            >
                <X size={10} />
            </button>
        </div>
    )
}

// --- Tab System Component ---
export const TabSystem: React.FC = () => {
    const { tabs, activeTabId, reorderTabs, setActiveTab, closeTab, addTab } = useAppStore()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = tabs.findIndex((t) => t.id === active.id);
            const newIndex = tabs.findIndex((t) => t.id === over.id);
            reorderTabs(arrayMove(tabs, oldIndex, newIndex));
        }
    }

    return (
        <div className="flex h-full items-end gap-0.5 w-full overflow-hidden pl-1">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={tabs.map(t => t.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    {tabs.map((tab) => (
                        <SortableTab
                            key={tab.id}
                            tab={tab}
                            isActive={activeTabId === tab.id}
                            onActivate={() => setActiveTab(tab.id)}
                            onClose={(e) => {
                                e.stopPropagation();
                                closeTab(tab.id);
                            }}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <button
                onClick={() => addTab()}
                className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors no-drag"
                title="New Tab"
            >
                <Plus size={14} />
            </button>
        </div>
    )
}
