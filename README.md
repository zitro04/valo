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

No hace falta base de datos ni variables de entorno; todo usa `localStorage` en el navegador.
