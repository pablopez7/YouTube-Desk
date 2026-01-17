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

// YouTube Logo SVG Component (fallback when no thumbnail)
const YouTubeLogo = () => (
    <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 flex-shrink-0"
        fill="currentColor"
    >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
)

// Tab Icon Component - shows thumbnail or YouTube logo
const TabIcon = ({ thumbnail, isActive }: { thumbnail?: string; isActive: boolean }) => {
    if (thumbnail) {
        return (
            <img
                src={thumbnail}
                alt=""
                className="w-5 h-5 rounded-sm object-cover flex-shrink-0"
                onError={(e) => {
                    // If image fails to load, hide it
                    (e.target as HTMLImageElement).style.display = 'none'
                }}
            />
        )
    }

    return (
        <span className={clsx(
            "transition-colors",
            isActive ? "text-red-500" : "text-gray-500"
        )}>
            <YouTubeLogo />
        </span>
    )
}

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
                "group relative flex items-center gap-1.5 h-[30px] min-w-[100px] max-w-[200px] px-2.5 rounded-t-lg transition-all cursor-default text-[12px] no-drag select-none border-b-2",
                isActive
                    ? "bg-youtube-surface text-white z-10 border-red-500 shadow-lg shadow-red-500/20"
                    : "bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200 border-transparent"
            )}
        >
            {/* Tab Icon (thumbnail or YouTube logo) */}
            <TabIcon thumbnail={tab.thumbnail} isActive={isActive} />

            {/* Tab Title */}
            <div className="flex-1 truncate font-medium pr-4 pointer-events-none">
                {tab.title || 'YouTube'}
            </div>

            {/* Close Button */}
            <button
                className={clsx(
                    "absolute right-1.5 p-0.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all",
                    isActive && "opacity-100"
                )}
                onClick={onClose}
            >
                <X size={12} />
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
                className="flex items-center justify-center w-7 h-7 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors no-drag ml-1"
                title="New Tab"
            >
                <Plus size={16} />
            </button>
        </div>
    )
}
