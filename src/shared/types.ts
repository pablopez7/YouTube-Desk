/**
 * Tipos compartidos para YouTube Desktop
 * Centraliza interfaces usadas en main y renderer
 */

// ============ Electron Events ============

/** Evento de navegación del webview */
export interface WebviewNavigationEvent {
    url: string
    isMainFrame?: boolean
}

/** Parámetros del menú contextual de Electron */
export interface ContextMenuParams {
    linkURL: string
    pageURL: string
    srcURL: string
    mediaType: 'none' | 'image' | 'audio' | 'video' | 'canvas' | 'file' | 'plugin'
    hasImageContents: boolean
    isEditable: boolean
    selectionText: string
    editFlags: {
        canUndo: boolean
        canRedo: boolean
        canCut: boolean
        canCopy: boolean
        canPaste: boolean
        canDelete: boolean
        canSelectAll: boolean
    }
}

// ============ YouTube API ============

/** Respuesta de la API oEmbed de YouTube */
export interface OEmbedResponse {
    title: string
    author_name: string
    author_url: string
    type: 'video'
    height: number
    width: number
    version: string
    provider_name: string
    provider_url: string
    thumbnail_height: number
    thumbnail_width: number
    thumbnail_url: string
    html: string
}

/** Resultado procesado de oEmbed para uso en la app */
export interface VideoInfo {
    title: string | null
    thumbnail: string | null
}

// ============ Window State ============

/** Estado de la ventana para persistencia */
export interface WindowState {
    width: number
    height: number
    x?: number
    y?: number
    isMaximized: boolean
}

// ============ Menu Templates ============

/** Item de menú contextual */
export interface MenuItemTemplate {
    label?: string
    role?: 'copy' | 'paste' | 'cut' | 'undo' | 'redo' | 'reload' | 'selectAll'
    type?: 'separator' | 'normal' | 'submenu' | 'checkbox' | 'radio'
    enabled?: boolean
    click?: () => void
}
