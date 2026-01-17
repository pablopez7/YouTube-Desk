// Preload script that runs INSIDE each webview (YouTube pages)
// This observes title changes and sends them to the host page

console.log('[WebviewPreload] Loaded in:', window.location.href)

// MutationObserver to watch for title changes in the DOM
const titleElement = document.querySelector('title')
if (titleElement) {
    const observer = new MutationObserver(() => {
        const newTitle = document.title
        console.log('[WebviewPreload] Title changed:', newTitle)

        // Send title to parent via custom event that the renderer can listen to
        // We'll use a different approach: postMessage won't work across webview boundary
        // Instead, we'll rely on the title element itself being observed from outside
    })

    observer.observe(titleElement, {
        childList: true,
        characterData: true,
        subtree: true
    })

    // Also listen for title changes via document.title setter
    let lastTitle = document.title
    setInterval(() => {
        if (document.title !== lastTitle) {
            lastTitle = document.title
            console.log('[WebviewPreload] Title polling detected change:', lastTitle)
        }
    }, 500)
}

// Log page navigation
window.addEventListener('load', () => {
    console.log('[WebviewPreload] Page loaded:', document.title)
})
