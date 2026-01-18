# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.1.0] - 2026-01-18

### Añadido
- Actualización automática de títulos de pestañas al navegar entre videos
- Polling cada segundo para detectar navegación SPA de YouTube
- Nuevo archivo `utils.ts` con funciones utilitarias compartidas

### Corregido
- Error "WebView must be attached to DOM" al iniciar pestañas
- Pantalla negra al abrir la aplicación
- Títulos de pestañas que no se actualizaban en navegación interna

### Mejorado
- Refactorización completa de `BrowserView.tsx` con arquitectura más limpia
- Mejor manejo del estado de preparación del webview
- Eliminación de código duplicado

### Eliminado
- Archivos de configuración Vite redundantes
- Directorio `dist-electron` duplicado en src/renderer
- Archivo `webview-preload.ts` no utilizado

---

## [1.0.0] - 2026-01-16

### Añadido
- Lanzamiento inicial
- Sistema de pestañas con reordenamiento drag-and-drop
- Ctrl+Clic para abrir enlaces en pestañas de fondo
- Menú contextual con opción "Abrir en nueva pestaña"
- Persistencia de sesión (pestañas y estado de ventana)
- Tema oscuro personalizado que combina con YouTube
- Atajos de teclado (Ctrl+T, Ctrl+W)
- Bloqueo básico de anuncios para dominios comunes
- Persistencia del estado de ventana (tamaño, posición, maximizado)

### Técnico
- Construido con Electron 30, React 18, TypeScript
- Vite para builds de desarrollo rápidos
- Zustand para gestión de estado
- @dnd-kit para funcionalidad drag-and-drop
