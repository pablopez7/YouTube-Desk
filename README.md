# YouTube Desktop

<p align="center">
  <img src="docs/screenshot.png" alt="YouTube Desktop Screenshot" width="800">
</p>

A dedicated YouTube desktop application built with **Electron**, **React**, **TypeScript**, and **Vite**. Enjoy a distraction-free YouTube experience with a native app feel, tab management, and session persistence.

## ✨ Features

- 🎬 **Dedicated YouTube Experience** - Clean interface without browser distractions
- 📑 **Tab Management** - Open multiple videos in tabs, drag-and-drop to reorder
- 🖱️ **Ctrl+Click** - Open videos in new background tabs
- 📋 **Context Menu** - Right-click to open links in new tabs or copy URLs
- 💾 **Session Persistence** - Your tabs and window position are saved and restored
- 🎨 **Dark Theme** - Native dark UI matching YouTube's aesthetic
- ⌨️ **Keyboard Shortcuts** - `Ctrl+T` new tab, `Ctrl+W` close tab
- 🚫 **Basic Ad Blocking** - Blocks common ad domains

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm or yarn

### Development Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/youtube-desktop.git
cd youtube-desktop

# Install dependencies
npm install

# Build the Electron files
npm run build:electron

# Start the development server
npm run dev
```

### Building for Production

```bash
# Build for your platform
npm run build

# The installer will be in the 'release' folder
```

## 🛠️ Tech Stack

- **[Electron](https://www.electronjs.org/)** - Cross-platform desktop apps
- **[React 18](https://react.dev/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Fast build tooling
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management
- **[@dnd-kit](https://dndkit.com/)** - Drag and drop for tabs

## 📁 Project Structure

```
youtube-desktop/
├── src/
│   ├── main/           # Electron main process
│   │   └── main.ts     # App entry, window management, IPC
│   ├── preload/        # Preload scripts for IPC bridge
│   │   └── preload.ts
│   └── renderer/       # React frontend
│       ├── components/ # React components
│       │   ├── BrowserView.tsx  # WebView wrapper
│       │   ├── TabSystem.tsx    # Tab bar with drag-drop
│       │   └── TitleBar.tsx     # Custom window titlebar
│       ├── App.tsx     # Main app component
│       ├── store.ts    # Zustand state management
│       └── main.tsx    # React entry point
├── dist-electron/      # Compiled Electron files
├── dist/               # Compiled renderer
└── release/            # Built installers
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + T` | Open new tab |
| `Ctrl + W` | Close current tab |
| `Ctrl + Click` | Open link in background tab |

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run start` | Run Electron in development |
| `npm run build` | Build production app and installer |
| `npm run build:electron` | Build only Electron files |
| `npm run typecheck` | Run TypeScript type checking |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application is not affiliated with, endorsed by, or sponsored by YouTube or Google. YouTube is a trademark of Google LLC. This is an independent open-source project.

## 🙏 Acknowledgments

- [Electron](https://www.electronjs.org/) for making cross-platform desktop apps possible
- [Vite Plugin Electron](https://github.com/electron-vite/vite-plugin-electron) for the excellent build tooling
- The React and TypeScript communities
