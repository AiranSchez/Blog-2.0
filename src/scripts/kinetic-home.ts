import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop = window.matchMedia('(min-width: 1025px)');
const $ = <T extends Element = Element>(selector: string, scope: ParentNode = document) => scope.querySelector<T>(selector);
const $$ = <T extends Element = Element>(selector: string, scope: ParentNode = document) => [...scope.querySelectorAll<T>(selector)];

/* Text motion */
const typewrite = (element: HTMLElement) => {
  const text = element.dataset.typewriter || element.textContent?.trim() || '';
  if (reduce.matches) {
    element.textContent = text;
    return;
  }
  element.textContent = '';
  const caret = document.createElement('span');
  caret.className = 'hero__caret';
  element.append(caret);
  let index = 0;
  const timer = window.setInterval(() => {
    if (index >= text.length) {
      window.clearInterval(timer);
      window.setTimeout(() => caret.remove(), 1400);
      return;
    }
    caret.before(text[index]);
    index += 1;
  }, 34);
  (element as HTMLElement & { _timer?: number })._timer = timer;
};
$$('[data-typewriter]').forEach((element) => typewrite(element as HTMLElement));

const countUp = (element: HTMLElement) => {
  const target = Number(element.dataset.count || 0);
  if (reduce.matches) {
    element.textContent = String(target);
    return;
  }
  const start = performance.now();
  const duration = 1100;
  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));
    if (progress < 1) window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);
};
$$('[data-count]').forEach((element) => countUp(element as HTMLElement));

/* Reveals */
const revealObserver =
  'IntersectionObserver' in window && !reduce.matches
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver?.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
      )
    : null;
$$('.fade').forEach((element) => {
  if (revealObserver) revealObserver.observe(element);
  else element.classList.add('is-visible');
});

