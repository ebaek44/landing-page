(() => {
  'use strict';
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const media = window.PORTFOLIO_MEDIA || {};
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const safeImagePath = value => typeof value === 'string' && /^images\/personal\/[a-zA-Z0-9_./ -]+\.(avif|webp|png|jpe?g|svg)$/i.test(value) && !value.includes('..');

  function imageFor(src, alt, position, eager = false) {
    if (!safeImagePath(src)) return null;
    const img = document.createElement('img');
    img.alt = alt || '';
    img.loading = eager ? 'eager' : 'lazy';
    img.decoding = 'async';
    if (position) img.style.objectPosition = position;
    img.src = src;
    return img;
  }

  function fillPhoto(selector, src, alt, position) {
    const slot = document.querySelector(selector);
    const img = imageFor(src, alt, position);
    if (!slot || !img) return;
    img.addEventListener('load', () => slot.querySelector('.photo-art')?.remove(), { once: true });
    img.addEventListener('error', () => img.remove(), { once: true });
    slot.prepend(img);
  }
  const aveva = media.aveva || {};
  fillPhoto('#aveva-photo', aveva.teamPhoto, aveva.teamAlt, aveva.teamPosition);
  const headstarter = media.headstarter || {};
  fillPhoto('#headstarter-photo', headstarter.photo, headstarter.alt, headstarter.position);
  const logoSlot = document.querySelector('#aveva-logo');
  const logo = imageFor(aveva.logo, 'AVEVA', null, true);
  if (logoSlot && logo) logo.addEventListener('load', () => logoSlot.replaceChildren(logo), { once: true });

  // A continuous arc: input adds momentum, while the page keeps its native scroll.
  const wheel = document.querySelector('#outside:not([hidden]) .photo-wheel');
  const track = wheel?.querySelector('#photo-track');
  const photos = media.photos?.length ? media.photos : Array.from({ length: 5 }, () => ({ placeholder: true }));
  const cards = [];
  if (track) photos.forEach((photo, index) => {
    const card = document.createElement('figure');
    card.className = 'photo-card';
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', photo.placeholder ? `Photo illustration ${index + 1}` : photo.alt || photo.caption || `Photo ${index + 1}`);
    const illustration = () => {
      const art = document.createElement('div');
      art.className = `photo-placeholder placeholder-${index % 5}`;
      art.setAttribute('aria-hidden', 'true');
      return art;
    };
    const img = !photo.placeholder && imageFor(photo.src, photo.alt, photo.position);
    if (img) {
      img.addEventListener('error', () => img.replaceWith(illustration()), { once: true });
      card.append(img);
    } else card.append(illustration());
    if (!photo.placeholder && photo.caption) {
      const caption = document.createElement('figcaption');
      caption.textContent = photo.caption;
      card.append(caption);
    }
    track.append(card);
    cards.push(card);
  });

  let phase = 0;
  let momentum = 0;
  let wheelVisible = false;
  let frame = 0;
  let previousTime = 0;
  let floatTime = 0;
  function renderWheel() {
    const count = cards.length;
    const half = count / 2;
    const edge = Math.min(half, 2.55);
    cards.forEach((card, index) => {
      const offset = count === 1 ? 0 : ((index - phase + half) % count + count) % count - half;
      card.style.setProperty('--offset', offset.toFixed(4));
      card.style.setProperty('--depth', Math.abs(offset).toFixed(4));
      card.style.setProperty('--float', `${preference.matches ? 0 : Math.sin(floatTime * .7 + index * 1.6) * 4}px`);
      card.style.setProperty('--photo-z', String(20 - Math.round(Math.abs(offset) * 3)));
      card.style.setProperty('--photo-opacity', count === 1 ? 1 : clamp((edge - Math.abs(offset)) / .6, 0, 1).toFixed(3));
      card.setAttribute('aria-hidden', String(Math.abs(offset) > .6));
    });
  }
  function stopWheel() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
  }
  function animateWheel(time) {
    frame = 0;
    if (preference.matches || !wheelVisible || document.hidden) return;
    const delta = previousTime ? Math.min((time - previousTime) / 1000, .05) : 0;
    previousTime = time;
    floatTime += delta;
    if (cards.length > 1) phase = (phase + (.04 + momentum) * delta + photos.length) % photos.length;
    momentum *= Math.exp(-delta * 2.1);
    renderWheel();
    frame = requestAnimationFrame(animateWheel);
  }
  function startWheel() {
    if (!frame && !preference.matches && wheelVisible && !document.hidden) frame = requestAnimationFrame(animateWheel);
  }
  function addMomentum(amount) {
    if (preference.matches) {
      phase = (phase + clamp(amount, -.65, .65) + photos.length) % photos.length;
      renderWheel();
    } else {
      momentum = clamp(momentum + amount, -1.6, 1.6);
      startWheel();
    }
  }
  if (wheel) {
    new IntersectionObserver(entries => {
      wheelVisible = entries[0].isIntersecting;
      if (wheelVisible) startWheel(); else stopWheel();
    }, { threshold: .05 }).observe(wheel);
    wheel.addEventListener('wheel', event => {
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      addMomentum(delta * unit * .003);
    }, { passive: true });
    let touchY = null;
    wheel.addEventListener('touchstart', event => { touchY = event.touches[0]?.clientY ?? null; }, { passive: true });
    wheel.addEventListener('touchmove', event => {
      const nextY = event.touches[0]?.clientY;
      if (touchY !== null && nextY !== undefined) addMomentum((touchY - nextY) * .012);
      touchY = nextY ?? null;
    }, { passive: true });
    wheel.addEventListener('touchend', () => { touchY = null; }, { passive: true });
    wheel.addEventListener('touchcancel', () => { touchY = null; }, { passive: true });
    wheel.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      addMomentum(event.key === 'ArrowRight' ? 1 : -1);
    });
    renderWheel();
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopWheel(); else startWheel(); });
  window.addEventListener('pagehide', stopWheel);

  const rail = document.querySelector('.section-rail');
  const links = [...(rail?.querySelectorAll('a:not([hidden])') || [])];
  const sections = [...document.querySelectorAll('main > section[id]:not([hidden])')];
  let activeId;
  let scrollFrame = 0;
  let previousScrollY = window.scrollY;
  function updateNavigation() {
    scrollFrame = 0;
    const threshold = innerHeight * .35;
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    const atBottom = maxScroll > 0 && window.scrollY >= maxScroll - 2;
    const current = atBottom
      ? sections.at(-1)
      : [...sections].reverse().find(section => section.getBoundingClientRect().top <= threshold) || sections[0];
    if (!current || current.id === activeId) return;
    activeId = current.id;
    links.forEach(link => {
      if (link.hash === `#${activeId}`) {
        link.setAttribute('aria-current', 'location');
        rail.style.setProperty('--active-y', `${link.offsetTop}px`);
        rail.style.setProperty('--active-height', `${link.offsetHeight}px`);
      } else link.removeAttribute('aria-current');
    });
  }
  function scheduleNavigation() {
    const distance = window.scrollY - previousScrollY;
    previousScrollY = window.scrollY;
    // Also respond to native scrollbar, keyboard, and touch page scrolling.
    // Large jumps into a section do not produce a burst of gallery movement.
    if (wheelVisible && Math.abs(distance) < innerHeight * .4) addMomentum(distance * .003);
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateNavigation);
  }
  window.addEventListener('scroll', scheduleNavigation, { passive: true });
  window.addEventListener('resize', () => { activeId = null; scheduleNavigation(); });
  updateNavigation();

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  const hero = document.querySelector('.hero');
  if (hero) new IntersectionObserver(entries => hero.classList.toggle('is-active', entries[0].isIntersecting)).observe(hero);
  function updateMotion() {
    root.classList.toggle('js-motion', !preference.matches);
    if (preference.matches) { stopWheel(); momentum = 0; renderWheel(); } else startWheel();
  }
  preference.addEventListener('change', updateMotion);
  updateMotion();

  if (matchMedia('(hover: hover) and (pointer: fine)').matches) document.querySelectorAll('[data-tilt]').forEach(panel => {
    let pointerFrame = 0;
    panel.addEventListener('pointermove', event => {
      if (preference.matches || pointerFrame) return;
      const { clientX, clientY } = event;
      pointerFrame = requestAnimationFrame(() => {
        const rect = panel.getBoundingClientRect();
        panel.style.setProperty('--tilt-x', `${-(clientY - rect.top - rect.height / 2) / rect.height * 2}deg`);
        panel.style.setProperty('--tilt-y', `${(clientX - rect.left - rect.width / 2) / rect.width * 2}deg`);
        pointerFrame = 0;
      });
    });
    panel.addEventListener('pointerleave', () => {
      cancelAnimationFrame(pointerFrame); pointerFrame = 0;
      panel.style.setProperty('--tilt-x', '0deg'); panel.style.setProperty('--tilt-y', '0deg');
    });
  });
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
