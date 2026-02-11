# Arquitectura del Proyecto

Este documento describe la estructura organizativa del proyecto y las convenciones de nomenclatura adoptadas.

## Estructura de Directorios

```text
src/
├── assets/             # Imágenes, fuentes y recursos estáticos
│   └── images/
│       ├── logos/      # Logos de empresas
│       └── profile/    # Fotos de perfil
├── components/         # Componentes reutilizables
│   ├── blog/           # Componentes de blog (vacío, preparado para crecimiento)
│   ├── home/           # Secciones de homepage (HeroSection, ExperienceSection, etc.)
│   └── shared/         # Componentes compartidos entre features
│       ├── decorators/ # Componentes decorativos (Parallax, AuroraBackground, ScrollReveal)
│       ├── react/      # Componentes React organizados por dominio
│       │   ├── common/     # React reutilizables (AnimatedText, MagneticButton, etc.)
│       │   └── experience/ # React específicos (ExperienceCard, DualLogo, TechLoopSlider)
│       └── ui/         # Componentes UI base Astro (Button, Badge, Card, etc.)
├── content/            # Colecciones de contenido validadas con Zod
│   ├── blog/           # Posts del blog (en/, es/, ja/)
│   ├── about/          # Contenido "About Me" (en.mdx, es.mdx, ja.mdx)
│   ├── config.ts       # Esquemas Zod y configuración de Content Collections
│   └── tech-logos.json # URLs de logos de tecnologías
├── data/               # Datos JSON sin validación Zod
│   ├── experience/     # experiences-{locale}.json
│   └── projects/       # project-{locale}.json
├── i18n/               # Sistema de internacionalización
│   ├── translations.ts # Traducciones UI (nav, hero, footer, etc.)
│   └── index.ts        # Barrel export
├── layouts/            # Plantillas de página y componentes estructurales
│   ├── Layout.astro    # Layout principal
│   ├── Header.astro    # Navegación principal
│   ├── Footer.astro    # Pie de página
│   └── ScrollToTop.astro # Botón scroll to top
├── lib/                # Utilidades y helpers
│   ├── utils.ts        # cn() function para merge de clases Tailwind
│   ├── animations.ts   # Configuraciones de animaciones
│   └── index.ts        # Barrel export
├── pages/              # Rutas del sitio (generación estática + SSR)
│   ├── index.astro     # Redirect a /en/ (requerido por Astro i18n)
│   ├── 404.astro       # Página de error
│   └── [locale]/       # Rutas localizadas
├── services/           # Lógica de negocio centralizada
│   ├── experience.ts   # Cálculo duraciones, formato fechas
│   ├── i18n.ts         # Sistema i18n (getLangFromUrl, useTranslations, etc.)
│   ├── data.ts         # Carga y transformación de datos
│   └── index.ts        # Barrel export
├── styles/             # Estilos CSS modulares
│   ├── global.css      # Punto de entrada (imports + Tailwind directives)
│   ├── variables.css   # CSS custom properties
│   ├── base.css        # Reset y estilos base HTML
│   ├── components.css  # Clases de componentes reutilizables
│   └── utilities.css   # Utilities, media queries, print styles
└── types/              # Definiciones TypeScript compartidas
    ├── experience.ts   # Tipos de experiencia laboral
    ├── common.ts       # Tipos comunes (AnimationProps, etc.)
    ├── i18n.ts         # Tipos de configuración i18n
    └── index.ts        # Barrel export
```

## Convenciones de Nomenclatura

### Servicios (`src/services/`)

**Lógica de negocio centralizada con barrel exports:**

- **`experience.ts`**: Cálculo de duraciones, formato de fechas, helpers de experiencia
  - `calculateDuration()`: Calcula duración entre fechas
  - `formatDate()`: Formatea fechas según locale
  - `getPresentText()`: Obtiene texto "Present" según idioma

- **`i18n.ts`**: Sistema de internacionalización consolidado
  - `getLangFromUrl()`: Extrae idioma de URL
  - `useTranslations()`: Hook de traducciones
  - `isSupportedLocale()`: Valida locales
  - `getLocaleFromPath()`: Extrae locale de path
  - `buildLocalizedPath()`: Construye rutas localizadas
  - `getBrowserLocale()`: Detecta idioma del navegador

- **`data.ts`**: Utilidades para cargar y transformar datos
  - `loadJsonData()`: Carga archivos JSON dinámicamente
  - `loadLocalizedData()`: Carga datos según locale

