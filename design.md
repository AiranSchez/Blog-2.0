# Design — Airán Sánchez

## Dirección autorizada

El usuario autoriza expresamente una dirección nueva en colores, estilos, orden y texto. Sustituye el sistema visual violeta anterior, no su contenido ni rutas. La base es técnica y personal: carbón, verde lima y una variante clara mineral, sin beige, tipografía serif rústica, gradientes ni cristal decorativo.

## Hallmark fingerprint

- Theme: **custom — Carbon / Citron**. No copia visual de una referencia.
- Estructura: **identidad → evidencia → contexto → actividad → conversación**.
- Nav: **N9 Edge-aligned**, wordmark tipográfico, utilidades accesibles y menú móvil nativo.
- Footer: **Ft1 cierre de autor compacto**, sin un segundo hero de contacto.
- Anterior: azul noche / Outfit / acento violeta / navegación flotante. Ahora: carbón / Space Grotesk + Manrope / lima y verde / cabecera abierta. Cambian papel, tipografía, acento y jerarquía, no solo un color.

## Tipografía

- Display: **Space Grotesk**, 500/600/700. Nombre en dos líneas con respiración, tracking de -0.045em, nunca palabras comprimidas para forzar una línea.
- Cuerpo: **Manrope**, 400/500/600/700. Lectura desde 14px; formularios a 16px.
- Metadatos técnicos: **JetBrains Mono**, uso puntual.
- Títulos romanos, sin texto en gradiente ni typewriter. Saltos semánticos para japonés.

## Color y tokens

`tokens.css` define todos los roles, con neutros tintados en OKLCH.

- Claro: papel #f4f6f2, superficie #fcfdfb, tinta #17221d, secundaria #526257, acento #355b3c.
- Oscuro: papel #131a17, superficie #1b2520, tinta #f2f6ee, secundaria #adbaae, acento #d7ed9f.
- Señal lima: #d7ed9f con tinta #17221d. El área de vídeo usa una superficie de baja saturación, no un bloque de acento completo.
- Roles `--color-highlight` / `--color-highlight-ink` para la acción principal; `--color-project-stage` para la evidencia real.
- No colores o fuentes improvisados dentro de componentes. El sistema se comparte con blog, CV, proyectos y podcast; se verifican por regresión.

## Composición

- Home: perfil compacto con retrato real y nombre expresivo; proyecto inmediatamente después, no escondido tras CV/estadísticas.
- JaponesApp: protagonista con grabación real manual, estado de prototipo y acceso al caso. No miniquiz, descargas inexistentes ni métricas sin fuente.
- Perfil y trayectoria: texto breve, trabajo actual, historial desplegable y enlace al CV. La prueba social usa un fragmento literal del testimonio, con texto completo accesible.
- GitHub: mismas funciones y cuatro cifras, menos texto y altura, gráficas ampliables.
- Contacto: correo directo y formulario visible, sin tocar el proveedor ni simular un envío real.
- Blog/artículos/CV/podcast conservan sus rutas y estructura; heredan los nuevos roles de color y tipografía.

## Móvil y movimiento

- Primero 320/375/414px; después 768 y 1280px. Nombre y acción principal dentro del primer pantallazo; cero overflow del documento.
- Controles de 44px como mínimo, campos de 16px y foco visible inmediato.
- Imágenes en tracks `minmax(0, 1fr)`; vídeo local sin autoplay, con controles y poster. Sin marcos falsos de dispositivo.
- Sin animaciones que oculten el contenido ni hover como única forma de interacción. Se respeta reduced motion.
- Cabecera plana, sin scroll-morph ni sombra de cristal. Idioma/tema disponibles en móvil.

## Actividad GitHub

- Fuente fija y pública de AiranSchez; no necesita credenciales ni expone un endpoint nuevo.
- La consulta se realiza al renderizar/construir Astro, compartida por los tres idiomas. Una web estática se actualiza en el siguiente build, no en tiempo real ni mediante una automatización nueva.
- Ante errores se conserva una captura verificada con fecha visible; si tampoco es válida, se muestra indisponibilidad, nunca ceros ficticios.
- Solo fechas reales hasta la captura; las cifras son contribuciones, no commits, productividad ni horas trabajadas.
- Vista inicial de 90 días, año de la captura opcional. Cuatro estadísticas y dos gráficas derivadas del mismo período. Gráficas plegadas para no dominar el móvil.
- Calendario con selección por toque, tooltip para cursor y foco, flechas y Escape. Solo el calendario puede desplazarse lateralmente.

## Verificación móvil

- Revisar 320, 375, 414 y 768 px, además de 1280 px; ES/EN/JA y ambos temas.
- Campos y acciones principales de al menos 44 px; tipografía de campos de 16 px para evitar zoom en iOS.
- Sin títulos recortados ni enlaces de acción en dos líneas. El calendario compacto mantiene separación entre celdas y navegación de teclado.
- Formulario y correo directo se conservan. Los tests interceptan Web3Forms, no envían mensajes reales.

## Exportación

Los tokens activos son la fuente portable. Tailwind y componentes existentes consumen los mismos nombres, sin un segundo sistema paralelo.

### Tailwind v4
```css
@theme {
  --color-paper: var(--color-paper);
  --color-ink: var(--color-ink);
  --color-accent: var(--color-accent);
  --font-display: var(--font-display);
  --font-body: var(--font-body);
}
```

### DTCG
```json
{"color":{"paper":{"$value":"#f4f6f2","$type":"color"},"paperDark":{"$value":"#131a17","$type":"color"},"accent":{"$value":"#355b3c","$type":"color"},"accentDark":{"$value":"#d7ed9f","$type":"color"}},"font":{"display":{"$value":"Space Grotesk, sans-serif","$type":"fontFamily"},"body":{"$value":"Manrope, sans-serif","$type":"fontFamily"}}}
```

### shadcn/ui
```css
:root { --background: 96.8% 0.006 135; --foreground: 24% 0.018 155; --primary: 44% 0.065 148; --radius: 0.625rem; }
.dark { --background: 21% 0.013 155; --foreground: 97% 0.01 135; --primary: 92% 0.10 125; }
```
