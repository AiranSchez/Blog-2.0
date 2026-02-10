# ReactBits Integration - Documentación

Este documento detalla la integración de componentes animados inspirados en ReactBits usando el patrón Adapter para mantener la arquitectura del proyecto limpia y mantenible.

## 🎯 Filosofía de Integración

### Patrón Adapter Implementado

En lugar de usar ReactBits directamente como dependencia npm, hemos creado **componentes adapter propios** usando React + Framer Motion que:

1. **Encapsulan la lógica de animación**: Toda la complejidad está dentro del componente
2. **Mantienen una API consistente**: Props adaptadas a nuestras convenciones
3. **Son fáciles de reemplazar**: Si cambias de librería, solo editas el adapter
4. **Respetan el design system**: Usan variables CSS del proyecto

## 📦 Componentes Implementados

### 1. AnimatedText

**Ubicación:** `src/components/ui/AnimatedText.tsx`

**Propósito:** Animar texto con diferentes efectos (fade, slide-up, typewriter).

**Props:**
```typescript
interface AnimatedTextProps {
  text: string;           // Texto a animar
  className?: string;     // Clases CSS adicionales
  variant?: 'fade' | 'slideUp' | 'typewriter'; // Tipo de animación
  delay?: number;         // Retraso en segundos
}
```

**Uso:**
```astro
---
import AnimatedText from '@/components/ui/AnimatedText.tsx';
---

<h1>
  <AnimatedText 
    text="Hola, soy"
    variant="fade"
    client:load
  />
  {' '}
  <AnimatedText 
    text="Airán"
    variant="slideUp"
    delay={0.3}
    className="text-alabaster"
    client:load
  />
</h1>
```

**Ubicación actual:** Hero section en `[locale]/index.astro`

---

### 2. MagneticButton

**Ubicación:** `src/components/ui/MagneticButton.tsx`

**Propósito:** Botones con efecto magnético que siguen el cursor.

**Props:**
```typescript
interface MagneticButtonProps {
  children: React.ReactNode; // Contenido del botón
  className?: string;        // Clases CSS
  href?: string;             // URL (crea un <a>)
  onClick?: () => void;      // Handler de click (crea un <button>)
  strength?: number;         // Intensidad del efecto (default: 0.3)
}
```

**Uso:**
```astro
---
import MagneticButton from '@/components/ui/MagneticButton.tsx';
---

<MagneticButton 
  href="/blog"
  className="px-6 py-4 bg-white text-stormy rounded-lg"
  client:load
>
  Ver Blog
</MagneticButton>
```

**Ubicación actual:** Botones principales del Hero

**Notas técnicas:**
- Usa `useSpring` de Framer Motion para suavidad
- Se resetea automáticamente cuando el cursor sale
- Solo activo en desktop (mobile no tiene hover)

---

### 3. ScrollReveal

**Ubicación:** `src/components/decorators/ScrollReveal.tsx`

**Propósito:** Animar elementos cuando entran en el viewport al hacer scroll.

**Props:**
```typescript
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;                              // Retraso en segundos
  direction?: 'up' | 'down' | 'left' | 'right'; // Dirección de entrada
  once?: boolean;                              // ¿Animar solo una vez? (default: true)
}
```

**Uso:**
```astro
---
import ScrollReveal from '@/components/decorators/ScrollReveal.tsx';
---

{projects.map((project, index) => (
  <ScrollReveal 
    delay={index * 0.2}
    direction="up"
    client:load
  >
    <article>
      <!-- Contenido -->
    </article>
  </ScrollReveal>
))}
```

**Ubicación actual:** Cards de proyectos (con efecto stagger)

**Notas técnicas:**
- Usa `useInView` hook de Framer Motion
- Se activa 100px antes de entrar al viewport para suavidad
- `once={true}` por defecto para performance

---

## 🔧 Configuración Técnica

### Dependencias Instaladas

```json
{
  "dependencies": {
    "@astrojs/react": "^4.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^12.0.0"
  }
}
```

### Configuración Astro

```javascript
// astro.config.mjs
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    react()
  ]
});
```

## 🎨 Alineación con Design System

Todos los componentes respetan las variables CSS definidas en `global.css`:

