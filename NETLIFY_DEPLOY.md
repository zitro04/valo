# Cómo desplegar en Netlify (CalloutLab)

## Por qué no ves "dist" en GitHub

La carpeta **`dist`** no está en el repositorio (está en `.gitignore`). Es normal: se **genera** cuando ejecutas `npm run build` en tu PC o cuando Netlify hace el build. No se sube a GitHub.

---

## Opción A: Sitio conectado a GitHub (recomendado)

Netlify clona el repo, ejecuta `npm run build` en sus servidores, genera `dist` allí y publica esa carpeta. Tú no arrastras nada.

### 1. Crear el sitio en Netlify (si aún no lo tienes)

1. Entra en **https://app.netlify.com** e inicia sesión.
2. Clic en **"Add new site"** (o **"Añadir nuevo sitio"**).
3. Elige **"Import an existing project"**.
4. Clic en **"Deploy with GitHub"** (o **"Connect to Git provider"** → GitHub).
5. Autoriza Netlify si te lo pide y **elige el repositorio** (ej. `zitro04/valo`).
6. En la pantalla de configuración:
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build` (debe salir ya por el `netlify.toml`)
   - **Publish directory:** `dist`
7. Clic en **"Deploy site"** (o **"Deploy valo"**).

Netlify hará el build. Si falla por memoria, en el sitio → **Site configuration** → **Environment variables** añade `NODE_OPTIONS` = `--max-old-space-size=4096` y **Trigger deploy** de nuevo.

### 2. Dónde ver tu sitio

- En la barra lateral: **"Sites"**. Ahí aparece tu sitio (ej. "valo").
- Clic en el nombre del sitio → verás **Deploys**, **Domain management**, etc.
- La URL del sitio es algo como **https://algo-random-123.netlify.app** (en **Domain management** o arriba en el dashboard).

---

## Opción B: Arrastrar la carpeta (deploy manual)

Si el build en Netlify falla (p. ej. por memoria), puedes construir en tu PC y subir solo la carpeta `dist`.

### 1. Generar `dist` en tu PC

En la terminal:

```bash
cd /Users/itszitro/Desktop/Valoplant
npm install
npm run build
```

Se crea la carpeta **`dist`** dentro del proyecto (en el mismo nivel que `src/`).

### 2. Dónde arrastrar en Netlify

1. Entra en **https://app.netlify.com**.
2. En la barra lateral, **"Sites"**.
3. Si **ya tienes un sitio** (creado con GitHub):
   - Clic en el nombre del sitio.
   - Pestaña **"Deploys"**.
   - Arriba suele haber una zona **"Drag and drop your site output folder here"** / **"Need to upload a folder? Drag and drop your site output folder here"**. Arrastra ahí la carpeta **`dist`** (la que está dentro de Valoplant).
4. Si **no tienes sitio** y quieres solo arrastrar:
   - Clic en **"Add new site"** → **"Deploy manually"** (o **"Deploy without Git"**).
   - Te sale la zona de **drag and drop**. Arrastra la carpeta **`dist`** completa.

### 3. Qué arrastrar exactamente

- Abre en el Finder la ruta: **`/Users/itszitro/Desktop/Valoplant/dist`**.
- Arrastra **la carpeta `dist` entera** (no solo su contenido) a la zona de Netlify.

Dentro de `dist` debe haber: `index.html`, carpeta `assets/`, `manifest.json`, `bind_full_map.glb`, `_redirects`, etc.

---

## Resumen

| Pregunta | Respuesta |
|----------|-----------|
| ¿Por qué no hay `dist` en GitHub? | Porque se genera con `npm run build` y está en `.gitignore`. |
| ¿Dónde se crea `dist`? | En tu PC al hacer `npm run build`, o en los servidores de Netlify cuando el sitio está conectado a GitHub. |
| ¿Dónde arrastro la carpeta en Netlify? | En **Sites** → tu sitio → **Deploys** → zona "Drag and drop your site output folder here"; o al crear sitio con **Deploy manually**. |
| ¿Qué carpeta arrastro? | La carpeta **`dist`** (la que está dentro de Valoplant después de `npm run build`). |
