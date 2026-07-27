export type PortfolioLocale = 'en' | 'es' | 'ja';

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  url?: string;
  placeholder: boolean;
}

export interface SelectedWork {
  title: string;
  context: string;
  contribution: string;
  outcome: string;
  technologies: string[];
  href?: string;
  published: boolean;
}

export const testimonialsByLocale: Record<PortfolioLocale, Testimonial[]> = {
  en: [
    {
      quote: 'Add a recommendation about how we worked together, made decisions, or improved the team.',
      author: 'Colleague name',
      role: 'Role · Company',
      placeholder: true,
    },
    {
      quote: 'Add a recommendation about technical judgement, communication, or ownership.',
      author: 'Colleague name',
      role: 'Role · Company',
      placeholder: true,
    },
    {
      quote: 'Add a recommendation that explains the impact of sharing a project with Airán.',
      author: 'Colleague name',
      role: 'Role · Company',
      placeholder: true,
    },
  ],
  es: [
    {
      quote: 'Añade una recomendación sobre cómo trabajamos juntos, tomamos decisiones o mejoramos el equipo.',
      author: 'Nombre del compañero/a',
      role: 'Rol · Empresa',
      placeholder: true,
    },
    {
      quote: 'Añade una recomendación sobre criterio técnico, comunicación o responsabilidad.',
      author: 'Nombre del compañero/a',
      role: 'Rol · Empresa',
      placeholder: true,
    },
    {
      quote: 'Añade una recomendación que explique qué aportó compartir un proyecto con Airán.',
      author: 'Nombre del compañero/a',
      role: 'Rol · Empresa',
      placeholder: true,
    },
  ],
  ja: [
    {
      quote: '一緒に働いた経験、意思決定、チームへの貢献についての推薦文を追加してください。',
      author: '同僚の名前',
      role: '役職 · 会社',
      placeholder: true,
    },
    {
      quote: '技術的な判断、コミュニケーション、オーナーシップについての推薦文を追加してください。',
      author: '同僚の名前',
      role: '役職 · 会社',
      placeholder: true,
    },
    {
      quote: 'Airánとプロジェクトに取り組んだ価値が伝わる推薦文を追加してください。',
      author: '同僚の名前',
      role: '役職 · 会社',
      placeholder: true,
    },
  ],
};

export const selectedWorkByLocale: Record<PortfolioLocale, SelectedWork[]> = {
  en: [
    {
      title: 'Case study 01',
      context: 'Problem and context to be confirmed.',
      contribution: 'Airán’s contribution to be confirmed.',
      outcome: 'Outcome or learning to be confirmed.',
      technologies: [],
      published: false,
    },
    {
      title: 'Case study 02',
      context: 'Problem and context to be confirmed.',
      contribution: 'Airán’s contribution to be confirmed.',
      outcome: 'Outcome or learning to be confirmed.',
      technologies: [],
      published: false,
    },
    {
      title: 'Case study 03',
      context: 'Problem and context to be confirmed.',
      contribution: 'Airán’s contribution to be confirmed.',
      outcome: 'Outcome or learning to be confirmed.',
      technologies: [],
      published: false,
    },
  ],
  es: [
    {
      title: 'Caso de trabajo 01',
      context: 'Problema y contexto pendientes de confirmar.',
      contribution: 'Aportación de Airán pendiente de confirmar.',
      outcome: 'Resultado o aprendizaje pendiente de confirmar.',
      technologies: [],
      published: false,
    },
    {
      title: 'Caso de trabajo 02',
      context: 'Problema y contexto pendientes de confirmar.',
      contribution: 'Aportación de Airán pendiente de confirmar.',
      outcome: 'Resultado o aprendizaje pendiente de confirmar.',
      technologies: [],
      published: false,
    },
    {
      title: 'Caso de trabajo 03',
      context: 'Problema y contexto pendientes de confirmar.',
      contribution: 'Aportación de Airán pendiente de confirmar.',
      outcome: 'Resultado o aprendizaje pendiente de confirmar.',
      technologies: [],
      published: false,
    },
  ],
  ja: [
    {
      title: 'ケーススタディ 01',
      context: '課題と背景は確認待ちです。',
      contribution: 'Airánの貢献内容は確認待ちです。',
      outcome: '成果や学びは確認待ちです。',
      technologies: [],
      published: false,
    },
    {
      title: 'ケーススタディ 02',
      context: '課題と背景は確認待ちです。',
      contribution: 'Airánの貢献内容は確認待ちです。',
      outcome: '成果や学びは確認待ちです。',
      technologies: [],
      published: false,
    },
    {
      title: 'ケーススタディ 03',
      context: '課題と背景は確認待ちです。',
      contribution: 'Airánの貢献内容は確認待ちです。',
      outcome: '成果や学びは確認待ちです。',
      technologies: [],
      published: false,
    },
  ],
};
