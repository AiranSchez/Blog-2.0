# Blog-2.0

Portfolio y blog de Airan en inglés, español y japonés, construido con Astro, componentes React interactivos y Tailwind CSS. Incluye trayectoria, artículos, podcast, CV, testimonios y contacto; los artículos incorporan comentarios mediante Supabase.

## Empezar

Requisitos: Node **24.x** (`.nvmrc`) y Bun **1.3.8** (`packageManager` en `package.json`). Node ejecuta las herramientas; Bun gestiona las dependencias y los comandos del proyecto. `.nvmrc` permite a nvm seleccionar la versión de Node: no es un archivo sobrante.

```sh
nvm install
nvm use
bun --version # debe coincidir con packageManager
bun install --frozen-lockfile
bun run dev
```

Abre la dirección que indique Astro, por ejemplo `http://localhost:4321/en/`.
Para configurar servicios, copia `.env.example` a `.env` **solo si todavía no existe** y sustituye los valores de ejemplo. Nunca publiques credenciales.

| Variable | Uso y exposición |
| --- | --- |
| `WEB3FORMS_ACCESS_KEY` | Envío de contacto. Se incluye en el formulario HTML, por lo que no es un secreto de servidor. |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | Comentarios en tiempo real; se pasan al navegador. La seguridad depende de las políticas de Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Acceso privilegiado exclusivo del servidor. Nunca debe llegar al HTML o JavaScript del cliente. |
| `LIBRETRANSLATE_URL`, `LIBRETRANSLATE_API_KEY` | Traducción de comentarios desde el servidor. |

La instalación, comprobación de tipos, construcción y pruebas actuales no necesitan credenciales reales. Sin configurarlas, no se debe esperar que los servicios externos funcionen. Las pruebas de contacto interceptan el envío: no validan Web3Forms real.

## Comandos y flujo de trabajo

| Comando | Qué comprueba o hace |
| --- | --- |
| `bun run dev` | Servidor local con recarga. |
| `bun run check` | Diagnósticos de Astro y TypeScript, incluidos archivos que el build puede no recorrer. |
| `bun run build` | Construye con Vercel, completa las redirecciones históricas y genera Pagefind. No despliega. |
| `bun run test:unit` | Reglas de comentarios, traducción, idiomas, rutas y límites de dependencias sin proveedores reales. |
| `bun run test:build` | Tras un build: comprueba artículos, comentarios, sitemap, redirecciones Vercel y separación de secretos. |
| `bun run test:e2e` | Pruebas Playwright en Chromium contra un servidor local nuevo. |
| `bun run test` | Ejecuta unitarias y E2E; evita `bun test` sin directorio para no mezclar ejecutores. |
| `bun run preview` | Comando de Astro conservado; no equivale al entorno Vercel y su adaptador puede no admitirlo. |

Antes de la primera prueba, instala el navegador con `bunx --no-install playwright install chromium` (en Linux CI, añade `--with-deps`). El puerto 4321 debe estar libre; Playwright no reutiliza servidores ajenos.

Trabaja por cambios pequeños: entender el flujo → definir qué debe seguir funcionando → implementar → comprobar tipos, build y pruebas → revisar el diff. Para cambios visuales, revisar móvil/escritorio y los tres idiomas. No mezclar una reorganización con una migración de URLs o tecnologías.

`bun.lock` es el único lockfile. Para añadir una dependencia usa `bun add` (o `bun add --dev`); revisa y entrega juntos manifiesto y lockfile. Las actualizaciones de Bun deben cambiar `packageManager`, `engines.bun` y comprobar instalación y CI; Node se declara en `.nvmrc` y `engines.node`.

La CI en `.github/workflows/ci.yml` instala desde el lockfile y ejecuta tipos, unitarias, build, artefactos y E2E, sin secretos ni despliegue. No configura protección de ramas ni modifica la integración Vercel existente.

## Dónde encontrar cada cosa

- [AGENTS.md](AGENTS.md): instrucciones breves compartidas por asistentes; no un almacén de toda la documentación.
- [docs/architecture.md](docs/architecture.md): mapa del sistema, límites actuales y evolución pendiente.
- [design.md](design.md): decisiones visuales; permanece en raíz para su descubrimiento por Hallmark.
- `tokens.css`: variables visuales **activas**, importadas desde `src/styles/variables.css`.
- `.hallmark/`: registro y metadatos del proceso de diseño; no una dependencia de ejecución. Los informes antiguos no describen necesariamente el diseño actual.
- `components.json`: configuración del generador shadcn/registries; referencia `src/styles/global.css`. No es contenido de la web.
- `.github/`: configuración de GitHub, incluidas Actions e instrucciones de Copilot; no está reservada solo a workflows.
- Las copias versionadas de `.claude/`, los enlaces `skills` y `opencode.json` se han retirado. La configuración privada local no se ha borrado ni es un requisito del proyecto.
- `stats.html` se ha retirado y se ignora: era un informe histórico, no una medición del build actual.
- `scripts/generate-cv-artifacts.py`: generación manual de artefactos de CV; requiere Python y ReportLab, y puede descargar fuentes. No forma parte del build ni debe ejecutarse para un cambio ajeno al CV.

Se han sustituido `CLAUDE.md` y `CONTEXT.md` por estos documentos, evitando duplicar reglas y conservar descripciones incorrectas del stack. No se crea `.codex/` mientras no haga falta una configuración específica de Codex.

## Compatibilidad de artículos

Las URLs usan un solo idioma y un slug normalizado. Se mantienen 46 redirecciones permanentes para los 51 artículos inventariados; cinco URLs ya eran correctas. Las claves de comentarios no cambian y no se ha migrado ni escrito en la base de datos. El selector de idioma y `hreflang` buscan el artículo equivalente, no suponen que todas las traducciones comparten slug.

Consulta [la migración de URLs](docs/url-migration.md) antes de renombrar artículos o retirar redirecciones. Para verificar todo desde cero:

```sh
bun install --frozen-lockfile
bun run check
bun run test:unit
bun run build
bun run test:build
bun run test:e2e
```
