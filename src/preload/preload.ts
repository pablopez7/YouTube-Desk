import { contextBridge, ipcRenderer } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        invoke(channel: string, ...args: any[]) {
            return ipcRenderer.invoke(channel, ...args)
        },
        on(channel: string, func: (...args: any[]) => void) {
            const subscription = (_event: any, ...args: any[]) => func(...args)
            ipcRenderer.on(channel, subscription)
            return () => ipcRenderer.removeListener(channel, subscription)
        },
        send(channel: string, ...args: any[]) {
            ipcRenderer.send(channel, ...args)
        }
    },
    // Window controls
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),
    isMaximized: () => ipcRenderer.invoke('is-window-maximized'),
    onMaximized: (callback: (isMaximized: boolean) => void) => ipcRenderer.on('window-maximized', (_, val) => callback(val)),

    // Context Menu
    showContextMenu: (url: string) => ipcRenderer.invoke('show-context-menu', url),
    onOpenTab: (callback: (url: string) => void) => {
        // Remove ALL existing listeners first to prevent duplicates (handles StrictMode + HMR)
        ipcRenderer.removeAllListeners('on-open-tab')
        const handler = (_: any, url: string) => callback(url)
        ipcRenderer.on('on-open-tab', handler)
        return () => ipcRenderer.removeAllListeners('on-open-tab')
    },

    // YouTube oEmbed API - fetch video title
    getVideoTitle: (videoId: string) => ipcRenderer.invoke('get-video-title', videoId)
})
