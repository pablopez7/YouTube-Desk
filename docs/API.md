# API e IPC - YouTube Desktop

Documentación de la comunicación entre procesos (IPC) y APIs expuestas.

---

## 🔌 APIs Expuestas al Renderer

Estas APIs están disponibles en `window.electron` gracias al preload script.

### Controles de Ventana

| Método | Tipo | Descripción |
|--------|------|-------------|
| `minimize()` | `void` | Minimiza la ventana |
| `maximize()` | `void` | Maximiza/restaura la ventana |
| `close()` | `void` | Cierra la aplicación |
| `isMaximized()` | `Promise<boolean>` | Devuelve si la ventana está maximizada |

**Ejemplo de uso:**
```typescript
// En TitleBar.tsx
window.electron.minimize()
window.electron.maximize()
window.electron.close()

const maximized = await window.electron.isMaximized()
```

---

### Obtener Información de Video

| Método | Parámetros | Retorno |
|--------|------------|---------|
| `getVideoTitle(videoId)` | `videoId: string` | `Promise<{ title: string, thumbnail: string }>` |

**Descripción:**  
Obtiene el título y thumbnail de un video de YouTube usando la API oEmbed. Se ejecuta en el proceso principal para evitar problemas de CORS.

**Ejemplo:**
```typescript
const videoId = 'dQw4w9WgXcQ'
const result = await window.electron.getVideoTitle(videoId)
// result = { title: "Rick Astley - Never Gonna Give You Up", thumbnail: "https://..." }
```

---

### Menú Contextual

| Método | Parámetros | Descripción |
|--------|------------|-------------|
| `showContextMenu(linkUrl?)` | `linkUrl?: string` | Muestra menú contextual nativo |

**Opciones del menú:**
- Si `linkUrl` está definido:
  - "Abrir en nueva pestaña"
  - "Copiar enlace"
- Siempre disponibles:
  - "Copiar"
  - "Pegar"
  - "Recargar página"
  - "Atrás" / "Adelante"

---

### Eventos (Listeners)

| Método | Callback | Descripción |
|--------|----------|-------------|
| `onOpenTab(callback)` | `(url: string) => void` | Se dispara cuando se solicita abrir nueva pestaña |
| `onWindowMaximized(callback)` | `(isMaximized: boolean) => void` | Notifica cambios en estado maximizado |

**Retorno:** Función `unsubscribe` para limpiar el listener.

**Ejemplo:**
```typescript
// En App.tsx
useEffect(() => {
    const unsubscribe = window.electron.onOpenTab((url) => {
        addTab(url, false) // Agregar pestaña en background
    })
    return unsubscribe // Cleanup
}, [])
```

---

## 📡 IPC Handlers (Proceso Principal)

Handlers registrados en `main.ts` con `ipcMain.handle()`:

| Canal | Handler | Descripción |
|-------|---------|-------------|
| `window-minimize` | `win?.minimize()` | Minimiza ventana |
| `window-maximize` | Toggle maximize | Alterna maximizar/restaurar |
| `window-close` | `win?.close()` | Cierra aplicación |
| `is-window-maximized` | `win?.isMaximized()` | Estado de maximización |
| `get-video-title` | Fetch oEmbed API | Obtiene metadata de video |
| `show-context-menu` | `Menu.popup()` | Muestra menú contextual |

---

## 📤 Eventos Emitidos (Main → Renderer)

| Evento | Datos | Disparador |
|--------|-------|------------|
| `window-maximized` | `boolean` | Cambio en estado de ventana |
| `open-tab` | `string` (URL) | Ctrl+Click o "Abrir en nueva pestaña" |

---

## 🔐 Tipos TypeScript

```typescript
// Definición global en vite-env.d.ts
interface Window {
    electron: {
        minimize: () => void
        maximize: () => void
        close: () => void
        isMaximized: () => Promise<boolean>
        getVideoTitle: (videoId: string) => Promise<{
            title: string
            thumbnail: string
        } | null>
        showContextMenu: (linkUrl?: string) => void
        onOpenTab: (callback: (url: string) => void) => () => void
        onWindowMaximized: (callback: (isMaximized: boolean) => void) => () => void
    }
}
```
