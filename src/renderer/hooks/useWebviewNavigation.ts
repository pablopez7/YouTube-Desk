import { useEffect, useCallback } from 'react'
import { useAppStore } from '../store'
import { createLogger } from '../../shared/logger'

const log = createLogger('useWebviewNavigation')

type NavigationAction = 'back' | 'forward' | 'reload' | 'zoomIn' | 'zoomOut' | null

interface UseWebviewNavigationProps {
    webviewRef: React.RefObject<Electron.WebviewTag | null>
    tabId: string
    isActive: boolean
    isReady: boolean
}

/**
 * Hook para manejar navegación del webview (back, forward, reload, zoom)
 * Escucha señales de navegación del store y las ejecuta en el webview
 */
export function useWebviewNavigation({
    webviewRef,
    tabId,
    isActive,
    isReady
}: UseWebviewNavigationProps) {
    const navigationSignal = useAppStore(s => s.navigationSignal)
    const updateTab = useAppStore(s => s.updateTab)
    const updateActiveTabState = useAppStore(s => s.updateActiveTabState)

    // Sync active tab state when becoming active or ready
    // IMPORTANT: Must be defined with useCallback BEFORE the effect that uses it
    const syncNavigationState = useCallback(() => {
        const webview = webviewRef.current
        if (webview && isReady) {
            updateActiveTabState({
                canGoBack: webview.canGoBack(),
                canGoForward: webview.canGoForward(),
                isLoading: webview.isLoading()
            })
        }
    }, [webviewRef, isReady, updateActiveTabState])

    // Handle navigation signals from TitleBar
    useEffect(() => {
        const action = navigationSignal.action
        if (!isActive || !isReady || !action) return

        const webview = webviewRef.current
        if (!webview) return

        log.debug('Navigation action received', { action })

        switch (action) {
            case 'back':
                if (webview.canGoBack()) {
                    log.debug('Navigating back')
                    webview.goBack()
                }
                break
            case 'forward':
                if (webview.canGoForward()) {
                    log.debug('Navigating forward')
                    webview.goForward()
                }
                break
            case 'reload':
                log.debug('Reloading page')
                webview.reload()
                break
            case 'zoomIn': {
                const currentZoom = webview.getZoomFactor()
                const newZoom = currentZoom + 0.1
                log.debug('Zooming in', { currentZoom, newZoom })
                webview.setZoomFactor(newZoom)
                updateTab(tabId, { zoomLevel: newZoom })
                break
            }
            case 'zoomOut': {
                const currentZoom = webview.getZoomFactor()
                const newZoom = Math.max(0.25, currentZoom - 0.1)
                log.debug('Zooming out', { currentZoom, newZoom })
                webview.setZoomFactor(newZoom)
                updateTab(tabId, { zoomLevel: newZoom })
                break
            }
        }
        // Use navigationSignal.id to detect changes - it's a UUID that changes on each action
    }, [navigationSignal.id, navigationSignal.action, isActive, isReady, tabId, webviewRef, updateTab])

    return { syncNavigationState }
}

