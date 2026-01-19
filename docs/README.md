# Documentación - YouTube Desktop

Bienvenido a la documentación de YouTube Desktop, una aplicación de escritorio dedicada para YouTube.

---

## 📚 Índice de Documentación

| Documento | Descripción |
|-----------|-------------|
| [📐 Arquitectura](ARCHITECTURE.md) | Estructura técnica, procesos y flujo de datos |
| [🔌 API e IPC](API.md) | Comunicación entre procesos y APIs expuestas |
| [🔧 Guía de Desarrollo](DEVELOPMENT.md) | Configuración, scripts y solución de problemas |
| [📖 Manual de Usuario](USER_GUIDE.md) | Instrucciones de uso, atajos y FAQ |

---

## 🚀 Inicio Rápido

### Para Usuarios

1. Descarga la carpeta `YouTube Desktop-win32-x64` desde `release/`
2. Ejecuta `YouTube Desktop.exe`
3. ¡Disfruta de YouTube sin distracciones!

### Para Desarrolladores

```bash
# Clonar e instalar
git clone https://github.com/pablopez7/YouTube-Desk.git
cd YouTube-Desk
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build
```

---

## 📁 Estructura del Proyecto

```
YouTube-Desk/
├── src/
│   ├── main/           # Proceso Electron
│   ├── preload/        # Puente IPC
│   └── renderer/       # React UI
├── docs/               # Esta documentación
├── resources/          # Íconos
└── release/            # Ejecutables compilados
```

---

## 🔗 Enlaces Útiles

- **Repositorio:** [github.com/pablopez7/YouTube-Desk](https://github.com/pablopez7/YouTube-Desk)
- **README Principal:** [README.md](../README.md)
- **Changelog:** [CHANGELOG.md](../CHANGELOG.md)
- **Contribuir:** [CONTRIBUTING.md](../CONTRIBUTING.md)
