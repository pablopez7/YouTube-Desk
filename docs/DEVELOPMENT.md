# Guía de Desarrollo - YouTube Desktop

## 🚀 Configuración del Entorno

### Requisitos

- **Node.js** 18.x o superior
- **npm** 9.x o superior (incluido con Node.js)
- **Git** para control de versiones

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/pablopez7/YouTube-Desk.git
cd YouTube-Desk

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev
```

---

## 📂 Estructura de Carpetas

```
YouTube-Desk/
├── src/
│   ├── main/                 # Proceso principal de Electron
│   │   └── main.ts           # Entrada, ventana, IPC, ad-block
│   │
│   ├── preload/              # Scripts de preload
│   │   └── preload.ts        # Puente seguro Main ↔ Renderer
│   │
│   └── renderer/             # Frontend React
│       ├── components/
│       │   ├── BrowserView.tsx   # Webview + navegación
│       │   ├── TabSystem.tsx     # Pestañas con drag-drop
│       │   └── TitleBar.tsx      # Barra de título
│       ├── App.tsx           # Componente raíz
│       ├── store.ts          # Estado global (Zustand)
│       ├── utils.ts          # Funciones utilitarias
│       ├── index.css         # Estilos globales
│       ├── main.tsx          # Punto de entrada React
│       └── index.html        # HTML base
│
├── resources/                # Recursos (íconos)
├── docs/                     # Documentación
├── dist/                     # Build del renderer (generado)
├── dist-electron/            # Build de Electron (generado)
├── release/                  # Ejecutables (generado)
│
├── package.json              # Dependencias y scripts
├── vite.config.ts            # Configuración de Vite
├── tailwind.config.js        # Configuración de Tailwind
└── tsconfig.json             # Configuración de TypeScript
```

---

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con hot-reload |
| `npm start` | Ejecuta Electron (requiere build previo) |
| `npm run build` | Compila para producción |
| `npm run build:electron` | Compila solo archivos de Electron |
| `npm run typecheck` | Verifica tipos de TypeScript |

---

## 🔄 Flujo de Trabajo

### Desarrollo Diario

1. **Iniciar desarrollo:**
   ```bash
   npm run dev
   ```
   Esto inicia Vite + Electron con hot-reload.

2. **Hacer cambios** en los archivos de `src/`

3. **Ver cambios** automáticamente en la aplicación

### Antes de Commit

```bash
# Verificar tipos
npm run typecheck

# Probar build de producción
npm run build
```

---

## 🐛 Solución de Problemas

### Pantalla negra al iniciar

**Causa:** El servidor de Vite no está corriendo.

**Solución:** Usa `npm run dev` en lugar de `npm start`.

### Error "WebView must be attached to DOM"

**Causa:** Se llaman métodos del webview antes de `dom-ready`.

**Solución:** Verificar que `isReady` sea `true` antes de llamar métodos.

### Errores de CORS al obtener títulos

**Causa:** La API oEmbed se llama desde el renderer.

**Solución:** Usa `window.electron.getVideoTitle()` que ejecuta en el main process.

### El ícono no aparece en la barra de tareas

**Causa:** El archivo `.ico` no tiene resolución mínima de 256x256.

**Solución:** Regenerar el ícono con mayor resolución.

---

## 📝 Convenciones de Código

### TypeScript

- Usar tipos explícitos en parámetros de funciones
- Preferir interfaces sobre types para objetos
- Usar `async/await` sobre `.then()`

### React

- Componentes funcionales con hooks
- Un componente por archivo
- Props tipadas con interfaces

### Git

- Commits en español con mensajes descriptivos
- Una feature por rama
- Squash antes de merge
