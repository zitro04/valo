# CalloutLab

App para callouts de Valorant: mapas interactivos, práctica, exámenes y vista 3D (Bind).

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview   # previsualizar dist/
```

## Despliegue en Vercel

1. Sube el repo a GitHub (si no está ya):
   ```bash
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```

2. En [vercel.com](https://vercel.com): **Add New** → **Project** → importa el repo de GitHub.

3. Vercel detecta Vite; deja por defecto:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Deploy**. Las rutas (`/`, `/callouts`, `/historial`, etc.) funcionan gracias a `vercel.json` (rewrite a `index.html`).

**Si el build falla por "Out of Memory" (OOM):** en el proyecto Vercel → **Settings** → **Environment Variables** añade:
- **Name:** `NODE_OPTIONS`
- **Value:** `--max-old-space-size=4096`  
Vuelve a desplegar. Si sigue fallando, prueba con `8192`.

No hace falta base de datos ni variables de entorno; todo usa `localStorage` en el navegador.

## Alternativas para probar con libertad

- **Vercel** (con `NODE_OPTIONS` arriba): despliegue automático desde GitHub.
- **Netlify**: [netlify.com](https://netlify.com) → importar repo, build `npm run build`, publish `dist`. Suele dar algo más de margen en memoria.
- **GitHub Pages** (sin build en la nube): haz `npm run build` en tu PC, luego sube la carpeta `dist` a la rama `gh-pages` o usa **Actions** para publicar `dist`. No se hace build en sus servidores, así que no hay OOM.
- **Cloudflare Pages**: [pages.cloudflare.com](https://pages.cloudflare.com) → conectar repo, build igual que Vite.
- **Render** (static): [render.com](https://render.com) → Static Site, mismo comando de build y `dist`.
