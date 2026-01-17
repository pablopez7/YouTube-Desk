import React, { useEffect, useRef, useState } from 'react'
import { Tab, useAppStore } from '../store'
import { clsx } from 'clsx'

interface BrowserViewProps {
    tab: Tab
    isActive: boolean
}

// Extract video ID from YouTube URL
const extractVideoId = (url: string): string | null => {
    if (!url) return null

    const patterns = [
        /[?&]v=([^&]+)/,           // youtube.com/watch?v=ID
        /youtu\.be\/([^?&]+)/,      // youtu.be/ID
        /shorts\/([^?&]+)/,         // youtube.com/shorts/ID
        /embed\/([^?&]+)/           // youtube.com/embed/ID
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }
    return null
}

export const BrowserView: React.FC<BrowserViewProps> = ({ tab, isActive }) => {
    const webviewRef = useRef<Electron.WebviewTag>(null)
    const updateTab = useAppStore(s => s.updateTab)
    const updateActiveTabState = useAppStore(s => s.updateActiveTabState)
    const navigationSignal = useAppStore(s => s.navigationSignal)

    // Track if tab has EVER been active (for lazy loading)
    const [shouldRender, setShouldRender] = useState(false)

    // When tab becomes active (including on first render), trigger rendering
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
    const lastTitleRef = useRef<string>('')

    // Main function to update title - uses IPC to main process for oEmbed
    const updateTitleForUrl = async (url: string) => {
        if (!url || !webviewRef.current) return

        const videoId = extractVideoId(url)

        // For video pages, use oEmbed API
        if (videoId && window.electron?.getVideoTitle) {
            try {
                const result = await window.electron.getVideoTitle(videoId)
                if (result && result.title && result.title !== lastTitleRef.current) {
                    console.log('[BrowserView] Got title from oEmbed:', result.title)
                    lastTitleRef.current = result.title
                    updateTab(tab.id, {
                        title: result.title,
                        url,
                        thumbnail: result.thumbnail || undefined
                    })
                    return
                }
            } catch (e) {
                console.warn('[BrowserView] IPC getVideoTitle failed:', e)
            }
        }

        // For non-video pages (or if oEmbed failed), use document.title
        try {
            const docTitle = await webviewRef.current.executeJavaScript('document.title')
            if (docTitle && docTitle.trim() && docTitle !== 'about:blank' && docTitle !== lastTitleRef.current) {
                console.log('[BrowserView] Using document.title:', docTitle)
                lastTitleRef.current = docTitle
                updateTab(tab.id, { title: docTitle, url })
            }
        } catch (e) {
            // Ignore errors
        }
    }

    // Effect: Handle Navigation Signals (Only if active)
    useEffect(() => {
        if (!isActive || !webviewRef.current || !navigationSignal.action) return

        const webview = webviewRef.current

        switch (navigationSignal.action) {
            case 'back':
                if (webview.canGoBack()) {
                    webview.goBack()
                }
                break
            case 'forward':
                if (webview.canGoForward()) {
                    webview.goForward()
                }
                break
            case 'reload':
                webview.reload()
                break
            case 'zoomIn': {
                const newZoom = webview.getZoomFactor() + 0.1
                webview.setZoomFactor(newZoom)
                updateTab(tab.id, { zoomLevel: newZoom })
                break
            }
            case 'zoomOut': {
                const newZoom = Math.max(0.25, webview.getZoomFactor() - 0.1)
                webview.setZoomFactor(newZoom)
                updateTab(tab.id, { zoomLevel: newZoom })
                break
            }
        }
    }, [navigationSignal, isActive])

    // Main effect: Set up all webview event listeners
    useEffect(() => {
        const webview = webviewRef.current
        if (!webview) return

        console.log('[BrowserView] Setting up listeners for tab:', tab.id)

        const handleDidStartLoading = () => {
            updateTab(tab.id, { isLoading: true })
            if (isActive) updateActiveTabState({ isLoading: true })
        }

        const handleDidStopLoading = () => {
            const url = webview.getURL()
            console.log('[BrowserView] did-stop-loading - URL:', url)

            updateTab(tab.id, { isLoading: false, url })
            updateTitleForUrl(url)

            if (isActive) {
                updateActiveTabState({
                    isLoading: false,
                    canGoBack: webview.canGoBack(),
                    canGoForward: webview.canGoForward()
                })
            }
        }

        const handleDomReady = () => {
            console.log('[BrowserView] dom-ready')
            const url = webview.getURL()
            updateTitleForUrl(url)

            // Restore saved zoom level
            if (tab.zoomLevel && tab.zoomLevel !== 1.0) {
                webview.setZoomFactor(tab.zoomLevel)
                console.log('[BrowserView] Restored zoom level:', tab.zoomLevel)
            }

            if (isActive) syncState()
        }

        // Handle SPA navigation (YouTube uses this heavily)
        const handleDidNavigateInPage = () => {
            const url = webview.getURL()
            console.log('[BrowserView] did-navigate-in-page - URL:', url)
            // Reset last title to force update
            lastTitleRef.current = ''
            updateTitleForUrl(url)
        }

        // Register all event listeners
        webview.addEventListener('did-start-loading', handleDidStartLoading)
        webview.addEventListener('did-stop-loading', handleDidStopLoading)
        webview.addEventListener('dom-ready', handleDomReady)
        webview.addEventListener('did-navigate-in-page' as any, handleDidNavigateInPage)

        // Polling fallback - check URL every 2 seconds
        const pollInterval = setInterval(() => {
            if (webviewRef.current) {
                const currentUrl = webview.getURL()
                updateTitleForUrl(currentUrl)
            }
        }, 2000)

        // Cleanup
        return () => {
            if (webview) {
                webview.removeEventListener('did-start-loading', handleDidStartLoading)
                webview.removeEventListener('did-stop-loading', handleDidStopLoading)
                webview.removeEventListener('dom-ready', handleDomReady)
                webview.removeEventListener('did-navigate-in-page' as any, handleDidNavigateInPage)
            }
            clearInterval(pollInterval)
        }
    }, [tab.id, updateTab, isActive])

    // Re-sync when becoming active
    useEffect(() => {
        if (isActive && webviewRef.current) {
            setTimeout(syncState, 50)

            // Refresh title when tab becomes active
            const url = webviewRef.current.getURL()
            if (url) {
                lastTitleRef.current = '' // Force refresh
                updateTitleForUrl(url)
            }
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
