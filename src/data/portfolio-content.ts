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
      quote: 'On the different occasions when I have had the opportunity to work with Airán, it has been a real privilege, as he is a great professional and teammate. He has demonstrated extensive knowledge of both back-end and front-end development, implementing intelligent solutions using methodologies such as TDD or XP. His experience with code gives you tremendous confidence and peace of mind day to day, and he integrates perfectly into the team. I would genuinely love to work with Airán again on another project and continue learning from all the knowledge I know he has to offer.',
      author: 'Michael Reyes',
      role: 'Lead Frontend Specialist & Consultant · Lean Mind',
      url: 'https://www.mreysei.dev',
      placeholder: false,
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
      quote: 'En las distintas ocasiones en las que he podido trabajar con Airán ha sido todo un privilegio, ya que es un gran profesional y compañero de equipo. Ha demostrado grandes conocimientos tanto en back-end como en front-end e implementando soluciones inteligentes utilizando metodologías como TDD o XP. Su veteranía con el código te ofrece una tremenda confianza y tranquilidad en el día a día y se integra perfectamente en el equipo. Realmente me gustaría volver a coincidir con Airán en otro proyecto para poder seguir aprendiendo todo el conocimiento que sé que me va a ofrecer.',
      author: 'Michael Reyes',
      role: 'Lead Frontend Specialist & Consultant · Lean Mind',
      url: 'https://www.mreysei.dev',
      placeholder: false,
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
      quote: 'これまで何度かAiránと一緒に仕事をする機会がありましたが、それは本当に光栄なことでした。彼は優れたプロフェッショナルであり、素晴らしいチームメイトです。バックエンドとフロントエンドの両方に深い知識を持ち、TDDやXPといった手法を活用して、優れたソリューションを実装してきました。豊富なコーディング経験が日々の仕事に大きな安心感と信頼をもたらし、チームにも自然に溶け込みます。いつかまた別のプロジェクトでAiránと一緒に働き、彼が持つ多くの知識から学び続けたいと心から思います。',
      author: 'Michael Reyes',
      role: 'リード・フロントエンド・スペシャリスト兼コンサルタント · Lean Mind',
      url: 'https://www.mreysei.dev',
      placeholder: false,
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
