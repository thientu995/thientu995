// =============================================================================
// Client-side behaviors - vanilla, dependency-free. Everything degrades
// gracefully: with JS disabled the full content stays visible, only the
// progressive niceties (reveal, counters, autoplay) are skipped.
// =============================================================================

const reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Theme toggle ----------
(() => {
    const btn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
    if (!btn) return;

    const setLabel = () => {
        const light = document.documentElement.getAttribute('data-theme') === 'light';
        btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
        btn.setAttribute('title', light ? 'Switch to dark theme' : 'Switch to light theme');
    };
    setLabel();

    btn.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) document.documentElement.removeAttribute('data-theme');
        else document.documentElement.setAttribute('data-theme', 'light');
        try {
            localStorage.setItem('theme', isLight ? 'dark' : 'light');
        } catch {
            /* private mode - preference simply won't persist */
        }
        setLabel();
    });
})();

// ---------- Mobile navigation ----------
(() => {
    const header = document.querySelector<HTMLElement>('.site-header');
    const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
    if (!header || !toggle) return;

    toggle.addEventListener('click', () => {
        const open = header.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.style.overflow = open ? 'hidden' : '';
    });

    header.querySelectorAll('.header-nav a').forEach((a) => {
        a.addEventListener('click', () => {
            header.classList.remove('nav-open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
})();

// ---------- Scrollspy: highlight the nav link of the section in view ----------
(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a.nav-spy'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    const map = new Map<string, HTMLAnchorElement>();
    const sections: HTMLElement[] = [];
    links.forEach((a) => {
        const id = (a.getAttribute('href') ?? '').slice(1);
        const el = id && document.getElementById(id);
        if (el) {
            map.set(id, a);
            sections.push(el);
        }
    });

    const setActive = (id: string | null) =>
        links.forEach((a) => a.classList.toggle('active', id !== null && a === map.get(id)));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                // Mapped section -> activate it; otherwise (hero) clear.
                setActive(map.has(entry.target.id) ? entry.target.id : null);
            });
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    const hero = document.getElementById('hero');
    if (hero) observer.observe(hero);
})();

// ---------- Reveal on scroll ----------
(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('in'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    obs.unobserve(entry.target);
                }
            });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    items.forEach((el) => observer.observe(el));
})();

// ---------- Animated counters (facts strip) ----------
(() => {
    const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
    if (!counters.length) return;

    const render = (el: HTMLElement, value: number) => {
        el.textContent = value.toLocaleString('en-US');
    };

    if (reduceMotion || !('IntersectionObserver' in window)) {
        counters.forEach((el) => render(el, Number(el.dataset.count ?? 0)));
        return;
    }

    const animate = (el: HTMLElement) => {
        const target = Number(el.dataset.count ?? 0);
        const duration = 1300;
        const start = performance.now();
        const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            // Ease-out cubic for a natural slowdown.
            const eased = 1 - Math.pow(1 - t, 3);
            render(el, Math.round(target * eased));
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate(entry.target as HTMLElement);
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 },
    );

    counters.forEach((el) => {
        render(el, 0);
        observer.observe(el);
    });
})();

// ---------- Testimonials slider ----------
(() => {
    const root = document.querySelector<HTMLElement>('[data-slider]');
    if (!root) return;

    const slides = Array.from(root.querySelectorAll<HTMLElement>('.ts-slide'));
    const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('.ts-dot'));
    const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-next]');
    if (slides.length < 2) return;

    let index = 0;
    let timer: number | undefined;

    const show = (i: number) => {
        index = (i + slides.length) % slides.length;
        slides.forEach((s, n) => {
            s.classList.toggle('active', n === index);
            s.setAttribute('aria-hidden', String(n !== index));
        });
        dots.forEach((d, n) => {
            d.classList.toggle('active', n === index);
            d.setAttribute('aria-current', String(n === index));
        });
    };

    const stop = () => {
        if (timer !== undefined) window.clearInterval(timer);
        timer = undefined;
    };
    const play = () => {
        stop();
        if (!reduceMotion) timer = window.setInterval(() => show(index + 1), 6500);
    };

    next?.addEventListener('click', () => {
        show(index + 1);
        play();
    });
    prev?.addEventListener('click', () => {
        show(index - 1);
        play();
    });
    dots.forEach((d, n) =>
        d.addEventListener('click', () => {
            show(n);
            play();
        }),
    );
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', play);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', play);

    // Swipe support for touch devices.
    let startX = 0;
    root.addEventListener(
        'touchstart',
        (e) => {
            startX = e.touches[0].clientX;
        },
        { passive: true },
    );
    root.addEventListener(
        'touchend',
        (e) => {
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 48) {
                show(index + (dx < 0 ? 1 : -1));
                play();
            }
        },
        { passive: true },
    );

    show(0);
    play();
})();

// ---------- Footer year ----------
(() => {
    const el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
})();
