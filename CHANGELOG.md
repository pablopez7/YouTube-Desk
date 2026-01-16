# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-16

### Added
- Initial release
- Tab system with drag-and-drop reordering
- Ctrl+Click to open links in background tabs
- Right-click context menu with "Open in new tab" option
- Session persistence (tabs and window state)
- Custom dark theme matching YouTube's aesthetic
- Keyboard shortcuts (Ctrl+T, Ctrl+W)
- Basic ad blocking for common ad domains
- Window state persistence (size, position, maximized state)

### Technical
- Built with Electron 30, React 18, TypeScript
- Vite for fast development builds
- Zustand for state management
- @dnd-kit for drag-and-drop functionality
