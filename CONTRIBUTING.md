# Contribuir a YouTube Desktop

¡Primero, gracias por considerar contribuir a YouTube Desktop! 🎉

## ¿Cómo Puedo Contribuir?

### Reportar Errores

Antes de crear un reporte de error, revisa los issues existentes para evitar duplicados.

Al crear un reporte, incluye:
- **Título claro** describiendo el problema
- **Pasos para reproducir** el comportamiento
- **Comportamiento esperado** vs lo que realmente pasó
- **Capturas de pantalla** si aplica
- **Tu entorno** (SO, versión de Node, etc.)

### Sugerir Funcionalidades

¡Las sugerencias son bienvenidas! Por favor:
- Verifica si la funcionalidad ya fue sugerida
- Proporciona una descripción clara de la característica
- Explica por qué esta funcionalidad sería útil

### Pull Requests

1. **Haz fork** del repositorio y crea tu rama desde `main`
2. **Instala** dependencias: `npm install`
3. **Realiza tus cambios** y pruébalos
4. **Haz commit** con mensajes claros y descriptivos
5. **Push** a tu fork y envía un PR

## Configuración de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo (Vite + Electron con hot-reload)
npm run dev

# Verificar tipos
npm run typecheck

# Compilar para producción
npm run build
```

## Estilo de Código

- Usa TypeScript para todo código nuevo
- Sigue el estilo de código existente
- Usa nombres descriptivos para variables y funciones
- Agrega comentarios para lógica compleja
- Commits en español con mensajes descriptivos

## Estructura del Proyecto

| Carpeta | Contenido |
|---------|-----------|
| `src/main/` | Proceso principal de Electron |
| `src/preload/` | Scripts de preload para IPC seguro |
| `src/renderer/` | Frontend React |
| `docs/` | Documentación |

## ¿Preguntas?

Siéntete libre de abrir un issue con la etiqueta "pregunta".

¡Gracias por contribuir! 💪
