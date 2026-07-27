# Design — Airán Sánchez

Sistema visual bloqueado para todo el sitio. Nace de un estudio público de
`https://www.aitorevi.dev/`, pero adapta su ADN a la voz, el contenido y las
rutas de Airán en lugar de reproducir su composición.

## Hallmark fingerprint

- `theme: studied-DNA (source: https://www.aitorevi.dev/)`
- `studied: yes`
- `DNA-source: url`
- Género: **atmospheric + modern-minimal**
- Navegación: **N10 Floating morph**
- Footer: **Ft5 Statement close**

## Dirección

Un portfolio técnico con profundidad cinematográfica: fondo azul noche,
atmósfera radial, superficies de cristal sobrias y acentos eléctricos
índigo-violeta-azul. En claro se convierte en una interfaz limpia y fría, no en
una versión beige o editorial. La tecnología acompaña la narrativa personal.

## Macroestructuras

- Home: **Marquee Hero → Ecosystem Index**, con hero inmersivo y módulos bento
  irregulares para experiencia, escritura y podcast.
- Blog: **Ecosystem Index**, con un artículo protagonista, filtros compactos y
  un archivo visual asimétrico.
- Artículo: **Long Document**, contenido dentro de una superficie elevada y
  silenciosa, con lectura de 65–72ch.
- Podcast: **Catalogue + Listening room**, episodio protagonista y archivo
  cronológico, sin pared de tarjetas idénticas.
- 404: **Atmospheric interstitial**, breve y deliberado.

## Color

Valores observados en la referencia: `#f8fafc`, `#020617`, `#0b1120`,
`#4727cc`, `#ac91fc`, `#60a5fa`.

La adaptación usa esos anclajes exactos mediante tokens:

- Claro: papel `#f8fafc`, superficie `#ffffff`, tinta `#0f172a`.
- Oscuro: papel `#020617`, superficie `#0b1120`, tinta `#f8fafc`.
- Acento claro: índigo `#4727cc`.
- Acento oscuro: violeta `#ac91fc`.
- Contrapunto: azul `#60a5fa`.

Los glows pertenecen al fondo y a una única pieza protagonista. Las tarjetas
ordinarias se separan por borde, contraste y composición; no por sombras neón
repetidas.

## Tipografía

- Display y cuerpo: **Outfit**, pesos 400, 500, 600, 700 y 900.
- Metadatos: **JetBrains Mono**, pesos 400, 600 y 700.
- Titulares siempre romanos, compactos y con `overflow-wrap: anywhere`.
- Escala hero: `clamp(3.4rem, 9vw, 8.5rem)`.
- Cuerpo: 1rem–1.125rem; lectura larga: 65–72ch.

## Espaciado y geometría

- Escala nominal de 4px conservada en `tokens.css`.
- Contenedor máximo: 80rem.
- Superficies: radios de 18–30px, nunca una cuadrícula de tarjetas idénticas.
- La composición alterna bloques amplios, piezas verticales y filas compactas.
- En 768px todo módulo complejo colapsa a una sola columna.

## Movimiento

- Entrada única del hero: opacidad + desplazamiento corto.
- Aparición progresiva por `IntersectionObserver` con la misma curva.
- Navegación flotante compacta al hacer scroll.
- Hover modifica color, borde o revelado interno; no hay elevación universal.
- Sin WebGL, parallax, terminales falsas ni `transition-all`.
- `prefers-reduced-motion` elimina animaciones no esenciales.

## Componentes compartidos

- Navegación flotante translúcida y accesible.
- Etiquetas mono en mayúsculas controladas.
- CTA primario sólido con brillo moderado; secundario translúcido.
- Chips, filtros y controles con altura táctil mínima.
- Foco visible inmediato en violeta/azul.
- Enlaces clicables de una sola línea.
- `html` y `body` usan `overflow-x: clip`.

## Reglas por página

- El retrato del hero es el ancla humana; se permite un segundo retrato en About.
- Las imágenes de artículos se muestran con tratamiento editorial moderno y
  fallback atmosférico cuando falten.
- El podcast usa una pieza visual generada con CSS, no una interfaz falsa.
- Los comentarios y formularios mantienen toda su lógica y accesibilidad.
- Rutas, contenido, idiomas e integraciones no se eliminan.

## Exportación

`tokens.css` es la fuente portable. `src/styles/variables.css` la importa antes
de la capa de componentes. Tailwind sigue disponible para componentes
funcionales existentes, pero la interfaz rediseñada consume únicamente tokens
con nombre.

### Tailwind v4

```css
@theme {
  --color-paper: var(--color-paper);
  --color-surface: var(--color-paper-2);
  --color-ink: var(--color-ink);
  --color-muted: var(--color-ink-2);
  --color-accent: var(--color-accent);
  --color-blue: var(--color-signal);
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);
}
```

### DTCG

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": { "$value": "#f8fafc", "$type": "color" },
    "paperDark": { "$value": "#020617", "$type": "color" },
    "accent": { "$value": "#4727cc", "$type": "color" },
    "accentDark": { "$value": "#ac91fc", "$type": "color" },
    "signal": { "$value": "#60a5fa", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Outfit, ui-sans-serif, sans-serif", "$type": "fontFamily" },
    "mono": { "$value": "JetBrains Mono, ui-monospace, monospace", "$type": "fontFamily" }
  }
}
```

### shadcn/ui

```css
:root {
  --background: 98% 0.004 247;
  --foreground: 20.8% 0.042 266;
  --card: 100% 0 0;
  --card-foreground: 20.8% 0.042 266;
  --primary: 43.8% 0.233 291;
  --primary-foreground: 98% 0.004 247;
  --border: 91% 0.018 263;
  --ring: 43.8% 0.233 291;
  --radius: 1.25rem;
}

.dark {
  --background: 12.9% 0.042 264;
  --foreground: 98% 0.004 247;
  --card: 17.8% 0.042 265;
  --card-foreground: 98% 0.004 247;
  --primary: 76.1% 0.137 299;
  --primary-foreground: 12.9% 0.042 264;
  --border: 27.9% 0.052 264;
  --ring: 70.7% 0.126 250;
}
```
