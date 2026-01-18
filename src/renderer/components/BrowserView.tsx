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
    const webviewRef = useRef<Electron.WebviewTag | null>(null)
    const [isReady, setIsReady] = useState(false)

    const updateTab = useAppStore(s => s.updateTab)
    const updateActiveTabState = useAppStore(s => s.updateActiveTabState)
    const navigationSignal = useAppStore(s => s.navigationSignal)

    // Track if tab has been activated (for lazy loading)
    const [shouldRender, setShouldRender] = useState(isActive)

    // Capture initial URL only once
    const initialUrl = useRef(tab.url)

    // Last known URL for change detection
    const lastUrlRef = useRef('')

    // When tab becomes active, trigger rendering
    useEffect(() => {
        if (isActive && !shouldRender) {
            setShouldRender(true)
        }
    }, [isActive, shouldRender])

    // Update title when URL changes
    const updateTitle = async (url: string) => {
        if (!url || url === 'about:blank') return

        // Skip if same URL
        if (url === lastUrlRef.current) return
        lastUrlRef.current = url

        const videoId = extractVideoId(url)

        // For video pages, use oEmbed API
        if (videoId && window.electron?.getVideoTitle) {
            try {
                const result = await window.electron.getVideoTitle(videoId)
                if (result?.title) {
                    console.log('[BrowserView] Title from oEmbed:', result.title)
                    updateTab(tab.id, {
                        title: result.title,
                        url,
                        thumbnail: result.thumbnail || undefined
                    })
                    return
                }
            } catch (e) {
                console.warn('[BrowserView] oEmbed failed:', e)
            }
        }

        // For non-video pages, use document.title
        const webview = webviewRef.current
        if (webview && isReady) {
            try {
                const docTitle = await webview.executeJavaScript('document.title')
                if (docTitle && docTitle.trim() && docTitle !== 'about:blank') {
                    console.log('[BrowserView] Title from document:', docTitle)
                    updateTab(tab.id, { title: docTitle, url })
                }
            } catch (e) {
                // Ignore
            }
        }
    }

    // Handle navigation signals
    useEffect(() => {
        if (!isActive || !isReady || !navigationSignal.action) return
        const webview = webviewRef.current
        if (!webview) return

        switch (navigationSignal.action) {
            case 'back':
                if (webview.canGoBack()) webview.goBack()
                break
            case 'forward':
                if (webview.canGoForward()) webview.goForward()
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
    }, [navigationSignal, isActive, isReady])

    // Set up webview event listeners
    useEffect(() => {
        const webview = webviewRef.current
        if (!webview) return

        const handleDomReady = () => {
            console.log('[BrowserView] dom-ready for tab:', tab.id)
            setIsReady(true)

            const url = webview.getURL()
            updateTitle(url)

            // Restore zoom level
            if (tab.zoomLevel && tab.zoomLevel !== 1.0) {
                webview.setZoomFactor(tab.zoomLevel)
            }

            // Sync navigation state
            if (isActive) {
                updateActiveTabState({
                    canGoBack: webview.canGoBack(),
                    canGoForward: webview.canGoForward(),
                    isLoading: false
                })
            }
        }

        const handleDidStartLoading = () => {
            updateTab(tab.id, { isLoading: true })
            if (isActive) updateActiveTabState({ isLoading: true })
        }

        const handleDidStopLoading = () => {
            const url = webview.getURL()
            console.log('[BrowserView] did-stop-loading:', url)
            updateTab(tab.id, { isLoading: false, url })
            updateTitle(url)

            if (isActive && isReady) {
                updateActiveTabState({
                    isLoading: false,
                    canGoBack: webview.canGoBack(),
                    canGoForward: webview.canGoForward()
                })
            }
        }

        const handleDidNavigate = (e: any) => {
            const url = e.url || webview.getURL()
            console.log('[BrowserView] did-navigate:', url)
            updateTitle(url)
            updateTab(tab.id, { url })
        }

        const handleDidNavigateInPage = (e: any) => {
            if (e.isMainFrame !== false) {
                const url = e.url || webview.getURL()
                console.log('[BrowserView] did-navigate-in-page:', url)
                updateTitle(url)
                updateTab(tab.id, { url })
            }
        }

        // Add listeners
        webview.addEventListener('dom-ready', handleDomReady)
        webview.addEventListener('did-start-loading', handleDidStartLoading)
        webview.addEventListener('did-stop-loading', handleDidStopLoading)
        webview.addEventListener('did-navigate', handleDidNavigate as any)
        webview.addEventListener('did-navigate-in-page', handleDidNavigateInPage as any)

        // Polling fallback for SPA navigation
        const pollInterval = setInterval(() => {
            if (isReady) {
                try {
                    const currentUrl = webview.getURL()
                    if (currentUrl && currentUrl !== lastUrlRef.current) {
                        console.log('[BrowserView] Polling detected URL change:', currentUrl)
                        updateTitle(currentUrl)
                    }
                } catch (e) {
                    // Ignore
                }
            }
        }, 1000)

        return () => {
            webview.removeEventListener('dom-ready', handleDomReady)
            webview.removeEventListener('did-start-loading', handleDidStartLoading)
            webview.removeEventListener('did-stop-loading', handleDidStopLoading)
            webview.removeEventListener('did-navigate', handleDidNavigate as any)
            webview.removeEventListener('did-navigate-in-page', handleDidNavigateInPage as any)
            clearInterval(pollInterval)
        }
    }, [tab.id, isActive])

    // Sync state when becoming active
    useEffect(() => {
        if (isActive && isReady && webviewRef.current) {
            const webview = webviewRef.current
            updateActiveTabState({
                canGoBack: webview.canGoBack(),
                canGoForward: webview.canGoForward(),
                isLoading: webview.isLoading()
            })
        }
    }, [isActive, isReady])

    // Lazy loading placeholder
    if (!shouldRender) {
        return (
            <div className={clsx("flex-1 flex flex-col h-full bg-youtube-base items-center justify-center", !isActive && "hidden")}>
                <div className="text-gray-500 text-sm animate-pulse">Loading...</div>
            </div>
        )
    }

    return (
        <div className={clsx("flex-1 flex flex-col h-full bg-youtube-base", !isActive && "hidden")}>
            <div className="flex-1 relative">
                <webview
                    ref={webviewRef as any}
                    src={initialUrl.current}
                    className="w-full h-full"
                    // @ts-ignore
                    allowpopups="true"
                />
            </div>
        </div>
    )
}
