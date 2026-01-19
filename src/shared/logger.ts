/**
 * Sistema de logging estructurado para YouTube Desktop
 * Proporciona niveles de log consistentes, timestamps y contexto de módulo
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
    timestamp: string
    level: LogLevel
    module: string
    message: string
    data?: unknown
}

const LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
}

// En producción solo muestra warn/error, en desarrollo muestra todo
const isDev = typeof process !== 'undefined'
    ? process.env.NODE_ENV !== 'production'
    : true

const MIN_LEVEL: LogLevel = isDev ? 'debug' : 'warn'

function formatLogEntry(entry: LogEntry): string {
    const dataStr = entry.data !== undefined
        ? ` ${JSON.stringify(entry.data)}`
        : ''
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.module}] ${entry.message}${dataStr}`
}

export interface Logger {
    debug: (message: string, data?: unknown) => void
    info: (message: string, data?: unknown) => void
    warn: (message: string, data?: unknown) => void
    error: (message: string, data?: unknown) => void
}

/**
 * Crea una instancia de logger para un módulo específico
 * @param module - Nombre del módulo (ej: 'Main', 'BrowserView', 'Store')
 */
export function createLogger(module: string): Logger {
    const log = (level: LogLevel, message: string, data?: unknown): void => {
        if (LEVELS[level] < LEVELS[MIN_LEVEL]) return

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            module,
            message,
            data
        }

        const output = formatLogEntry(entry)

        switch (level) {
            case 'error':
                console.error(output)
                break
            case 'warn':
                console.warn(output)
                break
            default:
                console.log(output)
        }
    }

    return {
        debug: (message: string, data?: unknown) => log('debug', message, data),
        info: (message: string, data?: unknown) => log('info', message, data),
        warn: (message: string, data?: unknown) => log('warn', message, data),
        error: (message: string, data?: unknown) => log('error', message, data),
    }
}
