# Migración compatible de URLs de artículos

## Alcance

Inventario tomado del build anterior a esta migración: **51 artículos, 46 URLs que cambian y 5 que se mantienen**. No se han renombrado archivos de contenido, cambiado artículos ni escrito en Supabase.

`src/data/blog-legacy-routes.json` registra para cada artículo:
- `oldPath`: ruta anterior, con mayúsculas, espacios o idioma duplicado cuando existían.
- `newPath`: destino normalizado con un solo idioma, minúsculas y separadores con guiones.
- `commentKey`: clave exacta enviada por la isla de comentarios antes del cambio.

Este inventario verifica el build anterior del checkout, no pretende enumerar URLs desconocidas de todas las versiones publicadas en el pasado.

Ejemplos:
- `/en/blog/en/csrf-xss-cors/` → `/en/blog/csrf-xss-cors/`
- `/es/blog/React /TS/` → `/es/blog/react-ts/`
- `/ja/blog/Mob&Pair/` → `/ja/blog/mob-pair/`

## Tres identidades distintas

1. **URL:** `articlePath`/`normalizeArticleSlug` controlan enlaces y rutas estáticas. El build falla si dos artículos producen la misma URL.
2. **Traducción:** `articleAlternates` agrupa por nombre de contenido sin idioma/extensión. Header y `hreflang` usan las rutas reales de sus traducciones. Si falta una traducción, el menú vuelve al archivo del idioma, no inventa un artículo.
3. **Comentarios:** `commentKey` reproduce el algoritmo histórico. Las claves actuales conservan `.en.md`, `.es.md` o `.ja.md`; no deben sustituirse por la URL ni combinarse entre idiomas. Las 51 claves se comprueban en el HTML construido.

No es necesaria una migración de base de datos para este cambio. Renombrar los archivos de contenido sí podría alterar sus claves: requeriría un mapa estable adicional o una migración explícita.

## Redirecciones

Astro configura redirecciones **301** desde el registro histórico. El adaptador Vercel 9 genera patrones sin la barra final de los enlaces antiguos; el paso `finalize-blog-redirects.mjs` completa solo esas reglas para admitir barra opcional y espacios codificados. Conserva el resto de su configuración generada y falla si no encuentra exactamente la regla esperada. Al actualizar el adaptador hay que revisar este paso, no eliminar la comprobación.

El sitemap contiene destinos canónicos, no URLs antiguas. Los enlaces de home/archivo, canonical y alternates se generan con la misma política. Los enlaces históricos dentro del contenido siguen funcionando mediante redirecciones, sin reescribir masivamente los artículos.

## Verificación antes de publicar

```sh
bun run check
bun run test:unit
bun run build
bun run test:build
bun run test:e2e
```

Las pruebas de artefactos inspeccionan `.vercel/output/config.json` y las páginas de `.vercel/output/static`: claves, canonical, sitemap, patrones codificados/decodificados, barra final y ausencia de bucles. Las E2E verifican redirecciones HTTP locales, menús de idiomas y la clave que envía realmente el navegador, sin conectar a proveedores reales.

**Pendiente al desplegar (no realizado aquí):** comprobar una URL antigua por idioma, incluidos espacios y barra final, redirección y canonical en el dominio real, continuidad de comentarios/Realtime y consulta del sitemap. Verificar también el tratamiento de parámetros de consulta y fragmentos por la plataforma si existen enlaces de campañas. No retirar redirecciones para simplificar la raíz.

## Reversibilidad

Mientras no se publique, los cambios son locales. Tras publicar, un rollback debe restaurar de forma coordinada las rutas estáticas, enlaces, alternates y configuración de redirecciones del mismo cambio, no solo borrar el registro histórico. Las claves de comentarios no se han alterado. Las redirecciones 301 pueden permanecer en cachés de navegadores/buscadores, por lo que revertir el código no garantiza deshacer inmediatamente su efecto externo.
