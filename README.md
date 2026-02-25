# CalloutLab - Guía de Usuario

Herramienta de escritorio para jugadores de Valorant. Aprende callouts, guarda lineups, planifica estrategias y lleva el control de tu progreso, todo sin necesidad de internet una vez instalada.

---

## Instalación

1. Descarga el archivo `.exe` desde la página de descargas que te haya pasado tu coach/IGL.
2. Haz doble clic en el instalador y sigue los pasos.
3. Una vez instalada, encontrarás **CalloutLab** en tu escritorio como cualquier otra app.

> Si Windows muestra un aviso de "App no reconocida", haz clic en **Más información** y luego en **Ejecutar de todas formas**. Es normal en apps nuevas que no tienen firma de Microsoft.

---

## Navegación

La app tiene un **menú lateral** (sidebar) a la izquierda con todas las secciones. En móvil o pantalla pequeña, se abre con el botón de hamburguesa (☰) arriba a la izquierda.

### Atajos de teclado

| Tecla | Acción |
|-------|--------|
| `1` | Ir a Inicio |
| `2` | Ir a Callouts |
| `3` | Ir a Lineups |
| `4` | Ir a Estrategias |
| `5` | Ir a Historial |
| `6` | Ir a Composiciones |
| `7` | Ir a Notas |
| `T` | Cambiar entre tema oscuro y claro |

> Los atajos no funcionan cuando estás escribiendo en un campo de texto.

---

## Secciones

### 1. Inicio

Pantalla principal con acceso rápido a todas las secciones. Cada tarjeta muestra una breve descripción de lo que encontrarás dentro.

---

### 2. Callouts

La sección principal de la app. Aquí aprendes, practicas y te examinas de los nombres de las zonas de cada mapa.

#### Seleccionar mapa
- Arriba del todo verás los botones con los nombres de los mapas (Pearl, Bind, Corrode, etc.).
- Haz clic en el mapa que quieras estudiar.

#### Pestañas del mapa

- **Mapa con zonas**: El mapa con todas las zonas marcadas e interactivas. Esta es la vista principal.
- **Imagen detallada**: Una imagen de referencia del mapa sin zonas (útil para ver detalles del layout).
- **Vista 3D**: Disponible solo en Bind. Un modelo 3D del mapa que puedes rotar y explorar.

#### Ver las zonas
- Pasa el ratón por encima de una zona del mapa para ver su nombre.
- En el panel lateral derecho aparece la lista completa de zonas. Haz clic en cualquiera para resaltarla en el mapa.
- Usa la **barra de búsqueda** para encontrar una zona por nombre.

#### Zoom y desplazamiento
- **Zoom**: Usa la rueda del ratón sobre el mapa para acercar/alejar.
- **Mover el mapa**: Mantén pulsada la tecla `Alt` y arrastra con el ratón para desplazarte.
- Aparecerá un botón **"Reset"** para volver a la vista original.

#### Modo Práctica
Hay dos modos de práctica:

- **Nombre → Mapa**: La app te dice el nombre de una zona y tú la buscas en el mapa haciendo clic.
- **Mapa → Nombre**: La app resalta una zona en el mapa y tú escribes su nombre.

Para activarlo, haz clic en el botón **Practicar** en el panel lateral.

#### Modo Examen
Un examen de 20 preguntas donde la app te pide que identifiques zonas en el mapa.

- Haz clic en **Modo examen** (solo disponible en la pestaña "Mapa con zonas").
- Selecciona tu nombre de jugador.
- Opciones del examen:
  - **Contrarreloj**: Activa un temporizador por pregunta (configurable: 5, 10, 15, 20 o 30 segundos).
  - **Dificultad progresiva**: La app recuerda qué zonas fallas más y te las pregunta con más frecuencia.
- La app te muestra el nombre de una zona arriba y tú haces clic en ella en el mapa.
- Al final ves tu puntuación (aciertos/fallos) y se guarda en el historial.

#### Modo Edición (solo para el coach/IGL)
- Haz clic en **Modo Edición** para dibujar nuevas zonas en el mapa.
- Haz clic en los vértices del polígono sobre el mapa.
- Cuando termines la forma, haz clic en **Terminar polígono** y ponle un nombre.
- Para deshacer el último punto, usa el botón **Deshacer**.

#### Importar / Exportar callouts
- **Exportar**: Copia todas las zonas del mapa actual como JSON (para compartir o hacer backup).
- **Importar**: Pega un JSON de zonas para cargarlas.
- **Restablecer**: Vuelve a las zonas originales del mapa.

---

### 3. Lineups

Guarda las posiciones de tus lineups favoritos directamente sobre el mapa.

#### Añadir un lineup
1. Selecciona el mapa.
2. Haz clic en **Añadir lineup**.
3. Haz clic en la posición del mapa donde se lanza el lineup.
4. Se abre un formulario donde pones:
   - **Nombre** del lineup (ej: "Smoke de A desde Spawn").
   - **Agente** (Viper, Brimstone, Sova, etc.).
   - **Tipo de habilidad** (Humo, Flash, Molotov, Recon, Muro, Ulti, Otro).
   - **Link** de TikTok o YouTube con el tutorial del lineup.
   - **Imagen** (puedes subir una captura de pantalla).
   - **Notas** adicionales.
5. Haz clic en **Guardar**.

#### Ver lineups
- Los lineups guardados aparecen como marcadores en el mapa y en la lista lateral.
- Haz clic en un lineup para ver sus detalles, imagen y link.
- Puedes **filtrar** por agente o tipo de habilidad.
- Cada lineup se puede **eliminar** individualmente.