const highlighterObserver =
  'IntersectionObserver' in window && !reduce.matches
    ? new IntersectionObserver(
        (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-active')),
        { threshold: 0.6 },
      )
    : null;
$$('.highlighter').forEach((element) => {
  if (highlighterObserver) highlighterObserver.observe(element);
  else element.classList.add('is-active');
});

const timelineObserver =
  'IntersectionObserver' in window && !reduce.matches
    ? new IntersectionObserver(
        (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
        { threshold: 0.15 },
      )
    : null;
$$('.timeline').forEach((element) => {
  if (timelineObserver) timelineObserver.observe(element);
  else element.classList.add('is-visible');
});

const shapeDivider = $('[data-shape-divider]');
if (shapeDivider) {
  if ('IntersectionObserver' in window && !reduce.matches) {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-active')),
      { threshold: 0.2 },
    );
    observer.observe(shapeDivider);
  } else {
    shapeDivider.classList.add('is-active');
  }
}

/* Scroll text */
$$('.scroll-text').forEach((element) => {
  const text = element.textContent?.trim();
  if (!text) return;
  element.innerHTML = text.split(/\s+/).map((word) => `<span class="word">${word}</span>`).join(' ');
  const words = $$('.word', element);
  if (!desktop.matches || reduce.matches) {
    words.forEach((word) => word.classList.add('is-active'));
    return;
  }
  ScrollTrigger.create({
    trigger: element,
    start: 'top 78%',
    end: 'bottom 42%',
    scrub: true,
    onUpdate(self) {
      const active = Math.floor(self.progress * words.length);
      words.forEach((word, index) => word.classList.toggle('is-active', index <= active));
    },
  });
});

/* Section rail */
const sectionRail = $('.section-rail');
if (sectionRail) {
  const links = $$('a', sectionRail);
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href') || ''))
    .filter((section): section is Element => Boolean(section));
  let ticking = false;
  const updateRail = () => {
    const marker = window.scrollY + window.innerHeight * 0.35;
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
    const bounds = sections.map((section) => {
      const spacer = section.closest('.pin-spacer');
      const element = spacer || section;
      return { id: section.id, top: element.getBoundingClientRect().top + window.scrollY };
    });
    let active = bounds[0]?.id;
    bounds.forEach((bound) => {
      if (bound.top <= marker) active = bound.id;
    });
    if (atBottom) active = bounds[bounds.length - 1]?.id;
    links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${active}`));
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateRail);
  }, { passive: true });
  updateRail();
}

/* Autoplay fallback */
$$<HTMLVideoElement>('video[data-autoplay]').forEach((video) => {
  if (reduce.matches) {
    video.pause();
    video.removeAttribute('autoplay');
  }
});

/* GSAP */
if (!reduce.matches) {
  if (desktop.matches) {
    if ($('.hero__portrait')) {
      gsap.to('.hero__portrait', { yPercent: 9, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
    if ($('.hero__burst')) {
      gsap.to('.hero__burst', { yPercent: -16, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    const pinScene = $('.pin-scene');
    const pin = $('.pin');
    const pinWord = $<HTMLElement>('.pin__word');
    const pinIndex = $$('.pin__index span');
    if (pinScene && pin && pinWord) {
      let current = 0;
      ScrollTrigger.create({
        trigger: pinScene,
        start: 'top top',
        end: 'bottom bottom',
        pin,
        scrub: true,
        onUpdate(self) {
          const words = (pinWord.dataset.words || '').split('|');
          const index = Math.min(words.length - 1, Math.floor(self.progress * words.length));
          if (index === current) return;
          current = index;
          pinWord.classList.add('is-flipping');
          window.clearTimeout((pinWord as HTMLElement & { _flipTimer?: number })._flipTimer);
          (pinWord as HTMLElement & { _flipTimer?: number })._flipTimer = window.setTimeout(() => {
            pinWord.textContent = words[index];
            pinWord.classList.remove('is-flipping');
          }, 130);
          pinIndex.forEach((item, i) => item.classList.toggle('is-active', i === index));
        },
      });
    }

    const railScene = $('.rail-scene');
    const railTrack = $('.rail__track');
    const railViewport = $('.rail');
    if (railScene && railTrack) {
      const distance = () => Math.max(0, (railTrack as HTMLElement).scrollWidth - (railViewport ? (railViewport as HTMLElement).clientWidth : window.innerWidth));
      gsap.to(railTrack, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: railScene, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
      });
      railScene.classList.add('is-pinned');
    }
  }

  if (!desktop.matches) {
    const pinScene = $('.pin-scene');
    const pinWord = $<HTMLElement>('.pin__word');
    const pinIndex = $$('.pin__index span');
    if (pinScene && pinWord) {
      let current = 0;
      ScrollTrigger.create({
        trigger: pinScene,
        start: 'top 82%',
        end: 'bottom 30%',
        scrub: true,
        onUpdate(self) {
          const words = (pinWord.dataset.words || '').split('|');
          const index = Math.min(words.length - 1, Math.floor(self.progress * words.length));
          if (index === current) return;
          current = index;
          pinWord.classList.add('is-flipping');
          window.clearTimeout((pinWord as HTMLElement & { _flipTimer?: number })._flipTimer);
          (pinWord as HTMLElement & { _flipTimer?: number })._flipTimer = window.setTimeout(() => {
            pinWord.textContent = words[index];
            pinWord.classList.remove('is-flipping');
          }, 130);
          pinIndex.forEach((item, i) => item.classList.toggle('is-active', i === index));
        },
      });
    }
  }

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

/* Carousel */
$$('[data-carousel]').forEach((carousel) => {
  const track = $<HTMLElement>('.carousel__track', carousel);
  const cards = track ? [...track.children] : [];
  const prev = $('[data-carousel-prev]', carousel);
  const next = $('[data-carousel-next]', carousel);
  const dots = $('[data-carousel-dots]', carousel);
  if (!track || cards.length === 0) return;

  let index = 0;
  const visible = () => {
    const viewport = $('.carousel__viewport', carousel);
    if (!viewport) return 1;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return Math.max(1, Math.floor((viewport.clientWidth + gap) / (cardWidth + gap)));
  };
  const maxIndex = () => Math.max(0, cards.length - visible());
  const renderDots = () => {
    if (!dots) return;
    dots.innerHTML = '';
    for (let i = 0; i <= maxIndex(); i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `carousel__dot${i === index ? ' is-active' : ''}`;
      dot.setAttribute('aria-label', `${(carousel as HTMLElement).dataset.episodeWord || 'Episodio'} ${i + 1}`);
      dot.addEventListener('click', () => {
        index = i;
        update();
      });
      dots.appendChild(dot);
    }
  };
  const update = () => {
    index = Math.max(0, Math.min(index, maxIndex()));
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = cards[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(${-index * step}px)`;
    $$('.carousel__dot', carousel).forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  };
  prev?.addEventListener('click', () => {
    index -= 1;
    update();
  });
  next?.addEventListener('click', () => {
    index += 1;
    update();
  });
  renderDots();
  update();
  window.addEventListener('resize', () => {
    renderDots();
    update();
  });
});

/* Podcast archive: show eight, load the rest */
const podcastMore = $<HTMLButtonElement>('[data-podcast-more]');
if (podcastMore) {
  const grid = $('[data-podcast-grid]');
  const cards = grid ? $$<HTMLElement>('.podcast-card', grid) : [];
  let expanded = false;
  const updateMore = () => {
    cards.forEach((card, index) => {
      card.hidden = !expanded && index >= 8;
    });
    podcastMore.hidden = expanded || cards.length <= 8;
  };
  podcastMore.addEventListener('click', () => {
    expanded = true;
    updateMore();
  });
  updateMore();
}

/* Episode modal */
const episodeModal = $<HTMLDialogElement>('[data-episode-modal]');
$$<HTMLButtonElement>('[data-episode]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!episodeModal) return;
    const title = $('[data-modal-title]', episodeModal);
    const meta = $('[data-modal-meta]', episodeModal);
    const description = $('[data-modal-description]', episodeModal);
    const player = $('[data-modal-player]', episodeModal);
    if (title) title.textContent = button.dataset.episodeTitle || '';
    if (meta) meta.textContent = button.dataset.episodeMeta || '';
    if (description) description.textContent = button.dataset.episodeDescription || '';
    if (player) player.innerHTML = `<iframe src="${button.dataset.episodeUrl}" width="400" height="250" loading="lazy" title="${button.dataset.episodeTitle || 'Reproductor'}"></iframe>`;
    episodeModal.showModal();
  });
});
episodeModal?.addEventListener('click', (event) => {
  const panel = $('.modal__panel', episodeModal);
  if (!panel) return;
  const bounds = panel.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) episodeModal.close();
});
$$('[data-modal-close]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});
