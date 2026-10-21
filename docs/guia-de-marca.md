# Guía de marca · Rebobina

## Idea de marca

**Rebobina** es un archivo editorial de videojuegos clásicos. Ayuda a elegir qué jugar ahora y da contexto para regresar a títulos que todavía tienen algo que ofrecer.

**Promesa:** una buena ficha convierte la nostalgia en una próxima partida.

**Personalidad:** cercana, curiosa, selectiva y juguetona. Habla como alguien que conoce el catálogo y disfruta recomendándolo, sin ponerse por encima del lector.

**Lema:** *Un archivo para volver a jugar.*

## Identidad visual

La marca mezcla papel de archivo, interfaces de consola y pequeños acentos de color. La nostalgia aparece en los píxeles, las etiquetas técnicas y el vocabulario de juego. La composición y la lectura siguen siendo actuales.

### Paleta

| Token CSS | Color | Uso |
| --- | --- | --- |
| `--paper` | `#F3F0E8` | Fondo general cálido |
| `--paper-deep` | `#E9E5DA` | Bandas y superficies secundarias |
| `--surface` | `#FBFAF6` | Tarjetas y controles |
| `--ink` | `#171917` | Texto, navegación y superficies oscuras |
| `--muted` | `#716E65` | Metadatos y texto auxiliar |
| `--acid` | `#D5ED77` | Acento positivo, llamadas y selección |
| `--tomato` | `#EF7256` | Acento de marca y detalles cálidos |
| `--line` | `#DCD8CE` | Bordes y separadores |

Las ilustraciones usan una paleta complementaria: lima, azul, naranja, rosa, violeta y cielo. Cada juego tiene una escena vectorial propia en `public/art/`, compuesta en `GameArt.astro`; sus formas evocan su mundo y su género sin copiar carátulas ni capturas. Mantén el texto fuera de las ilustraciones para conservar contraste y proporción.

### Tipografía

- **Titulares y marca:** Manrope, peso 700–800, tracking cerrado. El sistema cae a Avenir Next o `system-ui` si la fuente remota no carga.
- **Texto corrido:** Manrope, pesos 400–600, interlineado entre 1.6 y 1.85.
- **Etiquetas y datos:** DM Mono, peso 400–500. Reserva mayúsculas y espaciado para códigos, años y categorías.

Las familias web se cargan desde Google Fonts. Las pilas de respaldo permiten leer el sitio si el navegador no tiene conexión.

### Forma y composición

- Usa una retícula centrada de hasta 1260 px, con márgenes laterales de 32 px en escritorio y 18 px en móvil.
- Las tarjetas usan radios entre 12 y 18 px. Los paneles principales usan radios entre 20 y 28 px.
- Deja aire alrededor de los titulares. Evita usar adornos retro en cada sección.
- Anima los píxeles y estados interactivos con movimientos breves y discretos. Desactiva las animaciones no esenciales con `prefers-reduced-motion`.
- La ficha prioriza título, plataforma, año y género; después explica por qué volver y para quién puede encajar.
- Usa ilustración vectorial original, bloques de color y patrones de píxel. No dependas de capturas o carátulas ajenas para que el catálogo sea reconocible.

## Voz y contenido

- Escribe en español directo, cálido y concreto.
- Habla de sensaciones de juego con ejemplos: rutas, sesiones, ritmo, exploración o juego local.
- Evita exageraciones, jerga nostálgica vacía y afirmaciones que no ayudan a elegir.
- Cada ficha incluye una descripción breve, «Por qué volver», «Cómo se juega», «Tu primera partida», un perfil de jugador, «Ten en cuenta» y datos estructurados. Las tres ideas clave y el índice ayudan a decidir antes de leerlo todo.
- Indica la edición o plataforma cuando cambie el contexto de la ficha.
- En esta demo, las puntuaciones y duraciones son valores editoriales de ejemplo; no son reseñas ni mediciones verificadas.

## Accesibilidad

- Mantén contraste de texto suficiente sobre papel, lima y superficies oscuras.
- Conserva los estados de foco visibles y el enlace para saltar al contenido.
- Las ilustraciones son decorativas y se ocultan a tecnologías de asistencia.
- Los filtros usan botones con `aria-pressed`; el contador de resultados usa una región viva.
- Respeta `prefers-reduced-motion` y no dependas del color para identificar un control activo.

## Componentes de marca

- `SiteHeader.astro`: marca, rutas principales y acceso al catálogo.
- `GameCard.astro`: resumen navegable de una ficha.
- `GameArt.astro`: ilustración vectorial específica para cada juego y paleta.
- `SiteLayout.astro`: idioma, metadatos, estilos y estructura compartida.
- `SiteMotion.astro`: revelado progresivo de secciones, una vez por visita.

## Movimiento

| Token | Valor | Uso |
| --- | --- | --- |
| `--motion-fast` | 160 ms | Hover, foco y salida |
| `--motion-ui` | 240 ms | Selección, botones y entrada de página |
| `--motion-reveal` | 560 ms | Aparición de secciones |
| `--ease-settle` | `cubic-bezier(.2, .7, .2, 1)` | Curva común sin rebote |

La portada presenta primero la ilustración, después el titular y por último las acciones. El revelado al desplazarse se reproduce una vez y usa una distancia de 18 px. Las tarjetas se escalonan 50 ms, hasta un máximo de 150 ms. Los filtros actualizan el contenido inmediatamente; cuando hay soporte, las transiciones de vista mantienen la continuidad de las imágenes. La ilustración y el título se relacionan visualmente al abrir una ficha mediante transiciones nativas entre documentos.

Con movimiento reducido, todo el contenido permanece visible, las transiciones de navegación se desactivan y los adornos se detienen. Sin JavaScript, las fichas y enlaces siguen siendo accesibles y ningún contenido queda oculto. La mejora visual utiliza CSS y `IntersectionObserver`, sin una biblioteca de animación adicional.

Los tokens viven en `src/styles/global.css`. Cuando cambies un color de marca, actualiza la tabla de esta guía y el token correspondiente en la hoja global.