---

### 4. Estrategias

Dibuja rutas de hasta 5 jugadores directamente sobre el mapa para planificar ejecuciones, rotaciones o defaults.

#### Crear una estrategia
1. Selecciona el mapa.
2. Haz clic en **Nueva estrategia**.
3. Ponle un nombre (ej: "Exec A con Viper").
4. Selecciona un jugador (J1 a J5, cada uno con un color diferente):
   - J1 = Rojo
   - J2 = Azul
   - J3 = Verde
   - J4 = Amarillo
   - J5 = Morado
5. Haz clic sobre el mapa para ir trazando la ruta de ese jugador.
6. Cambia de jugador y repite.
7. Usa **Deshacer** para borrar el último punto.
8. Cuando acabes, haz clic en **Guardar**.

#### Ver estrategias
- Haz clic en una estrategia guardada de la lista para ver las rutas dibujadas sobre el mapa.
- Puedes eliminar cualquier estrategia.

---

### 5. Historial

Aquí se guardan los resultados de todos tus exámenes de callouts.

#### Estadísticas generales
- **Total de exámenes** realizados.
- **Media** de aciertos en porcentaje.
- **Mejor** y **peor** resultado.

#### Gráfico de progreso
- Un gráfico de barras con los últimos 10 exámenes para que veas cómo vas mejorando.

#### Estadísticas por mapa
- Cuántos exámenes has hecho en cada mapa y tu media de aciertos.
- Una barra de progreso visual para cada mapa.

#### Lista de resultados
- Todos los exámenes con la fecha, mapa, puntuación y porcentaje.

#### Exportar datos
- Puedes exportar todos tus resultados para tenerlos guardados fuera de la app.

---

### 6. Composiciones

Guarda tus composiciones de agentes (comps) favoritas para cada mapa, separadas por lado (ataque o defensa).

#### Crear una composición
1. Selecciona el mapa.
2. Haz clic en **Nueva composición**.
3. Ponle un nombre (ej: "Comp agresiva A").
4. Selecciona el lado: **Ataque** o **Defensa**.
5. Elige hasta 5 agentes. Están organizados por rol:
   - **Duelista**: Jett, Reyna, Raze, Phoenix, Yoru, Neon, Iso, Waylay
   - **Controlador**: Viper, Brimstone, Omen, Astra, Harbor, Clove, Tejo
   - **Iniciador**: Sova, Breach, Skye, KAY/O, Fade, Gekko, Vyse
   - **Centinela**: Killjoy, Cypher, Sage, Chamber, Deadlock
6. Haz clic en **Guardar**.

#### Ver composiciones
- Las comps guardadas aparecen en la lista con los nombres de los agentes coloreados por rol.
- Puedes eliminar cualquier composición.

---

### 7. Notas

Un bloc de notas personal para cada mapa. Escribe lo que quieras: tips, timings, callouts especiales, strats, lo que se te ocurra.

- Selecciona el mapa.
- Escribe en el cuadro de texto.
- **Se guarda automáticamente** mientras escribes (verás un indicador "Guardado" cuando se haya guardado).
- El contador de caracteres te muestra cuánto has escrito.

---

## Tema oscuro / claro

- La app viene en modo oscuro por defecto.
- Para cambiar al modo claro, pulsa la tecla `T` o usa el botón de tema en la parte inferior del menú lateral.
- Tu preferencia se recuerda entre sesiones.

---

## Mapas disponibles

| Mapa | Imagen del mapa | Zonas predefinidas | Modelo 3D |
|------|:-:|:-:|:-:|
| Pearl | Si | Si | No |
| Bind | Si | Si | Si |
| Corrode | Si | Si | No |
| Ascent | Si | Si (si importas/creas zonas) | No |
| Haven | Si | Si (si importas/creas zonas) | No |
| Icebox | Si | Si (si importas/creas zonas) | No |
| Split | Si | Si (si importas/creas zonas) | No |
| Breeze | Si | Si (si importas/creas zonas) | No |
| Fracture | Si | Si (si importas/creas zonas) | No |
| Lotus | Si | Si (si importas/creas zonas) | No |
| Sunset | Si | Si (si importas/creas zonas) | No |

> Ya están cargadas las imágenes simples de todos esos mapas. Si quieres examen/práctica con zonas en cada uno, importa o dibuja sus callouts.

---

## Preguntas frecuentes

**¿Necesito internet para usar la app?**
No. Una vez instalada, la app funciona sin internet. Solo necesitas conexión la primera vez que la abres para una verificación rápida.

**¿Dónde se guardan mis datos?**
Todo se guarda localmente en tu ordenador. Tus zonas, lineups, estrategias, composiciones, notas y resultados de exámenes no se suben a ningún servidor.

**¿Puedo perder mis datos?**
Si desinstalas la app o limpias los datos del navegador interno, sí. Usa la opción de **exportar** en la sección de callouts e historial para hacer backups.

**¿Windows me avisa de que la app es peligrosa?**
Es normal. Como la app no tiene firma digital de Microsoft, Windows SmartScreen muestra un aviso. Haz clic en "Más información" → "Ejecutar de todas formas".

**¿Cómo actualizo la app?**
Tu coach/IGL te pasará el nuevo instalador cuando haya una versión nueva. Solo tienes que instalarlo encima y tus datos se mantienen.

---

## Versión

CalloutLab v1.0.0

Developer zitro04

Desarrollado para equipos de Valorant.
