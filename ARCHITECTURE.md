# Arquitectura del Proyecto

Este documento describe la estructura organizativa del proyecto y las convenciones de nomenclatura adoptadas.

## Estructura de Directorios

```text
src/
├── assets/             # Imágenes, fuentes y recursos estáticos procesados por Astro
├── components/         # Componentes reutilizables
│   ├── decorators/     # Componentes que envuelven o decoran otros (ParallaxSection, etc.)
│   ├── layout/         # Componentes estructurales (Header, Footer, ScrollToTop)
│   └── ui/             # Componentes UI base y primitivos (Button, Badge, Card, etc.)
├── content/            # Colecciones de contenido (blog, about, experience, projects)
│   └── config.ts       # Definición de esquemas Zod para validación
├── layouts/            # Plantillas de página (Layout.astro)
├── logic/              # Lógica de negocio y utilidades
│   ├── i18n-engine.ts  # Sistema de internacionalización
│   └── styles-merger.ts # Utilidad para combinar clases CSS (cn function)
├── pages/              # Rutas del sitio (generación estática)
├── styles/             # Estilos globales CSS
└── types/              # Interfaces TypeScript compartidas (futuro)
```

## Convenciones de Nomenclatura

### Archivos de Lógica (`src/logic/`)

En lugar de usar el genérico `utils`, los archivos deben tener nombres descriptivos que indiquen su propósito:

- **`styles-merger.ts`**: Combina clases CSS usando `cn()` (class-variance-authority + clsx)
- **`i18n-engine.ts`**: Motor de internacionalización (idiomas, traducciones, detección)
- **`date-formatter.ts`**: Funciones de formato de fechas (futuro)

### Componentes

#### `src/components/ui/`

**Componentes base primitivos sin lógica de negocio:**

- `Button.astro`, `Badge.astro`, `Card.astro`
- Reciben props simples (texto, variante, tamaño)
- No tienen conocimiento de Content Collections

#### `src/components/layout/`

**Componentes estructurales que definen el esqueleto de la página:**

- `Header.astro`, `Footer.astro`, `ScrollToTop.astro`
- Manejan navegación, layout principal, estructura repetitiva

#### `src/components/decorators/`

**Componentes que envuelven o añaden efectos a otros componentes:**

- `ParallaxSection.astro`: Añade efecto parallax a una sección
- Futuros: `FadeIn.astro`, `AnimatedWrapper.astro`

#### `src/components/[dominio]/` (Futuro)

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

### 2026-02-10: Refactorización inicial

- Movida `src/lib/utils.ts` → `src/logic/styles-merger.ts`
- Movida `src/i18n/utils.ts` → `src/logic/i18n-engine.ts`
- Creadas carpetas `src/components/layout/` y `src/components/decorators/`
- Reorganizados componentes estructurales (Header, Footer, ScrollToTop, ParallaxSection)
- Todas las importaciones actualizadas y build verificado exitosamente
