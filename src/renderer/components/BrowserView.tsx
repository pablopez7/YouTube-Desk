import React, { useEffect, useRef, useState } from 'react'
import { Tab, useAppStore } from '../store'
import { clsx } from 'clsx'

interface BrowserViewProps {
    tab: Tab
    isActive: boolean
}

export const BrowserView: React.FC<BrowserViewProps> = ({ tab, isActive }) => {
    const webviewRef = useRef<Electron.WebviewTag>(null)
    const updateTab = useAppStore(s => s.updateTab)
    const updateActiveTabState = useAppStore(s => s.updateActiveTabState)
    const navigationSignal = useAppStore(s => s.navigationSignal)

    // Track if tab has EVER been active (for lazy loading)
    // Start with true for initial active tab, false for background tabs
    const [shouldRender, setShouldRender] = useState(false)
    const initializedRef = useRef(false)

    // Initialize: If this is the first active tab, render it. Otherwise wait.
    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true
            // Only render immediately if this is the active tab on mount
            if (isActive) {
                setShouldRender(true)
            }
        }
    }, [])

    // When tab becomes active, trigger rendering
    useEffect(() => {
        if (isActive && !shouldRender) {
            setShouldRender(true)
        }
    }, [isActive, shouldRender])

    // Sync Active Tab State
    const syncState = () => {
        if (!webviewRef.current || !isActive) return
        updateActiveTabState({
            canGoBack: webviewRef.current.canGoBack(),
            canGoForward: webviewRef.current.canGoForward(),
            isLoading: webviewRef.current.isLoading()
        })
    }

    // Effect: Handle Navigation Signals (Only if active)
    useEffect(() => {
        if (!isActive || !webviewRef.current) return

        switch (navigationSignal.action) {
            case 'back':
                webviewRef.current.goBack()
                break
            case 'forward':
                webviewRef.current.goForward()
                break
            case 'reload':
                webviewRef.current.reload()
                break
            case 'zoomIn':
                webviewRef.current.setZoomFactor(webviewRef.current.getZoomFactor() + 0.1)
                break
            case 'zoomOut':
                webviewRef.current.setZoomFactor(webviewRef.current.getZoomFactor() - 0.1)
                break
        }
    }, [navigationSignal])

    useEffect(() => {
        const webview = webviewRef.current
        if (!webview) return

        const handleDidStartLoading = () => {
            updateTab(tab.id, { isLoading: true })
            if (isActive) updateActiveTabState({ isLoading: true })
        }

        const handleDidStopLoading = () => {
            const title = webview.getTitle()
            const url = webview.getURL()
            console.log('[BrowserView] did-stop-loading - Title:', title, 'URL:', url)
            updateTab(tab.id, {
                isLoading: false,
                title: title,
                url: url
            })
            if (isActive) {
                updateActiveTabState({
                    isLoading: false,
                    canGoBack: webview.canGoBack(),
                    canGoForward: webview.canGoForward()
                })
            }
        }

        const handleDomReady = () => {
            // Get title when DOM is ready (for initial load)
            const title = webview.getTitle()
            console.log('[BrowserView] dom-ready - Title:', title)
            if (title && title !== 'about:blank') {
                updateTab(tab.id, { title })
            }
            if (isActive) syncState()
        }

        // Update title dynamically when page title changes (e.g., video starts playing)
        const handleTitleUpdated = (e: any) => {
            // Electron webview page-title-updated event structure
            // The title is on e.title for Electron webview events
            const newTitle = e.title
            console.log('[BrowserView] page-title-updated - newTitle:', newTitle)
            if (newTitle && newTitle !== 'about:blank' && newTitle.length > 0) {
                updateTab(tab.id, { title: newTitle })
            }
        }

        // Note: context-menu is now handled in main process via webContents.on('context-menu')

        // Handle SPA navigation (YouTube uses this heavily)
        const handleDidNavigateInPage = () => {
            // Delay slightly to ensure title is updated
            setTimeout(() => {
                const title = webview.getTitle()
                console.log('[BrowserView] did-navigate-in-page - Title:', title)
                if (title && title !== 'about:blank') {
                    updateTab(tab.id, { title, url: webview.getURL() })
                }
            }, 500)  // Increased delay for YouTube SPA
        }

        webview.addEventListener('did-start-loading', handleDidStartLoading)
        webview.addEventListener('did-stop-loading', handleDidStopLoading)
        webview.addEventListener('dom-ready', handleDomReady)
        webview.addEventListener('page-title-updated' as any, handleTitleUpdated)
        webview.addEventListener('did-navigate-in-page' as any, handleDidNavigateInPage)

        return () => {
            if (webview) {
                webview.removeEventListener('did-start-loading', handleDidStartLoading)
                webview.removeEventListener('did-stop-loading', handleDidStopLoading)
                webview.removeEventListener('dom-ready', handleDomReady)
                webview.removeEventListener('page-title-updated' as any, handleTitleUpdated)
                webview.removeEventListener('did-navigate-in-page' as any, handleDidNavigateInPage)
            }
        }
    }, [tab.id, updateTab, isActive])

    // Re-sync when becoming active
    useEffect(() => {
        if (isActive && webviewRef.current) {
            setTimeout(syncState, 50)
        }
    }, [isActive])

    // Lazy loading: Don't render webview until tab has been activated
    if (!shouldRender) {
        return (
            <div className={clsx("flex-1 flex flex-col h-full bg-youtube-base items-center justify-center", !isActive && "hidden")}>
                <div className="text-gray-500 text-sm animate-pulse">Click to load...</div>
            </div>
        )
    }

    return (
        <div className={clsx("flex-1 flex flex-col h-full bg-youtube-base", !isActive && "hidden")}>
            <div className="flex-1 relative">
                <webview
                    ref={webviewRef}
                    src={tab.url}
                    className="w-full h-full"
                    // @ts-ignore - Electron webview accepts string "true"
                    allowpopups="true"
                />
            </div>
        </div>
    )
}
