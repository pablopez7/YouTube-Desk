import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Tab {
    id: string
    title: string
    url: string
    isLoading?: boolean
    thumbnail?: string  // Video thumbnail URL from oEmbed
    zoomLevel?: number  // Zoom factor (1.0 = 100%)
}

// Separate state for the active tab's capabilities (not persisted)
interface ActiveTabState {
    canGoBack: boolean
    canGoForward: boolean
    isLoading: boolean
}

type NavigationAction = 'back' | 'forward' | 'reload' | 'zoomIn' | 'zoomOut' | null

interface AppState {
    tabs: Tab[]
    activeTabId: string | null

    // Navigation Bridge
    navigationSignal: { action: NavigationAction, id: string } // id is random to trigger effect
    activeTabState: ActiveTabState

    addTab: (url?: string, active?: boolean, title?: string, thumbnail?: string) => void
    closeTab: (id: string) => void
    setActiveTab: (id: string) => void
    updateTab: (id: string, data: Partial<Tab>) => void
    reorderTabs: (newTabs: Tab[]) => void

    // Actions called by TitleBar
    triggerNavigation: (action: NavigationAction) => void
    // Actions called by BrowserView
    updateActiveTabState: (state: Partial<ActiveTabState>) => void
}

const DEFAULT_TAB: Tab = { id: '1', title: 'YouTube', url: 'https://www.youtube.com' }

// Validate and fix corrupted data from localStorage
const validateTabs = (tabs: any[]): Tab[] => {
    if (!Array.isArray(tabs) || tabs.length === 0) {
        return [{ ...DEFAULT_TAB, id: crypto.randomUUID() }]
    }
    return tabs.filter(t => t && typeof t.id === 'string' && typeof t.url === 'string' && t.url.length > 0)
        .map(t => ({
            id: t.id,
            title: t.title || 'YouTube',
            url: t.url || 'https://www.youtube.com',
            isLoading: false,
            thumbnail: t.thumbnail,
            zoomLevel: t.zoomLevel
        }))
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            tabs: [DEFAULT_TAB],
            activeTabId: '1',

            navigationSignal: { action: null, id: '' },
            activeTabState: { canGoBack: false, canGoForward: false, isLoading: false },

            addTab: (url = 'https://www.youtube.com', active = true, title = 'YouTube', thumbnail?: string) => {
                const newTab: Tab = {
                    id: crypto.randomUUID(),
                    title,
                    url,
                    thumbnail,
                }
                set((state) => ({
                    tabs: [...state.tabs, newTab],
                    activeTabId: active ? newTab.id : state.activeTabId,
                    activeTabState: active ? { canGoBack: false, canGoForward: false, isLoading: true } : state.activeTabState
                }))
            },

            closeTab: (id) => {
                set((state) => {
                    const newTabs = state.tabs.filter((t) => t.id !== id)
                    let newActiveId = state.activeTabId

                    if (id === state.activeTabId) {
                        newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null
                    }

                    if (newTabs.length === 0) {
                        const defaultTab = { id: crypto.randomUUID(), title: 'YouTube', url: 'https://www.youtube.com' }
                        return { tabs: [defaultTab], activeTabId: defaultTab.id, activeTabState: { canGoBack: false, canGoForward: false, isLoading: false } }
                    }

                    return { tabs: newTabs, activeTabId: newActiveId }
                })
            },

            setActiveTab: (id) => set({ activeTabId: id }), // BrowserView will sync state when active

            updateTab: (id, data) =>
                set((state) => ({
                    tabs: state.tabs.map((t) => (t.id === id ? { ...t, ...data } : t)),
                })),

            reorderTabs: (newTabs) => set({ tabs: newTabs }),

            triggerNavigation: (action) => set({ navigationSignal: { action, id: crypto.randomUUID() } }),

            updateActiveTabState: (data) => set((state) => ({ activeTabState: { ...state.activeTabState, ...data } }))
        }),
        {
            name: 'yt-app-storage',
            partialize: (state) => ({ tabs: state.tabs, activeTabId: state.activeTabId }),
            // Validate data when loading from localStorage
            onRehydrateStorage: () => (state) => {
                if (state) {
                    const validTabs = validateTabs(state.tabs)
                    state.tabs = validTabs
                    // Ensure activeTabId is valid
                    if (!validTabs.find(t => t.id === state.activeTabId)) {
                        state.activeTabId = validTabs[0]?.id || null
                    }
                    console.log('[Store] Rehydrated with', validTabs.length, 'valid tabs')
                }
            }
        }
    )
)
