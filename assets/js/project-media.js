(() => {
  'use strict';
  const projects = window.PORTFOLIO_MEDIA?.projects || {};
  document.querySelectorAll('[data-project-image]').forEach(slot => {
    const project = projects[slot.dataset.projectImage];
    const path = project?.screenshot;
    if (typeof path !== 'string' || !/^images\/projects\/[a-zA-Z0-9_./ -]+\.(png|jpe?g|webp|avif)$/i.test(path) || path.includes('..')) return;
    const image = document.createElement('img');
    image.alt = project.alt || `${slot.dataset.projectImage} application screenshot`;
    image.decoding = 'async';
    image.style.objectPosition = project.position || '50% 50%';
    image.addEventListener('load', () => {
      slot.replaceChildren(image);
      slot.classList.add('has-screenshot');
    }, { once: true });
    // A missing image leaves the existing illustration intact.
    image.src = path;
  });
})();
