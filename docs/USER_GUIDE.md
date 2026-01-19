# Manual de Usuario - YouTube Desktop

## 📥 Instalación

### Windows

1. Descarga la carpeta `YouTube Desktop-win32-x64` desde la carpeta `release/`
2. Copia la carpeta a una ubicación permanente (ej: `C:\Programas\YouTube Desktop`)
3. Ejecuta `YouTube Desktop.exe`

> **Tip:** Crea un acceso directo en el escritorio arrastrando el `.exe` mientras mantienes `Alt`.

---

## 🖥️ Interfaz Principal

```
┌────────────────────────────────────────────────────────┐
│ [–] [□] [×]                    YouTube Desktop         │  ← Barra de título
├────────────────────────────────────────────────────────┤
│ [◄] [►] [↻]  │ YouTube │ Video 1 │ Video 2 │  [+]    │  ← Pestañas
├────────────────────────────────────────────────────────┤
│                                                        │
│                                                        │
│                   Contenido de YouTube                 │
│                                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Elementos de la Interfaz

| Elemento | Descripción |
|----------|-------------|
| **Barra de título** | Controles de ventana (minimizar, maximizar, cerrar) |
| **Botones de navegación** | Atrás, adelante, recargar |
| **Pestañas** | Muestra las páginas abiertas (arrastrables) |
| **Botón [+]** | Abre una nueva pestaña |

---

## 📑 Gestión de Pestañas

### Abrir Nueva Pestaña

- **Método 1:** Clic en el botón `[+]`
- **Método 2:** Atajo `Ctrl + T`
- **Método 3:** Clic derecho en un enlace → "Abrir en nueva pestaña"

### Cerrar Pestaña

- **Método 1:** Clic en la `×` de la pestaña
- **Método 2:** Atajo `Ctrl + W`

### Reordenar Pestañas

Arrastra una pestaña y suéltala en la nueva posición.

### Abrir Enlace en Segundo Plano

Mantén `Ctrl` y haz clic en cualquier enlace. Se abrirá en una nueva pestaña sin cambiar el foco.

---

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + T` | Nueva pestaña |
| `Ctrl + W` | Cerrar pestaña actual |
| `Ctrl + Clic` | Abrir enlace en nueva pestaña (fondo) |
| `F11` | Pantalla completa (del video) |

---

## 🖱️ Menú Contextual

Haz clic derecho en cualquier parte de la página para ver las opciones:

**Sobre un enlace:**
- Abrir en nueva pestaña
- Copiar enlace

**En cualquier lugar:**
- Copiar
- Pegar
- Recargar página
- Atrás / Adelante

---

## 💾 Persistencia de Sesión

YouTube Desktop guarda automáticamente:

- ✅ Pestañas abiertas y sus URLs
- ✅ Posición y tamaño de la ventana
- ✅ Estado maximizado/normal

Al cerrar y reabrir la aplicación, todo se restaura.

---

## ❓ Preguntas Frecuentes

### ¿Por qué la aplicación empieza en negro?

Puede tardar unos segundos en cargar YouTube. Si persiste más de 10 segundos, cierra y vuelve a abrir.

### ¿Puedo ver videos en segundo plano?

Sí, YouTube Desktop permite reproducir audio mientras la ventana está minimizada.

### ¿Bloquea anuncios?

Incluye un bloqueo básico de dominios de publicidad. No es tan completo como uBlock Origin, pero reduce la cantidad de anuncios.

### ¿Funciona sin internet?

No, requiere conexión a internet para cargar YouTube.

### ¿Puedo iniciar sesión en mi cuenta de YouTube?

Sí, puedes iniciar sesión normalmente. Las cookies se guardan en la sesión de Electron.