- **`index.ts`**: Barrel export - importa todo (`export * from './...'`)

**Cuándo usar services:**
- Lógica que se repite en múltiples componentes
- Cálculos complejos o transformaciones de datos
- Business logic que no pertenece a un componente específico

### Internationalization (`src/i18n/`)

**Traducciones UI centralizadas:**

- **`translations.ts`**: Todas las traducciones de la UI
  - `languages`: Mapa de idiomas (en, es, ja)
  - `ui`: Objeto con todas las traducciones por idioma
  - Exporta tipos: `Language`, `languages`

- **`index.ts`**: Barrel export de traducciones

**Importación recomendada:**
```typescript
// Para funciones i18n
import { getLangFromUrl, useTranslations } from '@/services/i18n';

// Para solo traducciones (raro)
import { ui, languages } from '@/i18n';
```

### Utilidades (`src/lib/`)

**Helpers y utilidades reutilizables:**

- **`utils.ts`**: Funciones de utilidad general
  - `cn()`: Merge de clases Tailwind con caché LRU (clsx + tailwind-merge)

- **`animations.ts`**: Configuraciones de Framer Motion

- **`index.ts`**: Barrel export

### Tipos (`src/types/`)

**Definiciones de tipos TypeScript compartidas con barrel exports:**

- **`experience.ts`**: Interfaces de experiencia laboral
- **`common.ts`**: Tipos compartidos (ComponentBaseProps, AnimationProps)
- **`i18n.ts`**: Tipos de configuración i18n
- **`index.ts`**: Barrel export

**Cuándo crear un tipo:**
- Si una interfaz se usa en 2+ archivos
- Si define un contrato de datos (JSON, API response)
- Si documenta la forma de un objeto complejo

**Componentes base primitivos sin lógica de negocio:**

- **Astro Components**: `Button.astro`, `Badge.astro`, `Card.astro`, `Input.astro`, `Link.astro`, `Textarea.astro`
  - Componentes primitivos puros de UI
  - Reciben props simples (texto, variante, tamaño)
  - No tienen conocimiento de Content Collections o datos de negocio

- **React Components** (`src/components/ui/react/`):
  - **`common/`**: Componentes React reutilizables en múltiples contextos
    - `AnimatedTimeline.tsx`: Timeline animado con scroll progress
    - `AnimatedText.tsx`: Texto con animaciones (fade, slideUp, typewriter)
    - `FuzzyText.tsx`: Efecto de texto difuminado
    - `MagneticButton.tsx`: Botón con efecto magnético al hover
  
  - **`experience/`**: Componentes React específicos de Experience
    - `ExperienceCard.tsx`: Tarjeta de experiencia laboral
    - `DualLogo.tsx`: Logos duales (LeanMind + Empresa)
    - `TechLoopSlider.tsx`: Slider infinito de tecnologías con drag
  
  - **Raíz temporal**: `SkillBadge.tsx` (pendiente de reorganizar)

**Regla clave**: Si un componente React pertenece a un dominio específico (Experience, Blog, Projects), va en `react/[dominio]/`. Si es genérico y reutilizable, va en `react/common/`.

#### `src/components/home/`

**Secciones específicas de la homepage (orquestadores):**

- `HeroSection.astro`, `ExperienceSection.astro`, `BlogSection.astro`, etc.
- **Responsabilidad**: Componer componentes de UI + cargar datos + layout de sección
- **No son reutilizables**: Están hardcoded para la página principal

#### `src/components/layout/`

**Componentes estructurales que definen el esqueleto de la página:**

- `Header.astro`, `Footer.astro`, `ScrollToTop.astro`
- Manejan navegación, layout principal, estructura repetitiva

#### `src/components/decorators/`

**Componentes que envuelven o añaden efectos a otros componentes:**

- `ParallaxSection.astro`: Añade efecto parallax a una sección
- `Parallax.tsx`: Componente React de parallax
- `AuroraBackground.tsx`: Efecto de fondo aurora boreal
- `ScrollReveal.tsx`: Revela contenido al hacer scroll

### Servicios (`src/services/`)

**Lógica de negocio centralizada y reutilizable:**

- **`experience.ts`**: Cálculo de duraciones, formato de fechas, helpers de experiencia
  - `calculateDuration()`: Calcula duración entre fechas
  - `formatDate()`: Formatea fechas según locale
  - `getPresentText()`: Obtiene texto "Present" según idioma

