import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from './store'

describe('useAppStore', () => {
    beforeEach(() => {
        // Reset store to initial state before each test
        useAppStore.setState({
            tabs: [{ id: '1', title: 'YouTube', url: 'https://www.youtube.com' }],
            activeTabId: '1',
            navigationSignal: { action: null, id: '' },
            activeTabState: { canGoBack: false, canGoForward: false, isLoading: false }
        })
    })

    describe('addTab', () => {
        it('adds a new tab with default URL', () => {
            const { addTab, tabs } = useAppStore.getState()
            const initialCount = tabs.length

            addTab()

            const { tabs: newTabs } = useAppStore.getState()
            expect(newTabs.length).toBe(initialCount + 1)
            expect(newTabs[newTabs.length - 1].url).toBe('https://www.youtube.com')
        })

        it('adds a new tab with custom URL', () => {
            const { addTab } = useAppStore.getState()
            const customUrl = 'https://www.youtube.com/watch?v=test123'

            addTab(customUrl)

            const { tabs } = useAppStore.getState()
            expect(tabs[tabs.length - 1].url).toBe(customUrl)
        })

        it('sets new tab as active by default', () => {
            const { addTab } = useAppStore.getState()

            addTab()

            const { tabs, activeTabId } = useAppStore.getState()
            expect(activeTabId).toBe(tabs[tabs.length - 1].id)
        })

        it('does not set new tab as active when active=false', () => {
            const { addTab, activeTabId: originalActiveId } = useAppStore.getState()

            addTab('https://www.youtube.com', false)

            const { activeTabId } = useAppStore.getState()
            expect(activeTabId).toBe(originalActiveId)
        })

        it('sets custom title and thumbnail', () => {
            const { addTab } = useAppStore.getState()

            addTab('https://www.youtube.com/watch?v=test', true, 'Custom Title', 'https://img.youtube.com/test.jpg')

            const { tabs } = useAppStore.getState()
            const newTab = tabs[tabs.length - 1]
            expect(newTab.title).toBe('Custom Title')
            expect(newTab.thumbnail).toBe('https://img.youtube.com/test.jpg')
        })
    })

    describe('closeTab', () => {
        it('removes the specified tab', () => {
            const { addTab } = useAppStore.getState()
            addTab()
            const { tabs: beforeClose } = useAppStore.getState()
            const tabToClose = beforeClose[beforeClose.length - 1].id

            const { closeTab } = useAppStore.getState()
            closeTab(tabToClose)

            const { tabs } = useAppStore.getState()
            expect(tabs.find(t => t.id === tabToClose)).toBeUndefined()
        })

        it('switches active tab when closing active tab', () => {
            const { addTab } = useAppStore.getState()
            addTab()
            const { tabs: beforeClose, activeTabId: activeId } = useAppStore.getState()
            expect(beforeClose.length).toBe(2)

            const { closeTab } = useAppStore.getState()
            closeTab(activeId!)

            const { activeTabId } = useAppStore.getState()
            expect(activeTabId).not.toBe(activeId)
            expect(activeTabId).not.toBeNull()
        })

        it('creates a new default tab when closing last tab', () => {
            const { tabs, closeTab } = useAppStore.getState()
            expect(tabs.length).toBe(1)

            closeTab(tabs[0].id)

            const { tabs: newTabs } = useAppStore.getState()
            expect(newTabs.length).toBe(1)
            expect(newTabs[0].url).toBe('https://www.youtube.com')
        })
    })

    describe('setActiveTab', () => {
        it('changes the active tab', () => {
            const { addTab } = useAppStore.getState()
            addTab('https://www.youtube.com/watch?v=test', false)

            const { tabs, setActiveTab } = useAppStore.getState()
            const newActiveId = tabs[tabs.length - 1].id

            setActiveTab(newActiveId)

            const { activeTabId } = useAppStore.getState()
            expect(activeTabId).toBe(newActiveId)
        })
    })

    describe('updateTab', () => {
        it('updates tab properties', () => {
            const { tabs, updateTab } = useAppStore.getState()
            const tabId = tabs[0].id

            updateTab(tabId, { title: 'Updated Title', isLoading: true })

            const { tabs: updatedTabs } = useAppStore.getState()
            const updatedTab = updatedTabs.find(t => t.id === tabId)
            expect(updatedTab?.title).toBe('Updated Title')
            expect(updatedTab?.isLoading).toBe(true)
        })
    })

    describe('reorderTabs', () => {
        it('updates tabs order', () => {
            const { addTab } = useAppStore.getState()
            addTab()
            addTab()
            const { tabs } = useAppStore.getState()
            expect(tabs.length).toBe(3)

            const reversed = [...tabs].reverse()
            const { reorderTabs } = useAppStore.getState()
            reorderTabs(reversed)

            const { tabs: reordered } = useAppStore.getState()
            expect(reordered[0].id).toBe(tabs[2].id)
            expect(reordered[2].id).toBe(tabs[0].id)
        })
    })

    describe('triggerNavigation', () => {
        it('sets navigation signal with unique ID', () => {
            const { triggerNavigation } = useAppStore.getState()

            triggerNavigation('back')

            const { navigationSignal } = useAppStore.getState()
            expect(navigationSignal.action).toBe('back')
            expect(navigationSignal.id).toBeTruthy()
        })
    })
})
