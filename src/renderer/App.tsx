import { useRef, useEffect } from 'react'
import { TitleBar } from './components/TitleBar'
import { BrowserView } from './components/BrowserView'
import { useAppStore } from './store'
import { extractVideoId } from './utils'

function App() {
    const { tabs, activeTabId, addTab, closeTab } = useAppStore()

    // Use ref to avoid re-registering listener when addTab changes
    const addTabRef = useRef(addTab)
    addTabRef.current = addTab

    // Listen for IPC events to open tab in background
    useEffect(() => {
        // Only register if running in Electron environment
        if (window.electron?.onOpenTab) {
            const unsubscribe = window.electron.onOpenTab(async (url) => {
                console.log('[App] on-open-tab received:', url)

                // Extract video ID to fetch title and thumbnail IMMEDIATELY
                const videoId = extractVideoId(url)
                let title = 'YouTube'
                let thumbnail: string | undefined

                if (videoId && window.electron?.getVideoTitle) {
                    console.log('[App] Fetching info for new tab video:', videoId)
                    try {
                        const result = await window.electron.getVideoTitle(videoId)
                        if (result) {
                            title = result.title || 'YouTube'
                            thumbnail = result.thumbnail || undefined
                            console.log('[App] Got info for new tab:', title, thumbnail)
                        }
                    } catch (e) {
                        console.warn('[App] Failed to fetch info for new tab:', e)
                    }
                }

                // Create the tab with the correct title and thumbnail (in background)
                addTabRef.current(url, false, title, thumbnail)
            })
            return unsubscribe
        }
    }, []) // Empty deps - register only once

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault()
                addTab()
            }
            if (e.ctrlKey && e.key === 'w') {
                e.preventDefault()
                if (activeTabId) closeTab(activeTabId)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [addTab, closeTab, activeTabId])

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-youtube-base">
            <TitleBar />
            <div className="flex-1 relative overflow-hidden">
                {tabs.map(tab => (
                    <BrowserView key={tab.id} tab={tab} isActive={tab.id === activeTabId} />
                ))}
            </div>
        </div>
    )
}

export default App