- **`i18n.ts`**: Sistema de internacionalización moderno
  - `isSupportedLocale()`: Valida si un locale es soportado
  - `getLocaleFromPath()`: Extrae locale de URL
  - `buildLocalizedPath()`: Construye rutas localizadas

- **`data.ts`**: Utilidades para cargar y transformar datos
  - `loadJsonData()`: Carga archivos JSON dinámicamente
  - `loadLocalizedData()`: Carga datos según locale
  - `mapWithIndex()`: Mapea arrays con índice

**Cuándo usar services/**:
- Lógica que se repite en múltiples componentes
- Cálculos complejos o transformaciones de datos
- Business logic que no pertenece a un componente específico

### Tipos (`src/types/`)

**Definiciones de tipos TypeScript compartidas:**

- **`experience.ts`**: Interfaces de experiencia laboral
- **`common.ts`**: Tipos compartidos (Locale, ComponentBaseProps, AnimationProps)
- **`i18n.ts`**: Tipos de configuración i18n

**Cuándo crear un tipo**:
- Si una interfaz se usa en 2+ archivos
- Si define un contrato de datos (JSON, API response)
- Si documenta la forma de un objeto complejo

### Data (`src/data/`)

**Archivos JSON que NO necesitan validación Zod:**

- `experience/experiences-*.json`: Datos de experiencia laboral
- Futuros: `projects/`, `testimonials/`

**Diferencia con `src/content/`**:
- `content/`: Validado por Zod, integrado con Content Collections
- `data/`: JSON plano, importado directamente

#### `src/components/[dominio]/` (Deprecado)

**Componentes específicos de un dominio del negocio:**

- `src/components/blog/`: `PostCard.astro`, `BlogMetadata.astro`
- `src/components/experience/`: `ExperienceCard.astro`
- Consumen datos de Content Collections

## Integración de Librerías de Componentes de Terceros

### Patrón Recomendado: Wrapper/Adapter

Para facilitar el intercambio de librerías (como ReactBits, shadcn/ui, etc.), **crear siempre un wrapper** en `src/components/ui/`:

```astro
---
// src/components/ui/Button.astro
import { Button as ExternalButton } from 'react-bits'; // Librería externa

interface Props {
  variant?: 'primary' | 'secondary';
  // Props propias de tu proyecto
}

const { variant = 'primary', ...props } = Astro.props;
---

<ExternalButton variant={variant} {...props}>
  <slot />
</ExternalButton>
```

**Ventajas:**

- Cambiar de librería solo requiere editar el wrapper
- El resto del código usa `<Button />` sin saber qué librería hay detrás
- Puedes adaptar la API de la librería a tus necesidades

## Importaciones

Usa el alias `@/` configurado en `tsconfig.json` para importaciones desde `src/`:

```typescript
import { cn } from '@/logic/styles-merger';
import Button from '@/components/ui/Button.astro';
```

## Buenas Prácticas

1. **Evita el cajón desastre**: No uses carpetas como `utils` o `helpers` si puedes ser más específico.
2. **Organiza por dominio**: Cuando un conjunto de componentes pertenece a una funcionalidad clara (blog, tienda, etc.), agrúpalos.
3. **Mantén UI genérico**: Los componentes en `ui/` deben ser reutilizables en cualquier contexto.
4. **Documenta intenciones**: Si un archivo crece, considera dividirlo por responsabilidad.

## Logs de Cambios Arquitectónicos

### 2026-02-11 (Fase 2 - Beta): Migración completa a arquitectura modular

**Cambios implementados:**

**1. Eliminación de `src/logic/` y migración a nueva estructura:**
- ❌ Eliminado `src/logic/i18n-engine.ts`
- ❌ Eliminado `src/logic/styles-merger.ts`
- ✅ Creado `src/i18n/` con traducciones separadas
- ✅ Migradas funciones i18n a `src/services/i18n.ts`
- ✅ Migrado `cn()` a `src/lib/utils.ts`

**2. Sistema de i18n modular:**
- ✅ `src/i18n/translations.ts`: Todas las traducciones UI
- ✅ `src/services/i18n.ts`: Funciones consolidadas (getLangFromUrl, useTranslations, etc.)
- ✅ Imports actualizados en Header, Footer, middleware, páginas

**3. Organización de assets:**
- ✅ Creado `src/assets/images/logos/` para logos de empresas
- ✅ Profile images ya en `src/assets/images/profile/`
- ✅ Actualizados imports en ExperienceSection, HeroSection, AboutSection

**4. Unificación de layouts:**
- ✅ Movidos Header, Footer, ScrollToTop de `components/layout/` → `layouts/`
- ❌ Eliminado `src/components/layout/` duplicado
- ✅ Actualizados imports en todas las páginas

**5. Reorganización de componentes:**
- ✅ Creada estructura `src/components/shared/`
  - `shared/ui/`: Componentes Astro primitivos
  - `shared/react/`: Componentes React por dominio
  - `shared/decorators/`: Componentes decorativos
- ❌ Eliminadas carpetas `ui/` y `decorators/` originales
- ✅ Actualizados imports en home/, pages/, layouts/

**6. Refactorización de estilos:**
- ✅ Dividido `global.css` monolítico (452 líneas) en:
  - `variables.css`: Custom properties
  - `base.css`: Reset y estilos base
  - `components.css`: Clases de componentes
  - `utilities.css`: Utilidades y media queries
- ✅ `global.css` ahora solo importa todo

**7. Data files:**
- ✅ Movido `tech-logos.json` de `config/` → `content/`
- ❌ Eliminado `src/config/` vacío

**8. Barrel exports para mejor DX:**
- ✅ `src/services/index.ts`
- ✅ `src/types/index.ts`
- ✅ `src/lib/index.ts`
- ✅ `src/i18n/index.ts`

**Impacto:**
- 📦 Arquitectura más modular y mantenible
- 🗂️ Eliminada carpeta legacy `logic/`
- 🚀 Imports más simples con barrel exports
- 📝 Estilos más organizados y reutilizables
- ✅ Build verified exitosamente (33 páginas)

### 2026-02-11 (Fase 1 - Alfa): Refactorización inicial de componentes React y servicios

**Cambios implementados:**
- ✅ Reorganizada estructura de componentes React:
  - Creado `src/components/ui/react/experience/`
  - Creado `src/components/ui/react/common/`
  - Movidos componentes específicos y reutilizables
- ✅ Creada carpeta `src/services/` con lógica de negocio:
  - `experience.ts`: Cálculo duraciones y formateo
  - `i18n.ts`: Sistema i18n inicial
  - `data.ts`: Utilidades de datos
- ✅ Creada carpeta `src/types/` con TypeScript interfaces
- ✅ Creado `DEPENDENCY_MAP.md`

**Impacto:**
- Mejor separación de responsabilidades
- Más fácil añadir/quitar features
- Código más mantenible

### 2026-02-10: Refactorización inicial

- Movida `src/lib/utils.ts` → `src/logic/styles-merger.ts`
- Movida `src/i18n/utils.ts` → `src/logic/i18n-engine.ts`
- Creadas carpetas `src/components/layout/` y `src/components/decorators/`
- Reorganizados componentes estructurales (Header, Footer, ScrollToTop, ParallaxSection)
- Todas las importaciones actualizadas y build verificado exitosamente

---

## Plan de Evolución

### ✅ Fase Alfa (Completada - Feb 2026)
- ✅ Estructura simple y clara
- ✅ Documentación de dependencias (DEPENDENCY_MAP.md)
- ✅ Servicios y tipos centralizados
- ✅ Reorganización de componentes React por dominio

### ✅ Fase Beta (Completada - Feb 2026)
- ✅ Migración completa de `src/logic/` → modernizada
- ✅ Sistema i18n modular (`src/i18n/` + `services/i18n.ts`)
- ✅ Estilos refactorizados (variables, base, components, utilities)
- ✅ Assets organizados (logos/, profile/)
- ✅ Layouts unificados
- ✅ Componentes en estructura `shared/`
- ✅ Barrel exports para mejor DX

### 🚀 Fase Gamma (Próximo)
- [ ] Extraer design tokens a JSON/TS configurable
- [ ] Implementar theme switcher con persistencia
- [ ] Añadir más tests de integración
- [ ] Considerar crear `src/features/` para agrupación de alto nivel

### 🎯 Fase Producción (Futuro)
- [ ] Tests unitarios completos para `src/services/`
- [ ] Storybook para componentes de `src/components/shared/ui/`
- [ ] CI/CD con validación automática
- [ ] Performance monitoring y analytics
- [ ] Documentación interactiva (Storybook + ComponentDoc)
