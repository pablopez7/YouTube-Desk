import { app, BrowserWindow, ipcMain, shell, session, Menu, clipboard } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { release } from 'node:os'
import Store from 'electron-store'
import { createLogger } from '../shared/logger'
import { initAutoUpdater } from './updater'
import type { WindowState, MenuItemTemplate, VideoInfo } from '../shared/types'

const log = createLogger('Main')

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// WindowState type is now imported from shared/types

const store = new Store<{ windowState: WindowState }>({
    defaults: {
        windowState: {
            width: 1200,
            height: 800,
            isMaximized: false
        }
    }
});

// Disable GPU Acceleration for Windows 7 - REMOVED for performance on modern systems
// if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications and taskbar grouping
// This MUST match the appId in package.json build config
if (process.platform === 'win32') app.setAppUserModelId('com.youtube.desktop')

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null

const preload = path.join(__dirname, 'preload.js')

// When running from dist-electron, dist is a sibling folder
const isDev = process.env.VITE_DEV_SERVER_URL
const dist = isDev ? path.join(__dirname, '../dist') : path.join(__dirname, '../dist')
const publicDir = path.join(__dirname, '../public')

async function createWindow() {
    const windowState = store.get('windowState')

    // Icon path - use resources folder
    const iconPath = path.join(__dirname, '../resources/icon.ico')

    win = new BrowserWindow({
        width: windowState.width,
        height: windowState.height,
        x: windowState.x,
        y: windowState.y,
        minWidth: 800,
        minHeight: 600,
        frame: false, // Custom titlebar
        backgroundColor: '#0f0f0f', // YouTube dark background
        titleBarStyle: 'hidden',
        roundedCorners: true, // Rounded window corners
        icon: iconPath, // YouTube icon for taskbar
        webPreferences: {
            preload,
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true,
            backgroundThrottling: false, // Fix audio/video stutter in background
        },
    })

    if (windowState.isMaximized) {
        win.maximize()
    }

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(dist, 'index.html'))
    }

    // Note: We don't use setWindowOpenHandler here because we want webview's
    // new-window event to handle Ctrl+Click. The main window itself shouldn't open popups.

    // Save window state on close/resize/move
    const saveState = () => {
        if (!win) return;
        const bounds = win.getBounds();
        store.set('windowState', {
            width: bounds.width,
            height: bounds.height,
            x: bounds.x,
            y: bounds.y,
            isMaximized: win.isMaximized()
        });
    };

    win.on('resize', saveState);
    win.on('move', saveState);
    win.on('close', saveState);
}

