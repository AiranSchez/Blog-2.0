# Design — Airán Sánchez

## Estado

Sistema activo: **Kinetic Type / Cobalto editorial**.

Sustituye a Carbon / Citron. El sistema anterior queda archivado en
`output/design-archive/design-carbon-citron.md` como referencia histórica. No se
reutilizan sus tokens, tipografías ni decoraciones.

La Home y el shell nuevo están implementados en Astro. Blog, CV, Podcast, caso
JaponesApp y 404 se migran página a página con este mismo sistema.

## Idea

Una web editorial con energía cinética. La tipografía grande, el contraste y el
movimiento ordenan la lectura; el contenido real (proyecto, artículo, podcast,
trayectoria, actividad y recomendación) es la prueba. Nada de testimonios,
métricas o casos inventados.

## Fingerprint

- Género: editorial.
- Estructura: narrativa cinética, no una landing de secciones apiladas.
- Home: perfil → práctica → sobre mí → trabajo → escritura → escucha →
  trayectoria → recomendación → actividad → contacto.
- Shell: header fijo que se oculta al bajar, rail vertical de secciones, drawer
  móvil, footer de cierre y progreso de lectura.
- Voz: directa, cálida, específica. Sin superlativos de marketing.

## Tipografía

- Display: **DM Serif Display**, romana. Titulares grandes, nombre y frases
  editoriales. Nunca en textos pequeños ni en filas densas.
- Cuerpo y subtítulos: **Archivo** 400/500/600/700. Los títulos pequeños,
  tarjetas, filas de archivo y timeline usan Archivo 700.
- Datos y metadatos: **IBM Plex Mono** 400/500.
- Fallbacks japoneses: Hiragino Mincho / Yu Mincho / Noto Serif JP para display;
  Hiragino Sans / Yu Gothic / Noto Sans JP para cuerpo.
- Escala display: hero `clamp(3rem, 10.5vw, 10rem)`, página `clamp(2.4rem, 7.5vw, 8.5rem)`,
  sección `clamp(2rem, 6.2vw, 6.5rem)`. Leading 0.9–0.96 y tracking −0.03em.
- Metadatos mínimos a 12px. Cuerpo de lectura a 16px o más.

## Color

Tokens en `src/styles/kinetic-theme.css`:

| Rol | Claro | Oscuro |
|---|---|---|
| Papel | `#F3F0E9` | `#0B0B0C` |
| Superficie | `#E9E4DA` | `#141416` |
| Tinta | `#070707` | `#F2EFE6` |
| Secundaria | `#6B645A` | `#A8A198` |
| Regla | `#D4CDC0` | `#2A2825` |
| Señal | `#2E4BD8` | `#9DB1FF` |
| Señal sobre papel | `#F3F0E9` | `#0B0B0C` |

- El tema por defecto es **automático** y sigue `prefers-color-scheme`. El menú de
  tema ofrece automático, claro, oscuro y alto contraste; guarda `theme`.
- Alto contraste refuerza tinta, bordes y señal (`#0033cc` / `#ffd400`) y elimina
  decoración de bajo contraste.
- `#2E4BD8` sobre papel: 5.93:1. `#9DB1FF` sobre noche: 9.52:1.
- No se usan gradientes decorativos, cristal, sombras difusas ni paletas
  improvisadas dentro de componentes.
- La imagen de la app puede conservar su color real; no se tiñe con la señal.

## Layout

- Ancho máximo `90rem`; padding lateral `clamp(1.25rem, 4vw, 4rem)`.
- Header fijo de 72px + progreso de 4px. Se oculta al bajar; vuelve al subir.
- Rail vertical de secciones a la derecha en Home, visible desde 80rem.
- Grid de 12 columnas implícito mediante CSS Grid; `minmax(0, 1fr)` en todo
  track que contenga texto o medios.
- Móvil primero: 320, 375, 414, 768 y 1280px. Cero overflow del documento.
- Controles táctiles de 44px mínimo. Campos a 16px.

## Home

0. **Sobre mí**: relato editorial a dos columnas, ficha `profile.ts` copiable,
   idiomas, intereses y enlace al CV.
1. **Hero**: nombre en DM Serif, typewriter de rol, CV/trabajo, ubicación
   `Canarias ↔ España ↔ Japón`, años, retrato real y burst.
2. **Práctica**: escena pinneada; la palabra cambia entre entender, operar y
   evolucionar. En móvil cambia por scroll sin pin.
3. **Trabajo**: cabecera + rail horizontal con cuatro tarjetas iguales:
   vídeo real, modos, kanjis y estado. Sin números de sección.
4. **Escritura**: texto revelado, highlighter y último artículo real con portada.
5. **Escucha**: carrusel de ocho episodios reales, modal con reproductor.
6. **Trayectoria**: seis etapas en una lista editorial con fechas, duración,
   empresa, rol, contexto visible y tecnologías. Sin acordeones. Debajo, cinco
   áreas de capacidad con sus tecnologías, sin años inventados ni listas de 40
   logos.
