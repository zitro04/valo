# Valoplant — Callouts Pearl

Herramienta interactiva de callouts para el mapa **Pearl** de Valorant.

## Cómo usar

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (p. ej. `http://localhost:5173`).

- **Hover** sobre una zona: se resalta en cian.
- **Clic** en una zona: aparece un tooltip con el nombre del callout.
- **Modo Edición**: activa el interruptor "Modo Edición", haz clic en varios puntos del mapa para dibujar un polígono, **doble clic** para terminar, introduce el nombre de la zona. El objeto JSON se imprime en la consola (F12) y en pantalla; cópialo y pégalo en `src/data/callouts.json`.

## Estructura de datos

`src/data/callouts.json` es un array de objetos:

```json
{
  "id": "restaurante",
  "name": "Restaurante",
  "points": "560,560 760,560 760,760 560,760"
}
```

`points` son coordenadas del polígono SVG en el sistema del mapa (viewBox 0 0 1000 1000).

## Escalabilidad

Para un mapa nuevo: sustituye `public/pearl-icon.png` por la imagen del nuevo mapa y usa **Modo Edición** para dibujar las zonas. Las coordenadas se generan en el mismo sistema (1000×1000).

## App móvil (PWA) y hosting

La app está preparada como **PWA**: los jugadores pueden usarla en el móvil como si fuera una app.

1. **Publica la app** en un hosting (ver abajo).
2. **Comparte la URL** con tu equipo (ej. `https://valoplant.vercel.app`).
3. **En el móvil**: abren el enlace en Chrome/Safari → menú (⋮ o Compartir) → **“Añadir a la pantalla de inicio”** (o “Add to Home Screen”). El icono aparecerá en la pantalla de inicio y se abrirá a pantalla completa.

### Dónde hostear (gratis)

- **[Vercel](https://vercel.com)** (recomendado)
  1. Sube el proyecto a GitHub.
  2. En [vercel.com](https://vercel.com) → “Import Project” → elige el repo.
  3. Deploy. Te dan una URL tipo `valoplant.vercel.app`. Opcional: dominio propio en Settings.

- **[Netlify](https://netlify.com)**
  1. Sube a GitHub.
  2. Netlify → “Add new site” → “Import from Git” → elige el repo.
  3. Build command: `npm run build`. Publish directory: `dist`. Deploy.

- **GitHub Pages**
  1. En el repo: Settings → Pages → Source: “GitHub Actions” (o elige “Deploy from a branch” y rama `main`, carpeta `/dist`).
  2. Si usas Actions: crea `.github/workflows/deploy.yml` con un workflow que ejecute `npm run build` y suba `dist` a `gh-pages`. La URL será `https://tu-usuario.github.io/valoplant`.

Tras el primer deploy, cada vez que hagas push a la rama principal se redesplegará solo.

## Stack

- React (Vite)
- Tailwind CSS
- Estilo oscuro tipo Valorant (cian, rojo oscuro, negros)
