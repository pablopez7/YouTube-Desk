import electronUpdater from 'electron-updater'
const { autoUpdater } = electronUpdater
import { dialog, BrowserWindow } from 'electron'
import { createLogger } from '../shared/logger'

const log = createLogger('AutoUpdater')

// Type for update info
interface UpdateInfo {
    version: string
}

/**
 * Initialize auto-updater with GitHub releases
 * Call this function after the app window is ready
 */
export function initAutoUpdater(mainWindow: BrowserWindow | null) {
    // Don't check for updates in development
    if (process.env.VITE_DEV_SERVER_URL) {
        log.info('Skipping auto-update check in development mode')
        return
    }

    // Configure auto-updater
    autoUpdater.autoDownload = false // Don't download automatically, ask user first
    autoUpdater.autoInstallOnAppQuit = true

    // Event handlers
    autoUpdater.on('checking-for-update', () => {
        log.info('Checking for updates...')
    })

    autoUpdater.on('update-available', async (info: UpdateInfo) => {
        log.info('Update available', { version: info.version })

        const response = await dialog.showMessageBox({
            type: 'info',
            title: 'Actualización disponible',
            message: `Nueva versión ${info.version} disponible`,
            detail: '¿Deseas descargar e instalar la actualización ahora?',
            buttons: ['Sí, actualizar', 'Más tarde'],
            defaultId: 0,
            cancelId: 1
        })

        if (response.response === 0) {
            log.info('User accepted update, downloading...')
            autoUpdater.downloadUpdate()
        } else {
            log.info('User postponed update')
        }
    })

    autoUpdater.on('update-not-available', () => {
        log.info('App is up to date')
    })

    autoUpdater.on('download-progress', (progress) => {
        log.info('Download progress', { percent: Math.round(progress.percent) })

        // Optionally send progress to renderer
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('update-download-progress', progress.percent)
        }
    })

    autoUpdater.on('update-downloaded', async (info: UpdateInfo) => {
        log.info('Update downloaded', { version: info.version })

        const response = await dialog.showMessageBox({
            type: 'info',
            title: 'Actualización lista',
            message: 'La actualización se ha descargado',
            detail: 'La aplicación se reiniciará para instalar la actualización.',
            buttons: ['Reiniciar ahora', 'Más tarde'],
            defaultId: 0,
            cancelId: 1
        })

        if (response.response === 0) {
            log.info('Installing update and restarting...')
            autoUpdater.quitAndInstall()
        }
    })

    autoUpdater.on('error', (error) => {
        log.error('Auto-updater error', { error: error.message })
    })

    // Check for updates
    log.info('Starting update check...')
    autoUpdater.checkForUpdates().catch((err) => {
        log.error('Failed to check for updates', { error: err.message })
    })
}