7. **Recomendación**: solo la real; cita grande, autor con contexto y modal
   accesible para el texto completo. Nunca placeholders.
8. **Actividad**: snapshot verificado de GitHub, cuatro cifras (totales, días
   activos, racha actual y media), gráfico mensual con **TanStack Charts** y
   calendario del año en curso; enlace al perfil y fecha de captura.
9. **Contacto**: correo directo y formulario real Web3Forms.
10. **Footer**: cierre de carta, enlaces y colofón.

## Caso JaponesApp

- Hero con nombre, resumen y póster real.
- Ficha de estado, stack, rol y grabación.
- Qué hace, capturas reales con lightbox, compartir y copiar enlace.
- Grabación real del simulador con controles y caption honesta.
- Decisiones en tarjetas apiladas.
- Proceso en timeline de tres fases.
- Límites explícitos: prototipo, sin descarga pública, sin métricas de usuarios.
- Enlace de vuelta y CTA al CV.

## Blog, CV y podcast

- Blog: archivo con pestañas de categoría, selector de año, paginación de 6,
  tiempo de lectura y RSS por idioma; artículo con comentarios rediseñados,
  relacionados y rutas traducidas.
- CV: una página densa y legible, con índice sticky, timeline, cinco áreas de
  capacidad, formación, idiomas (ES nativo, EN B2, JA N4/N3) y descargas
  ES/EN/JA.
- Podcast: carrusel de 8, archivo con «Ver más», modal y enlaces a iVoox.
- Legal: privacidad, aviso legal y accesibilidad en ES/EN/JA, enlazadas desde
  el pie.
- Conservan rutas, contenido, i18n y proveedores reales.

## Movimiento

- GSAP + ScrollTrigger local, no CDN.
- TanStack Charts 1.5 para el gráfico mensual de contribuciones (`mountChart`,
  host DOM, SVG accesible y tooltip).
- Muestras clave: mask reveal, typewriter, pop-in, burst, count-up, parallax
  puntual, pinning, scroll horizontal, texto revelado, highlighter, timeline,
  stacking, carrusel, modal, drawer, progreso y transición.
- El rail horizontal se pinnea en desktop; en móvil se apila.
- El vídeo de la tarjeta de JaponesApp se reproduce en silencio y en bucle.
  Es una excepción deliberada al “sin autoplay” del sistema anterior.
- `prefers-reduced-motion`: sin parallax, pinning, typewriter, contadores ni
  autoplay; el contenido queda visible.
- El movimiento nunca es la única forma de acceder a contenido o estado.

## Componentes y estados

- Header, drawer, language switch, theme menu, command palette (⌘/Ctrl+K),
  progress, back-to-top.
- Rail de secciones con estado activo.
- Tarjetas de trabajo, tarjetas de episodio, timeline, ficha, formulario.
- Modal de episodio, tooltip de duración, toast/estado de formulario.
- Foco visible `2px` en señal; hover con subrayado o desplazamiento mínimo.
- Formularios con labels flotantes, validación nativa, estado de envío y error.

## i18n

- ES/EN/JA en rutas `/{locale}/`; el selector conserva la ruta actual.
- Home, artículo, podcast y experiencia del CV se renderizan desde datos
  traducidos. El cuerpo del artículo, detalles del caso y extras del CV pueden
  quedar en español con una nota mientras se migran.
- Fechas y duraciones se formatean con `Intl`; las duraciones se calculan por
  meses desde `startDate`/`endDate`.
- El contenido japonés no se fuerza a mayúsculas ni a tracking negativo extremo.

## Accesibilidad

- Un `h1` por página; jerarquía de encabezados sin saltos.
- Skip link, landmarks, `aria-current`, `aria-label` en controles.
- Contraste AA en texto y controles.
- `prefers-reduced-motion` no opcional.
- El vídeo decorativo se pausa con movimiento reducido.
- Calendario de actividad con etiquetas de fecha y conteo; sin depender del color.
- El formulario conserva el proveedor y el borrador ante error.

## Implementación

- `src/layouts/KineticLayout.astro`: shell.
- `src/pages/[locale]/index.astro`: Home.
- `src/scripts/kinetic-home.ts`: movimiento, carrusel, modal y rail.
- `src/styles/kinetic.css` + `src/styles/kinetic-theme.css`: sistema visual.
- `src/components/home/KineticActivity.astro` y `KineticTestimonial.astro`:
  actividad y recomendación.
- `public/kinetic/`: retrato, vídeo, póster y capturas reales.
- `public/cv/`: CV ES/EN/JA de una página y JSON Resume.
- `scripts/generate-cv-artifacts.py`: generador de CV.

## Reglas

- No inventar testimonios, proyectos, métricas ni resultados.
- No usar imágenes de relleno ni marcos falsos de dispositivo.
- No romper rutas, contenido, comentarios, i18n ni el formulario real.
- Mantener el contenido largo real en español hasta tener su traducción.
- Cualquier página nueva debe usar el shell y los tokens de este documento.
