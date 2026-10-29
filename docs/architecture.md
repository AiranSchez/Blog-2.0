# Arquitectura del repositorio

## Decisión

Arquitectura ligera por funcionalidades sobre las convenciones de Astro. No hay capas vacías ni se ha trasladado todo `src` a una plantilla. Los límites nuevos tienen responsabilidades y pruebas reales: comentarios, integraciones y rutas de artículos.

## Mapa actual

| Área | Responsabilidad |
| --- | --- |
| `src/pages/` | Páginas localizadas y adaptadores HTTP de APIs: leer entrada, invocar comportamiento y convertir resultados en respuestas. |
| `src/layouts/` | Documento HTML, navegación y pie compartidos. `layouts/Header.astro` es el único Header. |
| `src/components/home/`, `blog/`, `podcast/` | Presentación e interactividad agrupadas por funcionalidad. |
| `src/components/shared/` | Componentes visuales reutilizables; no un lugar para reglas de servidor. |
| `src/features/comments/` | Reglas, casos de uso y contrato `CommentsRepository`, sin Astro, Supabase, HTTP ni UI. |
| `src/features/github-activity.ts` | Calendario normalizado, validación y cálculos puros de contribuciones. No consulta proveedores. |
| `src/features/blog/` | URLs de artículos, identidad de traducción y claves persistentes de comentarios: conceptos separados. |
| `src/server/` | Adaptadores de Supabase, LibreTranslate y GitHub, implementación del repositorio e IP hashing. Nunca se importa desde el navegador. |
| `src/client/` | Cliente Supabase anónimo para Realtime, sin acceso a secretos del servidor. |
| `src/content/` | Artículos Markdown, about MDX y datos; colecciones existentes `type: content/data` en `config.ts`. |
| `src/data/` | Datos de home/CV y registro histórico `blog-legacy-routes.json`. |
| `src/services/`, `src/i18n/` | Servicios compartidos y una sola implementación i18n: `services/i18n.ts` + `i18n/translations.ts`. El texto exclusivo de una funcionalidad puede seguir junto a ella. |
| `src/styles/` y `tokens.css` | Layout → global.css → variables.css → tokens.css. `editorial.css` importa 13 módulos ordenados por responsabilidad. |
| `public/` | Recursos servidos directamente, incluidos artefactos del CV. |
| `tests/unit/`, `tests/build/`, `e2e/` | Reglas y límites de imports, artefactos construidos y comportamiento en navegador. |

Stack declarado: Astro 5.18.0, React 19, Tailwind 3; Framer Motion, GSAP y OGL. OGL no es Three.js. Las versiones resueltas están en `bun.lock`. La comprobación de tipos añade herramientas de desarrollo, no nuevas dependencias de producción.

## Flujos y dirección de dependencias

```text
Página Astro → datos/contenido → layouts/componentes → HTML/islas React
Isla de comentarios → HTTP → ruta API → caso de uso → CommentsRepository
                                                  ↑ implementa
                                         adaptador Supabase (server)
Isla de comentarios → cliente anónimo (client) → Supabase Realtime
Ruta de traducción → adaptador LibreTranslate (server)
Formulario de contacto → Web3Forms (navegador, envío público)
Home Astro → server/github-activity → calendario público GitHub → snapshot normalizado
                                    ↘ captura local verificada si falla el proveedor
```

La ruta de comentarios crea el adaptador y entrega tiempo/IP ya transformados al caso de uso. Las pruebas usan un repositorio en memoria y un instante fijo. Las funciones de árbol y limpieza de contenido ya no viven en UI. El código visual conserva formato relativo de fechas y preferencias locales de reacciones.

Cambiar el proveedor de comentarios requiere implementar el contrato, pero reemplazar Supabase también implica persistencia, políticas y Realtime. Cambiar Astro/React afectaría al renderizado, rutas e interactividad; una buena organización no hace gratuita esa migración.

La actividad GitHub se consulta una vez por renderizado/build, compartida entre idiomas. No usa credenciales ni una API nueva. Las páginas estáticas muestran la fecha de captura y solo cambian al reconstruir; el adaptador conserva `src/data/github-activity.json` si falla la consulta o el formato. El navegador recibe solo fechas, cantidades y niveles normalizados; los cálculos del período se comparten con el renderizado inicial.

## CSS y diseño

El antiguo archivo editorial se divide en base, navegación/compartido, home, CV, contacto, archivo, artículo, podcast, footer/404, responsive y movimiento. La reorganización inicial conservó el orden de todas las reglas y las capas `base/components`; responsive permanece después de las reglas originales. Se dejan juntos los selectores compartidos y los overrides para no alterar precedencias al agruparlos por nombre.

El rediseño móvil añade `editorial/portfolio.css` al final del manifiesto, con la composición de portada y la cabecera/pie compartidos. La dirección Carbon / Citron actualiza los roles globales de color y las fuentes; artículos, CV y podcast conservan sus rutas, contenidos y estructura, y se comprueban como superficies afectadas.

`design.md`, `tokens.css` y `.hallmark/` permanecen. Los metadatos antiguos de Hallmark son historia, no una descripción necesariamente vigente. No se añade un framework de estilos ni dependencias. El sistema visual autorizado usa Space Grotesk, Manrope y JetBrains Mono; el cambio queda definido en design.md y tokens.css.

## Construcción y compatibilidad

`output: static` con adaptador Vercel: páginas prerenderizadas y endpoints bajo demanda, sin presuponer Edge. El build completa las reglas de compatibilidad del adaptador mediante `scripts/finalize-blog-redirects.mjs`. La CI comprueba también los artefactos finales. Ver [migración de URLs](url-migration.md).

Pagefind continúa generándose sobre `dist` por compatibilidad con el flujo anterior. Su consumo por una interfaz y su publicación efectiva requieren una decisión específica: no se añade una búsqueda nueva durante este refactor. `vercel.json` conserva sus redirecciones de idioma, caché y proceso de despliegue; esta tarea no publica ni configura protección de ramas.

## Limpieza realizada

- Retiradas las copias versionadas de herramientas Claude, enlaces de skills que dependían de contenido ignorado, OpenCode y el informe `stats.html`.
- Conservados los archivos privados locales y sus destinos ignorados; no se ha eliminado una instalación personal de herramientas.
- Eliminados Header e i18n duplicados y el servicio de experiencia sin consumidores (junto con su barrel sin uso). La home conserva su cálculo de duración existente.
- No se han borrado masivamente componentes por su nombre o antigüedad. Cualquier limpieza adicional exige comprobar consumidores, contenido dinámico y comportamiento.

## Limitaciones conocidas fuera de esta reorganización

- El límite de comentarios por IP es una consulta seguida de escrituras, no una operación atómica. La inserción del comentario y el registro de límite también son independientes: resolverlo requiere un cambio de base de datos y pruebas de concurrencia.
- La comprobación del padre mantiene la profundidad existente, pero no valida que pertenezca al mismo artículo. Las políticas/autenticación y controles contra abuso necesitan una revisión dedicada.
- Se conserva el contrato de comentarios existente, incluido su modelo de datos; esta tarea no audita ni modifica las políticas reales de Supabase.
- El aviso de salida del formulario se desactiva al intentar enviar, aunque falle el proveedor. No se cambia ese comportamiento ajeno a la separación de módulos.
- Las comprobaciones locales y de artefactos no sustituyen validar la aplicación desplegada, sus credenciales, Realtime y los proveedores externos. No se han hecho llamadas de escritura a producción.
