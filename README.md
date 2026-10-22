# Rebobina · archivo de videojuegos clásicos

Demo de un catálogo editorial de videojuegos retro, creado con Astro para servir de base al TFM. El sitio está en español y genera páginas estáticas desde 34 fichas Markdown tipadas. Sus siete géneros tienen contenido en las tres épocas del archivo.

## Empezar

La base de preparación usa Node.js **24.21.0** (`.node-version`), pnpm **12.4.1** (`packageManager`) y Python 3 para el servidor E2E. `engines.node` limita el proyecto a Node 24; Vercel selecciona su parche de esa rama. Las dependencias directas y transitivas están fijadas en `package.json` y `pnpm-lock.yaml`.

```sh
fnm use --install-if-missing
npm exec --yes --package=pnpm@12.4.1 -- pnpm install --frozen-lockfile
pnpm dev
```

Abre `http://localhost:4321`. Para generar el sitio estático:

```sh
pnpm build
pnpm preview
```

## Comprobaciones

```sh
pnpm build
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:e2e
```

`fnm` es una opción para seleccionar Node; cualquier gestor que respete `.node-version` sirve. Si pnpm no está instalado, usa el prefijo `npm exec --yes --package=pnpm@12.4.1 --` también para los demás comandos. La instalación congelada debe terminar sin cambiar el lockfile. pnpm 12 conserva en él tanto el gestor como las dependencias. `pnpm-workspace.yaml` registra la excepción puntual de antigüedad de la versión exacta de ESLint seleccionada, sin desactivar esa comprobación para otros paquetes.

ESLint comprueba Astro, TypeScript y JavaScript del repositorio con los conjuntos recomendados de JS, TypeScript y Astro. `astro check` usa TypeScript 6.0.3 compatible con Astro 7.3.8, e incluye `.astro`, `.ts` y `.mjs`, pruebas y configuración, mediante `allowJs` y `checkJs`. Se excluyen los artefactos generados. La lógica JavaScript de filtrado lleva JSDoc y conserva sus tres pruebas unitarias.

Playwright recorre el catálogo generado: búsqueda, filtros, acceso por género, cobertura de las tres épocas, limpieza, navegación y móvil con movimiento reducido. Añade una comprobación del SHA servido. `pnpm test:e2e` reconstruye el sitio y arranca su propio servidor Python en `127.0.0.1:4173`, que se detiene al terminar. Si el puerto está ocupado, falla: nunca reutiliza un servidor ajeno. Usa Chrome de macOS si está disponible, admite `CHROME_PATH` y, en su ausencia, usa Chromium de Playwright (`pnpm exec playwright install chromium`). Registra la ruta y versión efectiva del navegador con la evidencia.

`PLAYWRIGHT_OFFLINE=1` conserva un modo diagnóstico que intercepta peticiones con archivos de `dist/` y bloquea fuentes remotas; aun así se exige servidor propio. No acredita el contrato E2E normal ni Vercel. `CAPTURE_DEMO=1` añade capturas de portada, catálogo y ficha móvil a los resultados ignorados por Git. Registra cualquier modo especial; para el contrato deja ambas variables sin definir.

## Identificar la versión servida

Cada build genera `/version.json` con `{ "sha": "<SHA completo>", "dirty": false }`. En local obtiene el SHA de Git y marca `dirty: true` si hay cambios sin incorporar. Una copia local modificada no acredita el commit limpio. En Vercel exige `VERCEL_GIT_COMMIT_SHA` y falla si falta o no es un SHA completo; usa deployments desde la integración Git.

En Vercel, **Environment Variables → Enable access to System Environment Variables** debe estar activado. `vercel.json` ejecuta instalación congelada y build con pnpm 12.4.1 explícito: evita depender del pnpm que infiera Vercel a partir del formato del lockfile. El build imprime las versiones efectivas de Node y pnpm; conserva sus logs para observar el parche remoto.

Tras el check Vercel correcto, abre la URL inmutable de Preview con tu sesión autorizada y consulta `/version.json`; exige SHA igual al head de la PR y `dirty: false`. Revisa el diff y el comportamiento antes de aceptar ese SHA en GitHub. Una persona realiza el merge. Después comprueba el deployment Production y el dominio público: el marcador debe identificar el SHA resultante del merge, que puede diferir del head tras squash. Consulta el marcador sin caché. Un HTTP 200 aislado o una prueba local no acredita publicación. No desactives Deployment Protection para acceder a Preview.

Preparación: [issue #13 de la Factory](https://github.com/rubenbp/app-foundry/issues/13). El contrato y las evidencias se conservan en el repositorio de la Factory. Este trabajo queda separado de los futuros casos AFK; la introducción editorial y el filtro de dificultad siguen reservados para la evaluación.

## Rutas

- `/`: portada editorial con una selección del archivo.
- `/catalogo/`: búsqueda por título, género y plataforma.
- `/juegos/<id>/`: ficha individual generada desde Markdown.
- `/sobre-rebobina/`: propósito y principios del archivo.

## Añadir una ficha

1. Crea un archivo Markdown en `src/content/juegos/` con un nombre corto para la URL.
2. Copia los campos de una ficha existente. `src/content.config.ts` valida los datos al generar el sitio.
3. Escribe un resumen y las secciones `Por qué volver` y `Una partida para...`.
4. Añade un SVG original en `public/art/`, registra su clave en `src/data/game-art.ts` y elige una paleta disponible.
5. Completa el resumen, la dificultad editorial, la duración de una sesión y las tres ideas clave. Sigue los criterios de [`docs/contenido-demo.md`](docs/contenido-demo.md).

Campos actuales: `title`, `summary`, `year`, `platform`, `generation`, `genre`, `developer`, `publisher`, `players`, `playtime`, `rating`, `featured`, `visual`, `palette`, `tags`, `difficulty`, `session` y `highlights`.

Las puntuaciones y duraciones son valores de demostración. No representan reseñas verificadas ni datos oficiales.

## Estructura

```text
src/
├── components/       # Navegación, tarjetas e ilustración vectorial
├── content/juegos/   # Fichas Markdown del catálogo
├── data/             # Géneros, épocas y claves de ilustración
├── layouts/          # Marco común de las páginas
├── pages/            # Portada, catálogo, fichas y página editorial
├── scripts/          # Interacción progresiva del catálogo
└── styles/           # Tokens de marca y estilos responsive
tests/
├── unit/              # Filtrado del catálogo
└── e2e/               # Flujos principales en navegador
docs/
└── guia-de-marca.md  # Identidad visual, voz y accesibilidad
public/art/           # Un SVG original por juego
```

## Marca

Rebobina combina una base de papel cálido con tinta oscura, acento lima y detalles coral. La guía completa está en [`docs/guia-de-marca.md`](docs/guia-de-marca.md). Los tokens viven al principio de `src/styles/global.css`. Cada juego tiene una ilustración vectorial propia y animación sutil que respeta movimiento reducido.