app.whenReady().then(() => {
    createWindow()

    // Initialize auto-updater after window is ready
    initAutoUpdater(win)

    // Configure session for YouTube & AdBlock (Basic)
    const filter = {
        urls: ['*://*.doubleclick.net/*', '*://*.googleadservices.com/*', '*://*.googlesyndication.com/*']
    }

    session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
        callback({ cancel: true })
    })

    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        callback({ requestHeaders: details.requestHeaders })
    })

    // Intercept new window requests from webviews only
    // This handles Ctrl+Click and window.open in webviews

    // Track last opened URL and time for debouncing
    let lastOpenedUrl: string | null = null
    let lastOpenedTime = 0
    const DEBOUNCE_MS = 500 // Ignore duplicate requests within 500ms

    // Track webContents that already have handlers to avoid duplicates
    const handledContents = new WeakSet<Electron.WebContents>()

    app.on('web-contents-created', (_, contents) => {
        // Only intercept webview contents, not the main renderer
        if (contents.getType() === 'webview') {
            // Avoid adding duplicate handlers
            if (handledContents.has(contents)) {
                log.debug('Skipping duplicate handler for webview')
                return
            }
            handledContents.add(contents)

            // Handle Ctrl+Click and window.open
            contents.setWindowOpenHandler((details) => {
                const now = Date.now()
                log.info('Webview window open request', { url: details.url })

                // Debounce: ignore if same URL was opened recently
                if (details.url === lastOpenedUrl && (now - lastOpenedTime) < DEBOUNCE_MS) {
                    log.debug('Debouncing duplicate request')
                    return { action: 'deny' }
                }

                lastOpenedUrl = details.url
                lastOpenedTime = now

                // Send URL to main renderer to create a new tab
                if (win && !win.isDestroyed()) {
                    win.webContents.send('on-open-tab', details.url)
                }
                // DENY the new window - this is critical to prevent new windows
                return { action: 'deny' }
            })

            // Handle context-menu for webviews (right-click)
            contents.on('context-menu', (event, params) => {
                log.debug('Webview context-menu', { linkURL: params.linkURL || 'no link' })

                const template: MenuItemTemplate[] = []

                // Link-specific options - check if right-clicked on a link
                if (params.linkURL) {
                    template.push(
                        {
                            label: 'Abrir en nueva pestaña',
                            click: () => {
                                if (win && !win.isDestroyed()) {
                                    win.webContents.send('on-open-tab', params.linkURL)
                                }
                            }
                        },
                        {
                            label: 'Copiar enlace',
                            click: () => {
                                clipboard.writeText(params.linkURL)
                            }
                        },
                        { type: 'separator' }
                    )
                }

                // General options
                template.push(
                    { role: 'copy', label: 'Copiar' },
                    { role: 'paste', label: 'Pegar' },
                    { type: 'separator' },
                    {
                        label: 'Recargar página',
                        click: () => contents.reload()
                    },
                    {
                        label: 'Atrás',
                        enabled: contents.canGoBack(),
                        click: () => contents.goBack()
                    },
                    {
                        label: 'Adelante',
                        enabled: contents.canGoForward(),
                        click: () => contents.goForward()
                    }
                )

                const menu = Menu.buildFromTemplate(template)
                menu.popup()
            })
        }
    })
})

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

// --- IPC Handlers ---

ipcMain.handle('window-minimize', () => {
    win?.minimize()
})

ipcMain.handle('window-maximize', () => {
    if (win?.isMaximized()) {
        win.unmaximize()
    } else {
        win?.maximize()
    }
})

ipcMain.handle('window-close', () => {
    win?.close()
})

ipcMain.handle('is-window-maximized', () => {
    return win?.isMaximized()
})

// Fetch YouTube video info via oEmbed API (runs in main process to avoid CORS)
ipcMain.handle('get-video-title', async (_, videoId: string) => {
    try {
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        const response = await fetch(oembedUrl)

        if (!response.ok) {
            log.warn('oEmbed request failed', { status: response.status })
            return null
        }

        const data = await response.json()
        log.info('oEmbed fetched', { title: data.title })

        // Return both title and thumbnail
        return {
            title: data.title || null,
            thumbnail: data.thumbnail_url || null
        }
    } catch (e) {
        log.error('oEmbed fetch error', { error: e instanceof Error ? e.message : e })
        return null
    }
})

ipcMain.handle('show-context-menu', async (event, linkUrl) => {
    const template: MenuItemTemplate[] = []

    // Link-specific options
    if (linkUrl) {
        template.push(
            {
                label: 'Abrir en nueva pestaña',
                click: () => {
                    // Send to main window, not to the webview
                    if (win && !win.isDestroyed()) {
                        win.webContents.send('on-open-tab', linkUrl)
                    }
                }
            },
            {
                label: 'Copiar enlace',
                click: () => {
                    clipboard.writeText(linkUrl)
                }
            },
            { type: 'separator' }
        )
    }

    // General options
    template.push(
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Pegar' },
        { type: 'separator' },
        { role: 'reload', label: 'Recargar página' },
        {
            label: 'Atrás',
            click: () => {
                const wc = event.sender
                if (wc.canGoBack()) wc.goBack()
            }
        },
        {
            label: 'Adelante',
            click: () => {
                const wc = event.sender
                if (wc.canGoForward()) wc.goForward()
            }
        }
    )

    const menu = Menu.buildFromTemplate(template)
    menu.popup({ window: BrowserWindow.fromWebContents(event.sender) || undefined })
})

app.on('browser-window-created', (_, window) => {
    window.on('maximize', () => window.webContents.send('window-maximized', true))
    window.on('unmaximize', () => window.webContents.send('window-maximized', false))
})
