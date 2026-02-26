# Project Context & Standards

## Stack Tecnológico

- **Framework:** Astro 5.17.1 (Content Layer API)
- **UI:** React 19.2.4 + Tailwind CSS 3.4.0
- **Animations:** Framer Motion, GSAP, Three.js (OGL)
- **Deployment:** Vercel (Edge Functions enabled)
- **Content:** MDX para el blog.

## Agent Knowledge & Skills (Reference)

Para cualquier tarea de desarrollo, utiliza obligatoriamente estos estándares:

1. **React/Next.js Patterns:** Sigue las [Vercel React Best Practices](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices).
2. **Design Standards:** Aplica las [Web Design Guidelines](https://skills.sh/vercel-labs/agent-skills/web-design-guidelines).
3. **Astro 5:** Utiliza las nuevas APIs de Astro 5 (como el Content Layer y Actions) en lugar de métodos antiguos.

## Reglas de Oro de Código

1. **Types over Comments:** TypeScript estricto. Define interfaces claras.
2. **Performance:** Prioriza componentes de Astro (Islands Architecture). Solo usa 'client:load' o similares cuando sea estrictamente necesario para la interactividad.
3. **Naming:** `camelCase` para variables, `PascalCase` para componentes. Archivos de componentes en `.tsx`.
4. **Skills Locales:** Tienes scripts en `.claude/scripts/` (`check_project.sh`, `test_feature.sh`, `analyze_bundle.sh`). Ejecútalos mentalmente o pídeme que los corra si dudas de una implementación.

## Flujo de Trabajo

- **Review Protocol:** Nunca apliques cambios de código sin pasar por mi protocolo de revisión exhaustiva (Architecture -> Code -> Test -> Performance).
- **Concisión:** En el Plan Pro, evita introducciones largas. Ve directo a la solución.