```css
:root {
  --color-stormy: #216869;
  --color-seaweed: #49a078;
  --color-alabaster: #dce1de;
  --duration-normal: 300ms;
  /* etc. */
}
```

Los componentes usan estas variables a través de las clases de Tailwind:
- `text-stormy` → `var(--color-stormy)`
- `transition-colors duration-300` → Respeta `--duration-normal`

## 📊 Performance

### Client Directives Usados

- **`client:load`**: Usado en todos los componentes para cargar inmediatamente
  - Alternativa: `client:visible` si el componente está más abajo en la página

### Bundle Size

- Framer Motion: ~60KB gzipped
- React: ~40KB gzipped
- Componentes custom: ~5KB total

**Total adicional:** ~105KB para animaciones avanzadas

## 🚀 Buenas Prácticas

### 1. Usar `client:visible` cuando sea posible

```astro
<!-- Componente en hero: client:load (crítico) -->
<AnimatedText text="Hola" client:load />

<!-- Componente abajo en la página: client:visible -->
<ScrollReveal client:visible>
  <Card />
</ScrollReveal>
```

### 2. Limitar animaciones simultáneas

```astro
<!-- ❌ Malo: demasiados componentes React -->
{posts.map(post => (
  <AnimatedText text={post.title} client:load />
))}

<!-- ✅ Bueno: usar CSS para listas -->
{posts.map(post => (
  <h3 class="animate-fade-in">{post.title}</h3>
))}
```

### 3. Preservar accesibilidad

```astro
<!-- Respetar prefers-reduced-motion -->
<AnimatedText 
  text="Hola"
  client:load
  <!-- global.css ya maneja prefers-reduced-motion -->
/>
```

## 🔄 Cómo Reemplazar con Otra Librería

Si decides cambiar a otra solución (AOS, GSAP, etc.):

1. **Edita solo el componente adapter** (ej. `AnimatedText.tsx`)
2. **Mantén la misma interfaz de Props**
3. **No toques las páginas** que usan el componente

Ejemplo - Cambiar a GSAP:

```tsx
// AnimatedText.tsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function AnimatedText({ text, variant, delay }: AnimatedTextProps) {
  const ref = useRef(null);
  
  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      y: variant === 'slideUp' ? 30 : 0,
      delay,
      duration: 0.8
    });
  });

  return <span ref={ref}>{text}</span>;
}
```

**Resultado:** Cambio completo sin tocar una sola página `.astro` 🎉

## 📈 Próximos Pasos (Opcionales)

### Componentes que podrían añadirse:

1. **ParallaxImage** - Imágenes con parallax sutil
2. **TypewriterEffect** - Mejorar el efecto typewriter actual
3. **ParticleBackground** - Background animado sutil para hero
4. **ThreeCardFlip** - Tarjetas 3D que rotan en hover
5. **CursorEffect** - Custom cursor (solo desktop)

### Integración sugerida:

```astro
<!-- Ejemplo futuro -->
<ParticleBackground 
  density="low"
  color="var(--color-muted)"
  client:idle
/>
```

## 🐛 Troubleshooting

### Problema: Animación no se ve

**Causa:** Falta `client:load` o `client:visible`

**Solución:**
```astro
<!-- ❌ -->
<AnimatedText text="Hola" />

<!-- ✅ -->
<AnimatedText text="Hola" client:load />
```

### Problema: SSR Errors

**Causa:** Framer Motion accede a `window` durante SSR

**Solución:** Ya configurado con `client:*` directives. Si aparece:
```tsx
// Dentro del componente React
if (typeof window === 'undefined') return null;
```

### Problema: Animación muy lenta

**Causa:** Demasiados componentes React en la página

**Solución:** Usar CSS animations para elementos repetitivos:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in { animation: fadeIn 0.6s ease-in-out; }
```

## 📝 Changelog

### 2026-02-10 - Integración Inicial

- ✅ Configurado React + Framer Motion
- ✅ Creado `AnimatedText` con 3 variantes
- ✅ Creado `MagneticButton` con efecto magnético
- ✅ Creado `ScrollReveal` con detección de viewport
- ✅ Integrados en Hero y Projects sections
- ✅ Verificado build y performance

---

**Autor:** Airán Sanchez  
**Última actualización:** 10 de febrero de 2026  
**Stack:** Astro + React + Framer Motion + Tailwind CSS
