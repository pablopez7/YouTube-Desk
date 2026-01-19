import React, { useEffect, useRef, useState } from 'react'
import { Tab, useAppStore } from '../store'
import { clsx } from 'clsx'
import { useWebviewNavigation } from '../hooks/useWebviewNavigation'
import { useWebviewTitle } from '../hooks/useWebviewTitle'
import { createLogger } from '../../shared/logger'

const log = createLogger('BrowserView')

interface BrowserViewProps {
    tab: Tab
    isActive: boolean
}

export const BrowserView: React.FC<BrowserViewProps> = ({ tab, isActive }) => {
    const webviewRef = useRef<Electron.WebviewTag | null>(null)
    const [isReady, setIsReady] = useState(false)

    const updateTab = useAppStore(s => s.updateTab)
    const updateActiveTabState = useAppStore(s => s.updateActiveTabState)
    const setTheme = useAppStore(s => s.setTheme)

    // Track if tab has been activated (for lazy loading)
    const [shouldRender, setShouldRender] = useState(isActive)

    // Capture initial URL only once
    const initialUrl = useRef(tab.url)

    // Use custom hooks
    const { syncNavigationState } = useWebviewNavigation({
        webviewRef,
        tabId: tab.id,
        isActive,
        isReady
    })

    const { updateTitle, lastUrlRef } = useWebviewTitle({
        tabId: tab.id,
        isReady,
        webviewRef
    })

    // When tab becomes active, trigger rendering
    useEffect(() => {
        if (isActive && !shouldRender) {
            setShouldRender(true)
        }
    }, [isActive, shouldRender])

    // Set up webview event listeners
    useEffect(() => {
        const webview = webviewRef.current
        if (!webview) return

        const handleDomReady = () => {
            log.debug('dom-ready', { tabId: tab.id })
            setIsReady(true)

            const url = webview.getURL()
            updateTitle(url)

            // Restore zoom level
            if (tab.zoomLevel && tab.zoomLevel !== 1.0) {
                webview.setZoomFactor(tab.zoomLevel)
            }

            // Detect YouTube theme (only if active tab to avoid conflicts)
            if (isActive) {
                detectYouTubeTheme(webview)
                syncNavigationState()
            }
        }

        const handleDidStartLoading = () => {
            updateTab(tab.id, { isLoading: true })
            if (isActive) updateActiveTabState({ isLoading: true })
        }

        const handleDidStopLoading = () => {
            const url = webview.getURL()
            log.debug('did-stop-loading', { url })
            updateTab(tab.id, { isLoading: false, url })
            updateTitle(url)

            if (isActive && isReady) {
                detectYouTubeTheme(webview)
                syncNavigationState()
            }
        }

        // Detect YouTube theme from the page
        const detectYouTubeTheme = async (wv: Electron.WebviewTag) => {
            try {
                // YouTube uses 'dark' attribute on html element for dark mode
                const isDark = await wv.executeJavaScript(`
                    document.documentElement.hasAttribute('dark') || 
                    document.querySelector('html[dark]') !== null ||
                    document.body.style.backgroundColor === 'rgb(15, 15, 15)' ||
                    getComputedStyle(document.body).backgroundColor === 'rgb(15, 15, 15)'
                `)
                setTheme(isDark ? 'dark' : 'light')
            } catch (e) {
                // Ignore errors - webview might not be ready
            }
        }

        const handleDidNavigate = (e: { url?: string }) => {
            const url = e.url || webview.getURL()
            log.debug('did-navigate', { url })
            updateTitle(url)
            updateTab(tab.id, { url })
        }

        const handleDidNavigateInPage = (e: { url?: string; isMainFrame?: boolean }) => {
            if (e.isMainFrame !== false) {
                const url = e.url || webview.getURL()
                log.debug('did-navigate-in-page', { url })
                updateTitle(url)
                updateTab(tab.id, { url })
            }
        }

        // Add listeners
        webview.addEventListener('dom-ready', handleDomReady)
        webview.addEventListener('did-start-loading', handleDidStartLoading)
        webview.addEventListener('did-stop-loading', handleDidStopLoading)
        webview.addEventListener('did-navigate', handleDidNavigate as EventListener)
        webview.addEventListener('did-navigate-in-page', handleDidNavigateInPage as EventListener)

        // Polling fallback for SPA navigation (only when active to save resources)
        let pollInterval: ReturnType<typeof setInterval> | null = null

        if (isActive) {
            pollInterval = setInterval(() => {
                if (isReady) {
                    try {
                        const currentUrl = webview.getURL()
                        if (currentUrl && currentUrl !== lastUrlRef.current) {
                            log.debug('Polling detected URL change', { url: currentUrl })
                            updateTitle(currentUrl)
                        }
                    } catch (e) {
                        // Ignore
                    }
                }
            }, 2000) // Increased to 2s to reduce resource usage
        }

        return () => {
            webview.removeEventListener('dom-ready', handleDomReady)
            webview.removeEventListener('did-start-loading', handleDidStartLoading)
            webview.removeEventListener('did-stop-loading', handleDidStopLoading)
            webview.removeEventListener('did-navigate', handleDidNavigate as EventListener)
            webview.removeEventListener('did-navigate-in-page', handleDidNavigateInPage as EventListener)
            if (pollInterval) clearInterval(pollInterval)
        }
    }, [tab.id, isActive, isReady, updateTitle, syncNavigationState])

    // Sync state when becoming active
    useEffect(() => {
        if (isActive && isReady) {
            syncNavigationState()
        }
    }, [isActive, isReady, syncNavigationState])

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
                    ref={webviewRef as React.RefObject<HTMLElement>}
                    src={initialUrl.current}
                    className="w-full h-full"
                    // @ts-ignore
                    allowpopups="true"
                />
            </div>
        </div>
    )
}
