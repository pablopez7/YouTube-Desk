import { useRef, useCallback } from 'react'
import { useAppStore } from '../store'
import { extractVideoId } from '../utils'
import { createLogger } from '../../shared/logger'

const log = createLogger('useWebviewTitle')

interface UseWebviewTitleProps {
    tabId: string
    isReady: boolean
    webviewRef: React.RefObject<Electron.WebviewTag | null>
}

/**
 * Hook para actualizar el título de la pestaña basado en la URL actual
 * Usa oEmbed para videos de YouTube, document.title para otras páginas
 */
export function useWebviewTitle({ tabId, isReady, webviewRef }: UseWebviewTitleProps) {
    const updateTab = useAppStore(s => s.updateTab)
    const lastUrlRef = useRef('')

    const updateTitle = useCallback(async (url: string) => {
        if (!url || url === 'about:blank') return

        // Skip if same URL (debounce)
        if (url === lastUrlRef.current) return
        lastUrlRef.current = url

        const videoId = extractVideoId(url)

        // For video pages, use oEmbed API
        if (videoId && window.electron?.getVideoTitle) {
            try {
                const result = await window.electron.getVideoTitle(videoId)
                if (result?.title) {
                    log.info('Title from oEmbed', { title: result.title })
                    updateTab(tabId, {
                        title: result.title,
                        url,
                        thumbnail: result.thumbnail || undefined
                    })
                    return
                }
            } catch (e) {
                log.warn('oEmbed failed', { error: e instanceof Error ? e.message : e })
            }
        }

        // For non-video pages, use document.title
        const webview = webviewRef.current
        if (webview && isReady) {
            try {
                const docTitle = await webview.executeJavaScript('document.title')
                if (docTitle && docTitle.trim() && docTitle !== 'about:blank') {
                    log.info('Title from document', { title: docTitle })
                    updateTab(tabId, { title: docTitle, url })
                }
            } catch (e) {
                // Ignore - webview might not be ready
            }
        }
    }, [tabId, isReady, webviewRef, updateTab])

    // Reset lastUrlRef when tab changes
    const resetUrlTracking = useCallback(() => {
        lastUrlRef.current = ''
    }, [])

    return { updateTitle, resetUrlTracking, lastUrlRef }
}
