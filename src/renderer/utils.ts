/**
 * Utilidades compartidas para el renderer
 */

/**
 * Extrae el ID de video de una URL de YouTube
 * Soporta: youtube.com/watch, youtu.be, shorts, embed
 */
export const extractVideoId = (url: string): string | null => {
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
