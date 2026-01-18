# YouTube Desktop

<p align="center">
  <img src="docs/screenshot.png" alt="YouTube Desktop Screenshot" width="800">
</p>

Aplicación de escritorio dedicada para YouTube construida con **Electron**, **React**, **TypeScript** y **Vite**. Disfruta de una experiencia de YouTube sin distracciones con un aspecto nativo, gestión de pestañas y persistencia de sesión.

## ✨ Características

- 🎬 **Experiencia YouTube Dedicada** - Interfaz limpia sin distracciones del navegador
- 📑 **Gestión de Pestañas** - Abre múltiples videos en pestañas, arrastra y suelta para reordenar
- 🔄 **Actualización Automática de Títulos** - Los títulos de pestañas se actualizan automáticamente al navegar
- 🖱️ **Ctrl+Clic** - Abre videos en nuevas pestañas en segundo plano
- 📋 **Menú Contextual** - Clic derecho para abrir enlaces en nuevas pestañas o copiar URLs
- 💾 **Persistencia de Sesión** - Tus pestañas y posición de ventana se guardan y restauran
- 🎨 **Tema Oscuro** - Interfaz oscura nativa que combina con la estética de YouTube
- ⌨️ **Atajos de Teclado** - `Ctrl+T` nueva pestaña, `Ctrl+W` cerrar pestaña
- 🚫 **Bloqueo Básico de Anuncios** - Bloquea dominios comunes de publicidad

## 📦 Instalación

### Requisitos Previos

- [Node.js](https://nodejs.org/) 18 o superior
- npm o yarn

### Configuración de Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/pablopez7/YouTube-Desk.git
cd YouTube-Desk

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

### Compilar para Producción

```bash
# Compilar para tu plataforma
npm run build

# El instalador estará en la carpeta 'release'
```

## 🛠️ Stack Tecnológico

- **[Electron](https://www.electronjs.org/)** - Apps de escritorio multiplataforma
- **[React 18](https://react.dev/)** - Framework de UI
- **[TypeScript](https://www.typescriptlang.org/)** - Seguridad de tipos
- **[Vite](https://vitejs.dev/)** - Herramienta de build rápida
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilos
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gestión de estado
- **[@dnd-kit](https://dndkit.com/)** - Drag and drop para pestañas

## 📁 Estructura del Proyecto

```
YouTube-Desk/
├── src/
│   ├── main/           # Proceso principal de Electron
│   │   └── main.ts     # Entrada, gestión de ventana, IPC
│   ├── preload/        # Scripts de preload para puente IPC
│   │   └── preload.ts
│   └── renderer/       # Frontend React
│       ├── components/ # Componentes React
│       │   ├── BrowserView.tsx  # Wrapper de WebView
│       │   ├── TabSystem.tsx    # Barra de pestañas con drag-drop
│       │   └── TitleBar.tsx     # Barra de título personalizada
│       ├── App.tsx     # Componente principal
│       ├── store.ts    # Gestión de estado con Zustand
│       ├── utils.ts    # Utilidades compartidas
│       └── main.tsx    # Punto de entrada de React
├── dist-electron/      # Archivos Electron compilados
├── dist/               # Renderer compilado
└── release/            # Instaladores compilados
```

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + T` | Abrir nueva pestaña |
| `Ctrl + W` | Cerrar pestaña actual |
| `Ctrl + Clic` | Abrir enlace en pestaña de fondo |

## 🔧 Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo con hot reload |
| `npm run start` | Ejecutar Electron en desarrollo |
| `npm run build` | Compilar app de producción e instalador |
| `npm run build:electron` | Compilar solo archivos de Electron |
| `npm run typecheck` | Ejecutar verificación de tipos TypeScript |

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor siéntete libre de enviar un Pull Request.

1. Haz fork del proyecto
2. Crea tu rama de feature (`git checkout -b feature/NuevaCaracteristica`)
3. Haz commit de tus cambios (`git commit -m 'Agregar NuevaCaracteristica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## ⚠️ Aviso Legal

Esta aplicación no está afiliada, respaldada ni patrocinada por YouTube o Google. YouTube es una marca registrada de Google LLC. Este es un proyecto de código abierto independiente.

## 🙏 Agradecimientos

- [Electron](https://www.electronjs.org/) por hacer posibles las apps de escritorio multiplataforma
- [Vite Plugin Electron](https://github.com/electron-vite/vite-plugin-electron) por las excelentes herramientas de build
- Las comunidades de React y TypeScript
