export type LegalPageId = 'privacy' | 'legal' | 'accessibility';
export type LegalLocale = 'en' | 'es' | 'ja';

interface Section {
  title: string;
  body: string[];
}

interface PageCopy {
  kicker: string;
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
}

export const legalCopy: Record<LegalLocale, Record<LegalPageId, PageCopy>> = {
  es: {
    privacy: {
      kicker: 'Legal · Privacidad',
      title: 'PRIVACIDAD.',
      updated: 'Última actualización: 12 de noviembre de 2026',
      intro: 'Qué datos trata esta web, para qué y cómo puedes pedir que los elimine.',
      sections: [
        {
          title: 'Responsable',
          body: [
            'El responsable del tratamiento es Airán Sánchez. Puedes escribir a <a href="mailto:airanschez0@gmail.com">airanschez0@gmail.com</a> para cualquier cuestión sobre esta política.',
          ],
        },
        {
          title: 'Datos que trato',
          body: [
            '<strong>Formulario de contacto.</strong> Nombre, correo y mensaje. El envío se procesa con Web3Forms y llega a mi correo para poder responderte.',
            '<strong>Comentarios.</strong> Nombre, texto, idioma, artículo y la dirección IP convertida en un hash irreversible para limitar el spam. Se guardan en Supabase. No se publica la IP.',
            '<strong>Preferencia de tema.</strong> El modo claro, oscuro o de contraste se guarda solo en el almacenamiento local de tu navegador. No se envía al servidor.',
          ],
        },
        {
          title: 'Para qué y con qué base',
          body: [
            'Responder a tus mensajes y mantener una conversación: tu consentimiento al enviar el formulario.',
            'Publicar y moderar comentarios, y proteger el servicio frente a abuso: tu consentimiento al publicar y el interés legítimo en mantener el sitio operativo.',
          ],
        },
        {
          title: 'Cuánto tiempo',
          body: [
            'Los mensajes de contacto se conservan mientras dure la conversación y el tiempo necesario para atender obligaciones legales. Los comentarios permanecen publicados hasta que pidas su eliminación.',
          ],
        },
        {
          title: 'Quién más interviene',
          body: [
            'Web3Forms procesa el formulario, Supabase almacena los comentarios y Vercel aloja el sitio. No hay analítica, publicidad ni cookies de seguimiento de terceros.',
          ],
        },
        {
          title: 'Tus derechos',
          body: [
            'Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos escribiendo al correo indicado. También puedes reclamar ante la Agencia Española de Protección de Datos.',
          ],
        },
      ],
    },
    legal: {
      kicker: 'Legal · Titularidad',
      title: 'AVISO LEGAL.',
      updated: 'Última actualización: 12 de noviembre de 2026',
      intro: 'Quién está detrás de esta web y bajo qué condiciones se publica.',
      sections: [
        {
          title: 'Titular',
          body: [
            'Este sitio es un portfolio personal de Airán Sánchez. Para cualquier comunicación: <a href="mailto:airanschez0@gmail.com">airanschez0@gmail.com</a>.',
          ],
        },
        {
          title: 'Objeto',
          body: [
            'La web es informativa: presenta mi perfil profesional, proyectos, artículos, podcast y formas de contacto. No vende productos ni presta servicios a través de ella.',
          ],
        },
        {
          title: 'Propiedad intelectual',
          body: [
            'Los textos, el diseño y el código propios de este sitio se publican con su autoría. Las marcas, nombres de producto y capturas de proyectos pertenecen a sus titulares y se usan para describir el trabajo realizado.',
            'Las citas de recomendaciones se reproducen con permiso de sus autores y se atribuyen siempre.',
          ],
        },
        {
          title: 'Uso del sitio',
          body: [
            'Puedes leer, citar con atribución y enlazar este contenido. No está permitido presentarlo como propio ni usarlo para suplantar identidad. El acceso es gratuito y no garantiza disponibilidad continua.',
          ],
        },
        {
          title: 'Enlaces externos',
          body: [
            'Los enlaces a otros sitios se ofrecen como referencia. No controlo su contenido ni sus políticas, y no respondo de ellos.',
          ],
        },
        {
          title: 'Legislación',
          body: [
            'Este aviso se rige por la legislación española. Cualquier controversia se someterá a los juzgados competentes del domicilio del titular.',
          ],
        },
      ],
    },
    accessibility: {
      kicker: 'Legal · Accesibilidad',
      title: 'ACCESIBILIDAD.',
      updated: 'Última actualización: 12 de noviembre de 2026',
      intro: 'El objetivo es WCAG 2.2 AA. Esto es lo que hay comprobado, lo que falta y cómo avisar de un problema.',
      sections: [
        {
          title: 'Compromiso',
          body: [
            'Trabajo para que el sitio se pueda usar con teclado, lector de pantalla, zoom y movimiento reducido. El objetivo declarado es WCAG 2.2 nivel AA, sin certificación externa todavía.',
          ],
        },
        {
          title: 'Qué está comprobado',
          body: [
            'Estructura semántica, un solo <code>h1</code> por página, enlace de salto, foco visible, formularios con etiquetas, contraste de texto y controles de al menos 44 px en móvil.',
            'El modo de alto contraste refuerza tinta, bordes y señal. Con <code>prefers-reduced-motion</code> se desactivan parallax, pinning, typewriter, contadores y el autoplay del vídeo.',
            'El vídeo del proyecto se reproduce silenciado y en bucle en la tarjeta; en el caso tiene controles. Las páginas de error ofrecen contenido en inglés si no hay JavaScript.',
          ],
        },
        {
          title: 'Limitaciones conocidas',
          body: [
            'El reproductor de los episodios se inserta desde iVoox y su accesibilidad depende de ese proveedor.',
            'Algunas imágenes antiguas del blog no tienen texto alternativo descriptivo. Se corrigen cuando se revisa cada artículo.',
            'La redirección del 404 al idioma del navegador necesita JavaScript. Sin él se muestra la versión inglesa completa.',
          ],
        },
        {
          title: 'Cómo avisar',
          body: [
            'Si encuentras una barrera, escribe a <a href="mailto:airanschez0@gmail.com">airanschez0@gmail.com</a> con la página y el problema. Lo reviso y respondo.',
          ],
        },
      ],
    },
  },
  en: {
    privacy: {
      kicker: 'Legal · Privacy',
      title: 'PRIVACY.',
      updated: 'Last updated: 12 November 2026',
      intro: 'What data this site handles, why, and how to ask for its removal.',
      sections: [
        {
          title: 'Controller',
          body: [
            'The controller is Airán Sánchez. Write to <a href="mailto:airanschez0@gmail.com">airanschez0@gmail.com</a> for anything related to this policy.',
          ],
        },
        {
          title: 'Data I handle',
          body: [
            '<strong>Contact form.</strong> Name, email and message. Delivery is processed by Web3Forms and reaches my inbox so I can reply.',
            '<strong>Comments.</strong> Name, text, language, article and the IP address turned into an irreversible hash to limit spam. They are stored in Supabase. The IP is never published.',
            '<strong>Theme preference.</strong> Light, dark or high contrast is stored only in your browser’s local storage. It is not sent to the server.',
          ],
        },
        {
          title: 'Why and on what basis',
          body: [
            'Replying to your messages and keeping a conversation: your consent when you submit the form.',
            'Publishing and moderating comments, and protecting the service from abuse: your consent when you post and the legitimate interest in keeping the site running.',
          ],
        },
        {
          title: 'How long',
          body: [
            'Contact messages are kept for the duration of the conversation and as long as needed for legal obligations. Comments stay published until you ask for their removal.',
          ],
        },
        {
          title: 'Who else is involved',
          body: [
            'Web3Forms processes the form, Supabase stores comments and Vercel hosts the site. There is no analytics, advertising or third-party tracking cookies.',
          ],
        },
        {
          title: 'Your rights',
          body: [
            'You can request access, rectification, erasure, objection, restriction and portability by writing to the address above. You can also complain to the Spanish Data Protection Agency.',
          ],
        },
      ],
    },
    legal: {
      kicker: 'Legal · Ownership',
      title: 'LEGAL NOTICE.',
      updated: 'Last updated: 12 November 2026',
      intro: 'Who runs this site and under what terms it is published.',
      sections: [
        {
          title: 'Owner',
          body: [
            'This is the personal portfolio of Airán Sánchez. For any communication: <a href="mailto:airanschez0@gmail.com">airanschez0@gmail.com</a>.',
          ],
        },
        {
          title: 'Purpose',
          body: [
            'The site is informational: it presents my professional profile, projects, articles, podcast and ways to get in touch. It does not sell products or provide services through the site.',
          ],
        },
        {
          title: 'Intellectual property',
          body: [
            'The original texts, design and code are published under their authorship. Trademarks, product names and project captures belong to their owners and are used to describe the work done.',
            'Recommendation quotes are reproduced with their authors’ permission and always attributed.',
          ],
        },
        {
          title: 'Using the site',
          body: [
            'You may read, quote with attribution and link to this content. You may not present it as your own or use it to impersonate anyone. Access is free and continuous availability is not guaranteed.',
          ],
        },
        {
          title: 'External links',
          body: [
            'Links to other sites are offered as references. I do not control their content or policies and I am not responsible for them.',
          ],
        },
        {
          title: 'Law',
          body: [
            'This notice is governed by Spanish law. Any dispute will be submitted to the competent courts at the owner’s domicile.',
          ],
        },
      ],
    },
    accessibility: {
      kicker: 'Legal · Accessibility',
      title: 'ACCESSIBILITY.',
      updated: 'Last updated: 12 November 2026',
      intro: 'The target is WCAG 2.2 AA. Here is what is verified, what is missing and how to report a problem.',
      sections: [
        {
          title: 'Commitment',
          body: [
            'I work so the site can be used with a keyboard, screen reader, zoom and reduced motion. The stated target is WCAG 2.2 level AA, with no external certification yet.',
          ],
        },
        {
          title: 'What is verified',
          body: [
            'Semantic structure, a single <code>h1</code> per page, skip link, visible focus, labelled forms, text contrast and controls of at least 44 px on mobile.',
            'High contrast mode strengthens ink, borders and signal. With <code>prefers-reduced-motion</code>, parallax, pinning, typewriter, counters and video autoplay are disabled.',
            'The project video plays muted and looped in the card; it has controls on the case page. Error pages offer English content when JavaScript is unavailable.',
          ],
        },
        {
          title: 'Known limitations',
          body: [
            'Episode players are embedded from iVoox and their accessibility depends on that provider.',
            'Some older blog images lack descriptive alternative text. They are fixed as each article is reviewed.',
            'The 404 redirect to the browser language needs JavaScript. Without it, the complete English version is shown.',
          ],
        },
        {
          title: 'How to report',
          body: [
            'If you find a barrier, write to <a href="mailto:airanschez0@gmail.com">airanschez0@gmail.com</a> with the page and the problem. I will review it and reply.',
          ],
        },
      ],
    },
  },
  ja: {
    privacy: {
      kicker: '法的情報 · プライバシー',
      title: 'プライバシー。',
      updated: '最終更新日：2026年11月12日',
      intro: 'このサイトが扱うデータ、その目的、削除の依頼方法について説明します。',
      sections: [
        {
          title: '管理者',
          body: [
            '管理者は Airán Sánchez です。本方針については <a href="mailto:airanschez0@gmail.com">airanschez0@gmail.com</a> までご連絡ください。',
          ],
        },
        {
          title: '扱うデータ',
          body: [
            '<strong>お問い合わせフォーム。</strong> 名前、メールアドレス、メッセージ。送信は Web3Forms で処理され、返信のために私のメールボックスに届きます。',
            '<strong>コメント。</strong> 名前、本文、言語、記事、およびスパム対策のために不可逆なハッシュに変換した IP アドレス。Supabase に保存されます。IP アドレスは公開しません。',
            '<strong>テーマの設定。</strong> ライト、ダーク、ハイコントラストの選択はブラウザのローカルストレージにのみ保存され、サーバーには送信されません。',
          ],
        },
        {
          title: '目的と根拠',
          body: [
            'メッセージへの返信と会話の継続：フォーム送信時の同意に基づきます。',
            'コメントの公開と管理、不正利用からの保護：投稿時の同意と、サイトを運営する正当な利益に基づきます。',
          ],
        },
        {
          title: '保存期間',
          body: [
            'お問い合わせは会話の期間および法的義務に必要な期間保存します。コメントは削除を依頼されるまで公開されます。',
          ],
        },
        {
          title: '第三者サービス',
          body: [
            'フォームは Web3Forms、コメントは Supabase、ホスティングは Vercel を利用します。アクセス解析、広告、第三者の追跡 Cookie はありません。',
          ],
        },
        {
          title: 'あなたの権利',
          body: [
            '上記のメールアドレスにご連絡いただくことで、アクセス、訂正、削除、異議、制限、データポータビリティを求めることができます。スペインのデータ保護機関に申し立てることもできます。',
          ],
        },
      ],
    },
    legal: {
      kicker: '法的情報 · 運営者',
      title: '法的情報。',
      updated: '最終更新日：2026年11月12日',
      intro: 'このサイトの運営者と公開条件について説明します。',
      sections: [
        {
          title: '運営者',
          body: [
            'このサイトは Airán Sánchez の個人ポートフォリオです。ご連絡先：<a href="mailto:airanschez0@gmail.com">airanschez0@gmail.com</a>。',
          ],
        },
        {
          title: '目的',
          body: [
            '本サイトは情報提供を目的とし、プロフィール、プロジェクト、記事、ポッドキャスト、連絡方法を掲載しています。サイト上での商品販売やサービス提供は行いません。',
          ],
        },
        {
          title: '知的財産',
          body: [
            '独自の文章、デザイン、コードは作者の名義で公開しています。商標、製品名、プロジェクトの画面は各権利者に帰属し、作業内容を説明するために使用しています。',
            '推薦文は作者の許可を得て引用し、必ず出典を明記します。',
          ],
        },
        {
          title: '利用条件',
          body: [
            '引用を明記した閲覧、引用、リンクは歓迎します。自分の作品として提示したり、なりすましに使用したりすることはできません。アクセスは無料ですが、常時の可用性は保証しません。',
          ],
        },
        {
          title: '外部リンク',
          body: [
            '外部サイトへのリンクは参考情報です。内容や方針を管理するものではなく、責任を負いません。',
          ],
        },
        {
          title: '準拠法',
          body: [
            '本情報はスペイン法に準拠します。紛争は運営者の住所地の管轄裁判所に委ねられます。',
          ],
        },
      ],
    },
    accessibility: {
      kicker: '法的情報 · アクセシビリティ',
      title: 'アクセシビリティ。',
      updated: '最終更新日：2026年11月12日',
      intro: '目標は WCAG 2.2 AA です。確認済みのこと、不足していること、問題の報告方法をまとめます。',
      sections: [
        {
          title: '方針',
          body: [
            'キーボード、スクリーンリーダー、ズーム、動きの削減設定で使えることを目指しています。目標は WCAG 2.2 レベル AA ですが、外部認証はまだ受けていません。',
          ],
        },
        {
          title: '確認済みのこと',
          body: [
            '意味のある構造、1ページに1つの <code>h1</code>、スキップリンク、明確なフォーカス、ラベルのあるフォーム、テキストのコントラスト、モバイルで44px以上の操作領域。',
            'ハイコントラストモードでは文字、境界線、シグナル色を強めます。<code>prefers-reduced-motion</code> ではパララックス、固定表示、タイプライター、カウンター、動画の自動再生を停止します。',
            'プロジェクト動画はカード内で無音・ループ再生し、ケースページでは操作コントロールがあります。JavaScript がない場合、エラーページは英語版を表示します。',
          ],
        },
        {
          title: '既知の制限',
          body: [
            'エピソードのプレーヤーは iVoox から埋め込んでおり、アクセシビリティは提供元に依存します。',
            '古いブログ画像の一部には説明的な代替テキストがありません。記事の見直し時に修正します。',
            '404 の言語リダイレクトには JavaScript が必要です。ない場合は完全な英語版を表示します。',
          ],
        },
        {
          title: '報告方法',
          body: [
            '障壁を見つけた場合は、ページと問題を <a href="mailto:airanschez0@gmail.com">airanschez0@gmail.com</a> までお知らせください。確認して返信します。',
          ],
        },
      ],
    },
  },
};
